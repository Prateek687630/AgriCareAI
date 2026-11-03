import os
import json
import torch
import torchvision.transforms as transforms
import torchvision.models as models
import torch.nn as nn
from PIL import Image
from crop_validator import inspect_image_foliar_signals

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
TEST_DIR = os.path.join(BASE_DIR, '..', 'test_images')
ARCHIVE_DIR = os.path.join(BASE_DIR, '..', 'archive', 'PlantVillage')

with open(os.path.join(MODELS_DIR, 'class_mapping.json')) as f:
    mapping = json.load(f)

classes = mapping['classes']
non_crop_idx = mapping['non_crop_index']
print(f"Loaded {len(classes)} classes, non_crop index: {non_crop_idx}")

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = models.mobilenet_v2(weights=None)
in_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(p=0.2),
    nn.Linear(in_features, len(classes))
)
model.load_state_dict(torch.load(os.path.join(MODELS_DIR, 'our_crop_disease_model.pth'), map_location=DEVICE))
model.to(DEVICE)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def evaluate_image(path):
    img = Image.open(path).convert('RGB')
    foliar = inspect_image_foliar_signals(img)
    
    tensor = transform(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)[0].cpu().numpy()
    
    top_idx = int(probs.argmax())
    top_class = classes[top_idx]
    top_prob = float(probs[top_idx])
    non_crop_prob = float(probs[non_crop_idx])
    
    is_non_crop = foliar['is_non_crop'] or top_class == 'non_crop' or non_crop_prob > 0.35
    
    return {
        'path': os.path.basename(path),
        'is_non_crop': is_non_crop,
        'top_class': top_class,
        'top_prob': top_prob,
        'non_crop_prob': non_crop_prob,
        'foliar_rejection': foliar['rejection_reason'] if foliar['is_non_crop'] else None
    }

print("\n--- TESTING NON-CROP IMAGES (Dogs, Horses, Cars, People, Rooms) ---")
test_files = [f for f in os.listdir(TEST_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
for f in sorted(test_files)[:12]:
    res = evaluate_image(os.path.join(TEST_DIR, f))
    status = "REJECTED (NON-CROP)" if res['is_non_crop'] else "FAILED TO REJECT"
    print(f"[{status}] {res['path']}: top={res['top_class']} ({res['top_prob']*100:.1f}%), non_crop_p={res['non_crop_prob']*100:.1f}%, foliar={res['foliar_rejection']}")

print("\n--- TESTING CROP LEAF IMAGES (PlantVillage Tomato, Potato, Pepper) ---")
sample_crops = [
    os.path.join(ARCHIVE_DIR, 'Tomato_Early_blight'),
    os.path.join(ARCHIVE_DIR, 'Tomato_Late_blight'),
    os.path.join(ARCHIVE_DIR, 'Potato___Early_blight'),
    os.path.join(ARCHIVE_DIR, 'Pepper__bell___Bacterial_spot'),
    os.path.join(ARCHIVE_DIR, 'Tomato_healthy'),
]
for folder in sample_crops:
    if os.path.exists(folder):
        files = [f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.png'))]
        if files:
            res = evaluate_image(os.path.join(folder, files[0]))
            status = "PASSED (DIAGNOSED)" if not res['is_non_crop'] else "FALSE REJECTION"
            print(f"[{status}] {os.path.basename(folder)}: predicted={res['top_class']} ({res['top_prob']*100:.1f}%)")
