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

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using compute device: {DEVICE}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")

PV_DIR = 'archive/PlantVillage'
DS2_DIR = r'archive/15 Crop 45 Disease and Healthy Leaf dataset/15 Crop 45 Disease and Healthy Leaf dataset'
NON_CROP_DIR = 'data/non_crop'
MODELS_DIR = 'backend/models'
os.makedirs(MODELS_DIR, exist_ok=True)

# 55 Canonical Classes (15 crops, 54 diseases/healthy states + 1 non-crop class)
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
    (DS2_DIR, 'Wheat___Brown_Rust'): 'wheat-brown-rust',
    (DS2_DIR, 'Wheat___Yellow_Rust'): 'wheat-yellow-rust',
    (DS2_DIR, 'Wheat___Healthy'): 'wheat-healthy',
    (DS2_DIR, 'healthy_tomato'): 'tomato-healthy',
    (DS2_DIR, 'leaf blight_tomato'): 'tomato-late-blight',
    (DS2_DIR, 'septoria leaf spot_tomato'): 'tomato-septoria-leaf-spot',
}

class FastAgriDataset(Dataset):
    def __init__(self, samples, transform=None):
        self.samples = samples
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        try:
            img = Image.open(path).convert('RGB')
        except Exception:
            img = Image.new('RGB', (224, 224), (128, 128, 128))
        if self.transform:
            img = self.transform(img)
        return img, label

def gather_samples(max_per_class=120):
    samples = []
    class_counts = {c: 0 for c in CLASSES}

    # 1. Harvest from PlantVillage and 15 Crop 45 Disease dataset
    for (base_dir, folder_name), canonical_class in DIR_TO_CLASS.items():
        folder_path = os.path.join(base_dir, folder_name)
        if not os.path.exists(folder_path):
            continue
        files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        random.seed(42)
        random.shuffle(files)
        
        # Take up to max_per_class images
        target_idx = CLASS_TO_IDX[canonical_class]
        needed = max_per_class - class_counts[canonical_class]
        for f in files[:max(0, needed)]:
            samples.append((os.path.join(folder_path, f), target_idx))
            class_counts[canonical_class] += 1

    # 2. Harvest Non-Crop images
    if os.path.exists(NON_CROP_DIR):
        nc_files = [f for f in os.listdir(NON_CROP_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        nc_idx = CLASS_TO_IDX['non-crop']
        for f in nc_files[:max_per_class]:
            samples.append((os.path.join(NON_CROP_DIR, f), nc_idx))
            class_counts['non-crop'] += 1

    # Also include test_images for non-crop if needed
    test_dir = 'test_images'
    if os.path.exists(test_dir) and class_counts['non-crop'] < max_per_class:
        for f in os.listdir(test_dir):
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                samples.append((os.path.join(test_dir, f), CLASS_TO_IDX['non-crop']))
                class_counts['non-crop'] += 1

    print(f"Total samples collected: {len(samples)} across {len(CLASSES)} classes.")
    return samples

def train_and_export():
    samples = gather_samples(max_per_class=120)
    random.seed(42)
    random.shuffle(samples)

    split = int(0.85 * len(samples))
    train_samples = samples[:split]
    val_samples = samples[split:]

    train_tf = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_tf = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # Set batch size to 16 and num_workers to 0 for Windows GPU stability without CUDA OOM
    torch.cuda.empty_cache()
    train_loader = DataLoader(FastAgriDataset(train_samples, train_tf), batch_size=16, shuffle=True, num_workers=0)
    val_loader = DataLoader(FastAgriDataset(val_samples, val_tf), batch_size=16, shuffle=False, num_workers=0)

    print("Initializing MobileNetV2 with transfer learning...")
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.25),
        nn.Linear(in_features, len(CLASSES))
    )
    model.to(DEVICE)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=4)

    epochs = 4
    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        start = time.time()

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

        scheduler.step()
        train_acc = correct / total * 100
        train_loss = running_loss / total

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

        val_acc = val_correct / val_total * 100
        elapsed = time.time() - start
        print(f"Epoch [{epoch}/{epochs}] ({elapsed:.1f}s) - Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}% | Val Loss: {val_loss/val_total:.4f}, Val Acc: {val_acc:.2f}%")

    # Export PyTorch weights
    pth_path = os.path.join(MODELS_DIR, 'agricare_55class_model.pth')
    torch.save(model.state_dict(), pth_path)
    print(f"Saved PyTorch weights: {pth_path}")

    # Export ONNX model
    onnx_path = os.path.join(MODELS_DIR, 'agricare_55class_model.onnx')
    model.eval()
    dummy = torch.randn(1, 3, 224, 224, device=DEVICE)
    torch.onnx.export(
        model,
        dummy,
        onnx_path,
        export_params=True,
        opset_version=12,
        do_constant_folding=True,
        input_names=['pixel_values'],
        output_names=['logits'],
        dynamic_axes={'pixel_values': {0: 'batch'}, 'logits': {0: 'batch'}}
    )
    print(f"Saved ONNX model: {onnx_path}")

    # Also save metadata JSON
    meta_path = os.path.join(MODELS_DIR, 'model_55_classes.json')
    with open(meta_path, 'w') as f:
        json.dump({'classes': CLASSES, 'total': len(CLASSES)}, f, indent=2)
    print(f"Saved Metadata: {meta_path}")

if __name__ == '__main__':
    train_and_export()
