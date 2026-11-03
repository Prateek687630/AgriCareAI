import os
import random
import time
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image

random.seed(42)
torch.manual_seed(42)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(42)

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Training Crop Leaf Detector on device: {DEVICE} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"})')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARCHIVE_PV = os.path.join(BASE_DIR, '..', 'archive', 'PlantVillage')
ARCHIVE_NEW = os.path.join(BASE_DIR, '..', 'archive', '15 Crop 45 Disease and Healthy Leaf dataset')
NON_CROP_DIR = os.path.join(BASE_DIR, '..', 'data', 'non_crop')
MODELS_OUT = os.path.join(BASE_DIR, 'models')
FRONTEND_MODELS = os.path.join(BASE_DIR, '..', 'AgriCare-AI-project', 'AgriCare-AI', 'public', 'models')
os.makedirs(MODELS_OUT, exist_ok=True)
os.makedirs(FRONTEND_MODELS, exist_ok=True)

# 1. Gather Crop Leaf Images across all crops from BOTH datasets (Class 0: crop_leaf)
crop_files = []
# PlantVillage crops
for root, dirs, files in os.walk(ARCHIVE_PV):
    leaf_imgs = [os.path.join(root, f) for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    if leaf_imgs:
        random.shuffle(leaf_imgs)
        crop_files.extend(leaf_imgs[:40])

# New 15 Crop 45 Disease dataset (Rice, Wheat, Cotton, Sugarcane, Cassava, Papaya, Groundnut, etc.)
for root, dirs, files in os.walk(ARCHIVE_NEW):
    leaf_imgs = [os.path.join(root, f) for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    if leaf_imgs:
        random.shuffle(leaf_imgs)
        crop_files.extend(leaf_imgs[:40])

random.shuffle(crop_files)
selected_crops = crop_files[:2000]
print(f'Collected {len(selected_crops)} real crop leaf images spanning all 16+ crops from both datasets.')

# 2. Gather Non-Crop Images (Class 1: non_crop)
non_crop_files = [
    os.path.join(NON_CROP_DIR, f)
    for f in os.listdir(NON_CROP_DIR)
    if f.lower().endswith(('.jpg', '.jpeg', '.png'))
]
print(f'Collected {len(non_crop_files)} non-crop images (horses, dogs, cats, cars, people, rooms).')

# Build dataset pairs: (path, label: 0 for crop_leaf, 1 for non_crop)
samples = [(p, 0) for p in selected_crops] + [(p, 1) for p in non_crop_files]
random.shuffle(samples)

split_idx = int(0.85 * len(samples))
train_samples = samples[:split_idx]
val_samples = samples[split_idx:]
print(f'Total samples: {len(samples)} (Train: {len(train_samples)}, Val: {len(val_samples)})')

class BinaryCropDataset(Dataset):
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
    transforms.RandomRotation(20),
    transforms.ColorJitter(brightness=0.15, contrast=0.15),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

train_loader = DataLoader(BinaryCropDataset(train_samples, train_transform), batch_size=16, shuffle=True, num_workers=0)
val_loader = DataLoader(BinaryCropDataset(val_samples, val_transform), batch_size=16, shuffle=False, num_workers=0)

# Build Model: MobileNetV2 Binary Classifier
print('Building MobileNetV2 Binary Classifier (crop_leaf vs non_crop)...')
if torch.cuda.is_available():
    torch.cuda.empty_cache()
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
in_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(p=0.2),
    nn.Linear(in_features, 2)
)
model.to(DEVICE)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=5e-4, weight_decay=1e-4)

epochs = 4
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

# Save Weights
pth_path = os.path.join(MODELS_OUT, 'crop_leaf_detector.pth')
torch.save(model.state_dict(), pth_path)
print(f'Saved Crop Leaf Detector weights to {pth_path}')

# Export to ONNX
print('Exporting Crop Leaf Detector to ONNX...')
model.eval()
dummy_input = torch.randn(1, 3, 224, 224, device=DEVICE)
onnx_path = os.path.join(MODELS_OUT, 'crop_leaf_detector.onnx')
frontend_onnx_path = os.path.join(FRONTEND_MODELS, 'crop_leaf_detector.onnx')

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
print(f'ONNX Crop Leaf Detector exported: {onnx_path}')

with open(onnx_path, 'rb') as src, open(frontend_onnx_path, 'wb') as dst:
    dst.write(src.read())
print(f'Copied Crop Leaf Detector ONNX to frontend: {frontend_onnx_path}')

print('Crop Leaf Detector training and export complete!')
