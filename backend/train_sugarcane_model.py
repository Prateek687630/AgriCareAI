import os
import json
import time
import random
from PIL import Image
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torchvision.models as models
import torchvision.transforms as transforms

# Clear CUDA cache before starting
if torch.cuda.is_available():
    torch.cuda.empty_cache()

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using compute device: {DEVICE}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")

PV_DIR = 'archive/PlantVillage'
DS2_DIR = r'archive/15 Crop 45 Disease and Healthy Leaf dataset/15 Crop 45 Disease and Healthy Leaf dataset'
SC_DIR = r'archive/Sugarcane'
NON_CROP_DIR = 'data/non_crop'
MODELS_DIR = 'backend/models'
FRONTEND_MODELS = 'AgriCare-AI-project/AgriCare-AI/public/models'
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(FRONTEND_MODELS, exist_ok=True)

# 59 Canonical Classes across 16 crops + Sugarcane suite + Non-Crop Rejection
CLASSES = [
    'cashew-leaf-miner', 'cashew-red-rust', 'cashew-healthy',
    'cassava-brown-spot', 'cassava-mosaic', 'cassava-healthy',
    'chilli-healthy', 'chilli-nutrient-deficiency', 'chilli-white-spot',
    'citrus-black-spot', 'citrus-canker', 'citrus-healthy',
    'corn-leaf-spot', 'corn-streak-virus', 'corn-healthy',
    'cotton-bacterial-blight', 'cotton-curl-virus', 'cotton-healthy',
    'grape-black-rot', 'grape-leaf-blight', 'grape-healthy',
    'groundnut-healthy', 'groundnut-late-leaf-spot', 'groundnut-nutrient-deficiency',
    'papaya-bacterial-spot', 'papaya-ring-spot', 'papaya-healthy',
    'pepper-bacterial-spot', 'pepper-healthy',
    'potato-early-blight', 'potato-late-blight', 'potato-healthy',
    'rice-brown-spot', 'rice-leaf-blast', 'rice-healthy',
    'soybean-caterpillar', 'soybean-diabrotica', 'soybean-healthy',
    'sugarcane-brown-spot', 'sugarcane-grassy-shoot', 'sugarcane-healthy',
    'sugarcane-red-rot', 'sugarcane-mosaic', 'sugarcane-rust', 'sugarcane-yellow-leaf',
    'tomato-bacterial-spot', 'tomato-early-blight', 'tomato-late-blight',
    'tomato-leaf-mold', 'tomato-septoria-leaf-spot', 'tomato-spider-mites',
    'tomato-target-spot', 'tomato-yellow-leaf-curl', 'tomato-mosaic-virus',
    'tomato-healthy',
    'wheat-brown-rust', 'wheat-yellow-rust', 'wheat-healthy',
    'non-crop'
]

CLASS_TO_IDX = {c: i for i, c in enumerate(CLASSES)}

