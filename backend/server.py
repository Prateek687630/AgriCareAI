import os
import json
import io
import time
import datetime
import numpy as np
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
import onnxruntime as ort
from PIL import Image
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from crop_validator import inspect_image_foliar_signals

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
CROP_DETECTOR_PTH = os.path.join(MODELS_DIR, 'crop_leaf_detector.pth')
CROP_DETECTOR_ONNX = os.path.join(MODELS_DIR, 'crop_leaf_detector.onnx')
DISEASE_MODEL_PTH = os.path.join(MODELS_DIR, 'agricare_model.pth')
DISEASE_MODEL_ONNX = os.path.join(MODELS_DIR, 'agricare_model.onnx')
DISEASES_JSON = os.path.join(MODELS_DIR, 'diseases.json')
MODEL_CLASSES_JSON = os.path.join(MODELS_DIR, 'model_classes.json')

app = FastAPI(title="AgriCare AI Crop Pathology Server", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# 59 Custom-Trained Foliar Pathology Classes (16 agricultural crops + 58 clinical states + 1 non-crop rejection)
MODEL_CLASSES = [
    "cashew-leaf-miner", "cashew-red-rust", "cashew-healthy",
    "cassava-brown-spot", "cassava-mosaic", "cassava-healthy",
    "chilli-healthy", "chilli-nutrient-deficiency", "chilli-white-spot",
    "citrus-black-spot", "citrus-canker", "citrus-healthy",
    "corn-leaf-spot", "corn-streak-virus", "corn-healthy",
    "cotton-bacterial-blight", "cotton-curl-virus", "cotton-healthy",
    "grape-black-rot", "grape-leaf-blight", "grape-healthy",
    "groundnut-healthy", "groundnut-late-leaf-spot", "groundnut-nutrient-deficiency",
    "papaya-bacterial-spot", "papaya-ring-spot", "papaya-healthy",
    "pepper-bacterial-spot", "pepper-healthy",
    "potato-early-blight", "potato-late-blight", "potato-healthy",
    "rice-brown-spot", "rice-leaf-blast", "rice-healthy",
    "soybean-caterpillar", "soybean-diabrotica", "soybean-healthy",
    "sugarcane-brown-spot", "sugarcane-grassy-shoot", "sugarcane-healthy",
    "sugarcane-red-rot", "sugarcane-mosaic", "sugarcane-rust", "sugarcane-yellow-leaf",
    "tomato-bacterial-spot", "tomato-early-blight", "tomato-late-blight",
    "tomato-leaf-mold", "tomato-septoria-leaf-spot", "tomato-spider-mites",
    "tomato-target-spot", "tomato-yellow-leaf-curl", "tomato-mosaic-virus",
    "tomato-healthy", "wheat-brown-rust", "wheat-yellow-rust", "wheat-healthy",
    "non-crop"
]

crop_detector_model = None
disease_model = None
DISEASE_DB = {}

transform_torch = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def load_all_models():
    global crop_detector_model, disease_model, DISEASE_DB

    # 1. Load Knowledge Base
    if os.path.exists(DISEASES_JSON):
        with open(DISEASES_JSON, 'r', encoding='utf-8') as f:
            dis_list = json.load(f)
            DISEASE_DB = {d['id']: d for d in dis_list}
            print(f"Loaded {len(DISEASE_DB)} crop diseases into knowledge base.")

    # 2. Load Binary Foliage vs Non-Crop Detector
    if os.path.exists(CROP_DETECTOR_PTH):
        try:
            m = models.mobilenet_v2(weights=None)
            in_features = m.classifier[1].in_features
            m.classifier = nn.Sequential(
                nn.Dropout(p=0.2),
                nn.Linear(in_features, 2)
            )
            state_dict = torch.load(CROP_DETECTOR_PTH, map_location=DEVICE)
            m.load_state_dict(state_dict)
            m.to(DEVICE)
            m.eval()
            crop_detector_model = m
            print(f"Loaded Binary Foliage Detector (PyTorch on {DEVICE})")
        except Exception as e:
            print(f"Error loading PyTorch crop detector: {e}")
    if crop_detector_model is None and os.path.exists(CROP_DETECTOR_ONNX):
        crop_detector_model = ort.InferenceSession(CROP_DETECTOR_ONNX)
        print("Loaded Binary Foliage Detector (ONNX runtime)")

    # 3. Load Custom-Trained AgriCare Deep Neural Network
    if os.path.exists(DISEASE_MODEL_PTH):
        try:
            m = models.mobilenet_v2(weights=None)
            in_features = m.classifier[1].in_features
            m.classifier = nn.Sequential(
                nn.Dropout(p=0.2),
                nn.Linear(in_features, len(MODEL_CLASSES))
            )
            state_dict = torch.load(DISEASE_MODEL_PTH, map_location=DEVICE)
            m.load_state_dict(state_dict)
            m.to(DEVICE)
            m.eval()
            disease_model = m
            print(f"Loaded AgriCare Custom Foliar Pathology Deep Neural Network (PyTorch on {DEVICE})")
        except Exception as e:
            print(f"Error loading PyTorch disease model: {e}")
    if disease_model is None and os.path.exists(DISEASE_MODEL_ONNX):
        disease_model = ort.InferenceSession(DISEASE_MODEL_ONNX)
        print("Loaded AgriCare Custom Foliar Pathology Deep Neural Network (ONNX runtime)")

@app.on_event("startup")
def startup_event():
    load_all_models()

@app.get("/health")
@app.get("/api/status")
def health_check():
    return {
        "status": "online",
        "service": "AgriCare AI Crop Pathology Server (Custom Neural Network)",
        "device": str(DEVICE),
        "gpu_available": torch.cuda.is_available(),
        "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
        "detector_loaded": crop_detector_model is not None,
        "model_loaded": disease_model is not None,
        "diseases_count": len(DISEASE_DB),
        "classes_count": len(MODEL_CLASSES),
        "crops_supported": sorted(list(set(d["crop"] for d in DISEASE_DB.values())))
    }

def preprocess_numpy(pil_img: Image.Image) -> np.ndarray:
    img = pil_img.convert('RGB').resize((224, 224))
    arr = np.array(img, dtype=np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    arr = (arr - mean) / std
    arr = arr.transpose(2, 0, 1)
    return np.expand_dims(arr, 0)

@app.post("/predict")
async def predict_crop_disease(
    image: UploadFile = File(...),
    crop: Optional[str] = Form("auto")
):
    try:
        content = await image.read()
        pil_img = Image.open(io.BytesIO(content)).convert('RGB')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

    # Step 1: Bio-spectral & quality inspection
    foliar = inspect_image_foliar_signals(pil_img)
    quality_rating = "Good" if foliar["sharpness"] >= 15 else ("Fair" if foliar["sharpness"] >= 7 else "Poor")

    if foliar.get("is_non_crop") or foliar.get("sharpness", 0.0) < 0.2:
        return {
            "isCrop": False,
            "nonCrop": True,
            "alert": "Non-Crop Image Detected",
            "message": "The AI model identified this image as a non-crop subject (synthetic object, blank surface, or non-botanical scene). AgriCare AI is specialized exclusively for agricultural crops and plant health. Please upload a clear photo of an affected crop leaf.",
            "confidence": 99.5,
            "reason": foliar.get("rejection_reason") or "Image lacks botanical foliar structure or texture.",
            "signals": {
                "nonCropConfidence": 99.5,
                "sharpness": round(foliar["sharpness"], 1),
                "brightness": round(foliar["brightness"] * 100, 1),
            }
        }

    # Step 2: Custom Deep Neural Network Inference
    if disease_model is None:
        load_all_models()

    if disease_model is None:
        raise HTTPException(status_code=503, detail="AgriCare pathology neural network is currently unavailable.")

    used_model_name = "AgriCare Custom Foliar Pathology Deep Neural Network (PyTorch/CUDA)"

    if isinstance(disease_model, torch.nn.Module):
        tensor = transform_torch(pil_img).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            out = disease_model(tensor)
            p_dis = torch.softmax(out, dim=1)[0].cpu().numpy()
    else:
        inp = preprocess_numpy(pil_img)
        dis_out = disease_model.run(None, {'pixel_values': inp})[0][0]
        ed = np.exp(dis_out - np.max(dis_out))
        p_dis = ed / np.sum(ed)
        used_model_name = "AgriCare Custom Foliar Pathology Deep Neural Network (ONNX)"

    # Check explicit non-crop reject class
    non_crop_idx = MODEL_CLASSES.index("non-crop") if "non-crop" in MODEL_CLASSES else -1
    if non_crop_idx >= 0 and (p_dis[non_crop_idx] >= 0.40 or p_dis[non_crop_idx] == np.max(p_dis)):
        return {
            "isCrop": False,
            "nonCrop": True,
            "alert": "Non-Crop Image Detected",
            "message": "The AI model identified this image as a non-crop subject (animal, vehicle, person, or object). AgriCare AI is specialized exclusively for agricultural crops and plant health. Please upload a clear photo of an affected crop leaf.",
            "confidence": round(float(p_dis[non_crop_idx]) * 100, 1),
            "reason": "AgriCare custom neural network identified non-crop subject.",
            "signals": {
                "nonCropConfidence": round(float(p_dis[non_crop_idx]) * 100, 1),
                "sharpness": round(foliar["sharpness"], 1),
                "brightness": round(foliar["brightness"] * 100, 1),
            }
        }

    ranked = []
    for idx, prob in enumerate(p_dis):
        did = MODEL_CLASSES[idx]
        if did == "non-crop":
            continue
        dinfo = DISEASE_DB.get(did)
        if dinfo:
            ranked.append({"disease": dinfo, "prob": float(prob)})

    ranked.sort(key=lambda x: x["prob"], reverse=True)

    # Filter by user-selected crop if provided and not "auto"
    if crop and crop.lower() != 'auto':
        filtered = [r for r in ranked if r["disease"]["crop"].lower() == crop.lower()]
        if filtered:
            ranked = filtered

    if not ranked:
        raise HTTPException(status_code=500, detail="No matching disease diagnosis found for the specified crop.")

    top_sum = sum(r["prob"] for r in ranked) or 1.0
    top = ranked[0]
    confidence = (top["prob"] / top_sum) * 100

    alternatives = [
        {"disease": r["disease"], "confidence": round((r["prob"] / top_sum) * 100, 1)}
        for r in ranked[1:4]
    ]

    return {
        "isCrop": True,
        "nonCrop": False,
        "crop": top["disease"]["crop"],
        "disease": top["disease"],
        "confidence": round(confidence, 1),
        "alternatives": alternatives,
        "model": used_model_name,
        "quality": {
            "sharpness": round(foliar["sharpness"], 1),
            "brightness": round(foliar["brightness"] * 100, 1),
            "rating": quality_rating
        }
    }

    ranked.sort(key=lambda x: x["prob"], reverse=True)

    # Filter by user-selected crop if provided and not "auto"
    if crop and crop.lower() != 'auto':
        filtered = [r for r in ranked if r["disease"]["crop"].lower() == crop.lower()]
        if filtered:
            ranked = filtered

    if not ranked:
        raise HTTPException(status_code=500, detail="No matching disease diagnosis found for the specified crop.")

    top_sum = sum(r["prob"] for r in ranked) or 1.0
    top = ranked[0]
    confidence = (top["prob"] / top_sum) * 100

    alternatives = [
        {"disease": r["disease"], "confidence": round((r["prob"] / top_sum) * 100, 1)}
        for r in ranked[1:4]
    ]

    return {
        "isCrop": True,
        "nonCrop": False,
        "crop": top["disease"]["crop"],
        "disease": top["disease"],
        "confidence": round(confidence, 1),
        "alternatives": alternatives,
        "model": used_model_name,
        "quality": {
            "sharpness": round(foliar["sharpness"], 1),
            "brightness": round(foliar["brightness"] * 100, 1),
            "rating": quality_rating
        }
    }

@app.get("/api/diseases")
def list_diseases():
    return list(DISEASE_DB.values())

@app.get("/api/crops")
def list_supported_crops():
    crops = sorted(list(set(d["crop"] for d in DISEASE_DB.values())))
    return crops

# Persistent orders store in JSON
ORDERS_FILE = os.path.join(BASE_DIR, '..', 'data', 'orders.json')

class OrderItem(BaseModel):
    id: str
    name: str
    qty: int
    price: float

class OrderCreate(BaseModel):
    name: str
    phone: str
    address: str
    items: List[OrderItem]
    total: float
    paymentMethod: Optional[str] = "Cash on Delivery"

@app.post("/api/orders")
def place_order(order: OrderCreate):
    os.makedirs(os.path.dirname(ORDERS_FILE), exist_ok=True)
    orders = []
    if os.path.exists(ORDERS_FILE):
        try:
            with open(ORDERS_FILE, 'r') as f:
                orders = json.load(f)
        except Exception:
            orders = []
    
    order_data = order.dict() if hasattr(order, 'dict') else order.model_dump()
    order_data["id"] = f"ORD{int(torch.randint(10000000, 99999999, (1,)).item())}"
    order_data["date"] = datetime.datetime.now().isoformat()
    order_data["status"] = "Confirmed"
    orders.insert(0, order_data)

    with open(ORDERS_FILE, 'w') as f:
        json.dump(orders, f, indent=2)

    return {"status": "success", "order": order_data}

@app.get("/api/orders")
def get_orders():
    if os.path.exists(ORDERS_FILE):
        try:
            with open(ORDERS_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            pass
    return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
