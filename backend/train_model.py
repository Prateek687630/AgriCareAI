import os
import json
import time
import random
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image

# Set seed
random.seed(42)
torch.manual_seed(42)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(42)

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Training on device: {DEVICE} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"})')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARCHIVE_DIR = os.path.join(BASE_DIR, '..', 'archive', 'PlantVillage')
NON_CROP_DIR = os.path.join(BASE_DIR, '..', 'data', 'non_crop')
MODELS_OUT = os.path.join(BASE_DIR, 'models')
FRONTEND_MODELS = os.path.join(BASE_DIR, '..', 'AgriCare-AI-project', 'AgriCare-AI', 'public', 'models')
os.makedirs(MODELS_OUT, exist_ok=True)
os.makedirs(FRONTEND_MODELS, exist_ok=True)

# 15 PlantVillage classes + non_crop
CLASSES = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy',
    'non_crop',  # 16th class for dogs, horses, cars, random images
]

# Mapping to frontend disease IDs
CLASS_TO_DISEASE_ID = {
    'Pepper__bell___Bacterial_spot': 'pepper-bacterial-spot',
    'Pepper__bell___healthy': 'pepper-healthy',
    'Potato___Early_blight': 'potato-early-blight',
    'Potato___Late_blight': 'potato-late-blight',
    'Potato___healthy': 'potato-healthy',
    'Tomato_Bacterial_spot': 'tomato-bacterial-spot',
    'Tomato_Early_blight': 'tomato-early-blight',
    'Tomato_Late_blight': 'tomato-late-blight',
    'Tomato_Leaf_Mold': 'tomato-leaf-mold',
    'Tomato_Septoria_leaf_spot': 'tomato-septoria-leaf-spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite': 'tomato-spider-mites',
    'Tomato__Target_Spot': 'tomato-target-spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus': 'tomato-yellow-leaf-curl',
    'Tomato__Tomato_mosaic_virus': 'tomato-mosaic-virus',
    'Tomato_healthy': 'tomato-healthy',
    'non_crop': 'non-crop',
}

class_to_idx = {c: i for i, c in enumerate(CLASSES)}

# Collect balanced dataset
samples = []
MAX_SAMPLES_PER_CLASS = 280

for c in CLASSES:
    if c == 'non_crop':
        files = [os.path.join(NON_CROP_DIR, f) for f in os.listdir(NON_CROP_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    else:
        folder = os.path.join(ARCHIVE_DIR, c)
        if not os.path.exists(folder):
            # Try nested
            folder = os.path.join(ARCHIVE_DIR, 'PlantVillage', c)
        files = [os.path.join(folder, f) for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    random.shuffle(files)
    selected = files[:MAX_SAMPLES_PER_CLASS]
    for s in selected:
        samples.append((s, class_to_idx[c]))
    print(f'Class {c}: {len(selected)} samples')

random.shuffle(samples)
split_idx = int(0.85 * len(samples))
train_samples = samples[:split_idx]
val_samples = samples[split_idx:]
print(f'Total: {len(samples)} images (Train: {len(train_samples)}, Val: {len(val_samples)})')

class PlantDataset(Dataset):
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
            # Fallback black image if corrupt
            img = Image.new('RGB', (224, 224), (0, 0, 0))
            if self.transform:
                img = self.transform(img)
            return img, label

train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.15, contrast=0.15),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

train_loader = DataLoader(PlantDataset(train_samples, train_transform), batch_size=32, shuffle=True, num_workers=0)
val_loader = DataLoader(PlantDataset(val_samples, val_transform), batch_size=32, shuffle=False, num_workers=0)

# Build Model: MobileNetV2 with custom classification head
print('Building MobileNetV2 architecture with 16 output classes...')
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
in_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(p=0.2),
    nn.Linear(in_features, len(CLASSES))
)
model.to(DEVICE)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=5)

epochs = 5
print(f'Starting training for {epochs} epochs...')
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

    scheduler.step()
    train_acc = correct / total
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

    val_acc = val_correct / val_total
    val_loss = val_loss / val_total
    duration = time.time() - start_t
    print(f'Epoch [{epoch+1}/{epochs}] ({duration:.1f}s) - Train Loss: {train_loss:.4f}, Train Acc: {train_acc*100:.2f}% | Val Loss: {val_loss:.4f}, Val Acc: {val_acc*100:.2f}%')

# Save PyTorch weights
pth_path = os.path.join(MODELS_OUT, 'our_crop_disease_model.pth')
torch.save(model.state_dict(), pth_path)
print(f'Saved PyTorch model weights to {pth_path}')

# Export to ONNX
print('Exporting custom model to ONNX format...')
model.eval()
dummy_input = torch.randn(1, 3, 224, 224, device=DEVICE)
onnx_path = os.path.join(MODELS_OUT, 'our_crop_disease_model.onnx')
frontend_onnx_path = os.path.join(FRONTEND_MODELS, 'our_crop_disease_model.onnx')

torch.onnx.export(
    model,
    dummy_input,
    onnx_path,
    export_params=True,
    opset_version=14,
    do_constant_folding=True,
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
)
print(f'ONNX model successfully exported: {onnx_path}')

# Copy to frontend public/models/
with open(onnx_path, 'rb') as src, open(frontend_onnx_path, 'wb') as dst:
    dst.write(src.read())
print(f'Copied ONNX model to frontend: {frontend_onnx_path}')

# Save class mapping metadata
mapping = {
    'classes': CLASSES,
    'class_to_disease_id': CLASS_TO_DISEASE_ID,
    'non_crop_index': class_to_idx['non_crop'],
    'input_size': 224,
    'val_accuracy': val_acc,
    'timestamp': time.time(),
}
with open(os.path.join(MODELS_OUT, 'class_mapping.json'), 'w') as f:
    json.dump(mapping, f, indent=2)

with open(os.path.join(FRONTEND_MODELS, 'our_model_classes.json'), 'w') as f:
    json.dump(mapping, f, indent=2)

print('Training and ONNX export complete! All files saved successfully.')