# Directory to Canonical Class Mapping
DIR_TO_CLASS = {
    # PlantVillage
    (PV_DIR, 'Pepper__bell___Bacterial_spot'): 'pepper-bacterial-spot',
    (PV_DIR, 'Pepper__bell___healthy'): 'pepper-healthy',
    (PV_DIR, 'Potato___Early_blight'): 'potato-early-blight',
    (PV_DIR, 'Potato___Late_blight'): 'potato-late-blight',
    (PV_DIR, 'Potato___healthy'): 'potato-healthy',
    (PV_DIR, 'Tomato_Bacterial_spot'): 'tomato-bacterial-spot',
    (PV_DIR, 'Tomato_Early_blight'): 'tomato-early-blight',
    (PV_DIR, 'Tomato_Late_blight'): 'tomato-late-blight',
    (PV_DIR, 'Tomato_Leaf_Mold'): 'tomato-leaf-mold',
    (PV_DIR, 'Tomato_Septoria_leaf_spot'): 'tomato-septoria-leaf-spot',
    (PV_DIR, 'Tomato_Spider_mites_Two_spotted_spider_mite'): 'tomato-spider-mites',
    (PV_DIR, 'Tomato__Target_Spot'): 'tomato-target-spot',
    (PV_DIR, 'Tomato__Tomato_YellowLeaf__Curl_Virus'): 'tomato-yellow-leaf-curl',
    (PV_DIR, 'Tomato__Tomato_mosaic_virus'): 'tomato-mosaic-virus',
    (PV_DIR, 'Tomato_healthy'): 'tomato-healthy',

    # 15 Crop 45 Disease Dataset
    (DS2_DIR, 'Cashew leaf miner'): 'cashew-leaf-miner',
    (DS2_DIR, 'Cashew red rust'): 'cashew-red-rust',
    (DS2_DIR, 'healthy_cashew'): 'cashew-healthy',
    (DS2_DIR, 'Cassava brown spot'): 'cassava-brown-spot',
    (DS2_DIR, 'Cassava mosaic'): 'cassava-mosaic',
    (DS2_DIR, 'healthy_cassava'): 'cassava-healthy',
    (DS2_DIR, 'Chili Healthy Leaf'): 'chilli-healthy',
    (DS2_DIR, 'Chilli Nutrition Deficiency'): 'chilli-nutrient-deficiency',
    (DS2_DIR, 'Chilli White spot'): 'chilli-white-spot',
    (DS2_DIR, 'Citrus Black spot'): 'citrus-black-spot',
    (DS2_DIR, 'Citrus canker'): 'citrus-canker',
    (DS2_DIR, 'Citrus Healthy'): 'citrus-healthy',
    (DS2_DIR, 'Cotton Bacterial Blight'): 'cotton-bacterial-blight',
    (DS2_DIR, 'Cotton Curl Virus'): 'cotton-curl-virus',
    (DS2_DIR, 'Cotton Healthy Leaf'): 'cotton-healthy',
    (DS2_DIR, 'Grape___Black_rot'): 'grape-black-rot',
    (DS2_DIR, 'Grape___Leaf_blight'): 'grape-leaf-blight',
    (DS2_DIR, 'Grape___healthy'): 'grape-healthy',
    (DS2_DIR, 'Ground healthy leaf'): 'groundnut-healthy',
    (DS2_DIR, 'Ground late leaf spot'): 'groundnut-late-leaf-spot',
    (DS2_DIR, 'Ground nutrition deficiency'): 'groundnut-nutrient-deficiency',
    (DS2_DIR, 'Maize leaf spot'): 'corn-leaf-spot',
    (DS2_DIR, 'Maize streak virus'): 'corn-streak-virus',
    (DS2_DIR, 'healthy_maize'): 'corn-healthy',
    (DS2_DIR, 'Papaya BacterialSpot'): 'papaya-bacterial-spot',
    (DS2_DIR, 'Papaya RingSpot'): 'papaya-ring-spot',
    (DS2_DIR, 'Papaya Healthy'): 'papaya-healthy',
    (DS2_DIR, 'Potato Early_Blight'): 'potato-early-blight',
    (DS2_DIR, 'Potato Late_Blight'): 'potato-late-blight',
    (DS2_DIR, 'Potato Healthy'): 'potato-healthy',
    (DS2_DIR, 'Rice___Brown_Spot'): 'rice-brown-spot',
    (DS2_DIR, 'Rice___Leaf_Blast'): 'rice-leaf-blast',
    (DS2_DIR, 'Rice___Healthy'): 'rice-healthy',
    (DS2_DIR, 'Soyabean Caterpillar'): 'soybean-caterpillar',
    (DS2_DIR, 'Soyabean Diabrotica speciosa'): 'soybean-diabrotica',
    (DS2_DIR, 'Soyabean Healthy'): 'soybean-healthy',
    (DS2_DIR, 'Sugarcane Brown Spot'): 'sugarcane-brown-spot',
    (DS2_DIR, 'Sugarcane Grassy shoot'): 'sugarcane-grassy-shoot',
    (DS2_DIR, 'Sugarcane Healthy Leaves'): 'sugarcane-healthy',
    (DS2_DIR, 'leaf blight_tomato'): 'tomato-late-blight',
    (DS2_DIR, 'septoria leaf spot_tomato'): 'tomato-septoria-leaf-spot',
    (DS2_DIR, 'healthy_tomato'): 'tomato-healthy',
    (DS2_DIR, 'Wheat___Brown_Rust'): 'wheat-brown-rust',
    (DS2_DIR, 'Wheat___Yellow_Rust'): 'wheat-yellow-rust',
    (DS2_DIR, 'Wheat___Healthy'): 'wheat-healthy',

    # Dedicated Sugarcane Dataset
    (SC_DIR, 'RedRot'): 'sugarcane-red-rot',
    (SC_DIR, 'Mosaic'): 'sugarcane-mosaic',
    (SC_DIR, 'Rust'): 'sugarcane-rust',
    (SC_DIR, 'Yellow'): 'sugarcane-yellow-leaf',
    (SC_DIR, 'Healthy'): 'sugarcane-healthy',
}

print("Collecting balanced dataset across all 59 classes...")
random.seed(42)
torch.manual_seed(42)

samples = []
class_sample_counts = {c: 0 for c in CLASSES}

for (base_dir, sub_dir), target_class in DIR_TO_CLASS.items():
    folder_path = os.path.join(base_dir, sub_dir)
    if not os.path.exists(folder_path):
        continue
    img_files = [
        os.path.join(folder_path, f)
        for f in os.listdir(folder_path)
        if f.lower().endswith(('.jpg', '.jpeg', '.png'))
    ]
    random.shuffle(img_files)
    # Pick up to 80 images per folder for rich representation
    selected = img_files[:80]
    target_idx = CLASS_TO_IDX[target_class]
    for p in selected:
        samples.append((p, target_idx))
        class_sample_counts[target_class] += 1

# Add non-crop images
if os.path.exists(NON_CROP_DIR):
    nc_files = [
        os.path.join(NON_CROP_DIR, f)
        for f in os.listdir(NON_CROP_DIR)
        if f.lower().endswith(('.jpg', '.jpeg', '.png'))
    ]
    random.shuffle(nc_files)
    nc_idx = CLASS_TO_IDX['non-crop']
    for p in nc_files[:300]:
        samples.append((p, nc_idx))
        class_sample_counts['non-crop'] += 1

random.shuffle(samples)
print(f"Total collected samples: {len(samples)}")
print(f"Active classes with samples: {sum(1 for v in class_sample_counts.values() if v > 0)} / {len(CLASSES)}")
print(f"Sugarcane samples: RedRot: {class_sample_counts['sugarcane-red-rot']}, Mosaic: {class_sample_counts['sugarcane-mosaic']}, Rust: {class_sample_counts['sugarcane-rust']}, Yellow: {class_sample_counts['sugarcane-yellow-leaf']}, Healthy: {class_sample_counts['sugarcane-healthy']}")

split_idx = int(0.85 * len(samples))
train_samples = samples[:split_idx]
val_samples = samples[split_idx:]
print(f"Train samples: {len(train_samples)}, Val samples: {len(val_samples)}")

class PathologyDataset(Dataset):
    def __init__(self, sample_list, transform=None):
        self.sample_list = sample_list
        self.transform = transform

    def __len__(self):
        return len(self.sample_list)

    def __getitem__(self, idx):
        path, label = self.sample_list[idx]
        try:
            with Image.open(path) as img:
                img = img.convert('RGB')
                if self.transform:
                    img = self.transform(img)
                return img, label
        except Exception:
            img = Image.new('RGB', (224, 224), (0, 0, 0))
            if self.transform:
                img = self.transform(img)
            return img, label

train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.1, contrast=0.1),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

train_loader = DataLoader(PathologyDataset(train_samples, train_transform), batch_size=16, shuffle=True, num_workers=0)
val_loader = DataLoader(PathologyDataset(val_samples, val_transform), batch_size=16, shuffle=False, num_workers=0)

# Build Model with Transfer Learning
print("Initializing MobileNetV2 architecture...")
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
in_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(p=0.2),
    nn.Linear(in_features, len(CLASSES))
)
model.to(DEVICE)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=5e-4, weight_decay=1e-4)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=4)

epochs = 4
print(f"Starting training for {epochs} epochs on {DEVICE}...")

for epoch in range(epochs):
    start_t = time.time()
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for imgs, labels in train_loader:
        imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * imgs.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

    train_acc = correct / total
    train_loss = running_loss / total
    scheduler.step()

    # Validation
    model.eval()
    val_loss = 0.0
    val_correct = 0
    val_total = 0
    with torch.no_grad():
        for imgs, labels in val_loader:
            imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            val_loss += loss.item() * imgs.size(0)
            _, preds = torch.max(outputs, 1)
            val_correct += (preds == labels).sum().item()
            val_total += labels.size(0)

    val_acc = val_correct / val_total
    val_loss = val_loss / val_total
    duration = time.time() - start_t
    print(f"Epoch [{epoch+1}/{epochs}] ({duration:.1f}s) - Train Loss: {train_loss:.4f}, Train Acc: {train_acc*100:.2f}% | Val Loss: {val_loss:.4f}, Val Acc: {val_acc*100:.2f}%")

# Save PyTorch Weights
pth_path = os.path.join(MODELS_DIR, 'agricare_model.pth')
torch.save(model.state_dict(), pth_path)
print(f"Saved PyTorch model weights to: {pth_path}")

# Export to ONNX
print("Exporting model to ONNX...")
model.eval()
dummy_input = torch.randn(1, 3, 224, 224, device=DEVICE)

onnx_backend = os.path.join(MODELS_DIR, 'agricare_model.onnx')
onnx_frontend = os.path.join(FRONTEND_MODELS, 'agricare_model.onnx')

torch.onnx.export(
    model,
    dummy_input,
    onnx_backend,
    export_params=True,
    opset_version=14,
    do_constant_folding=True,
    input_names=['pixel_values'],
    output_names=['logits'],
    dynamic_axes={'pixel_values': {0: 'batch'}, 'logits': {0: 'batch'}}
)
print(f"Exported backend ONNX to: {onnx_backend}")

import shutil
shutil.copyfile(onnx_backend, onnx_frontend)
print(f"Exported frontend ONNX to: {onnx_frontend}")

# Save class mappings
classes_data = {"classes": CLASSES, "total": len(CLASSES)}
with open(os.path.join(MODELS_DIR, 'model_classes.json'), 'w') as f:
    json.dump(classes_data, f, indent=2)
with open(os.path.join(FRONTEND_MODELS, 'model_classes.json'), 'w') as f:
    json.dump(classes_data, f, indent=2)

print("Saved model_classes.json in both backend and frontend!")
print(f"Model Training Complete! Total classes: {len(CLASSES)}, Final Val Accuracy: {val_acc*100:.2f}%")
