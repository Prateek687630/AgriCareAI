import os
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
TEST_DIR = os.path.join(BASE_DIR, '..', 'test_images')
ARCHIVE_DIR = os.path.join(BASE_DIR, '..', 'archive', 'PlantVillage')

model = models.mobilenet_v2(weights=None)
model.classifier = nn.Sequential(
    nn.Dropout(p=0.2),
    nn.Linear(model.classifier[1].in_features, 2)
)
model.load_state_dict(torch.load(os.path.join(MODELS_DIR, 'crop_leaf_detector.pth'), map_location=DEVICE))
model.to(DEVICE)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def check_image(path):
    im = Image.open(path).convert('RGB')
    tensor = transform(im).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        out = model(tensor)
        probs = torch.softmax(out, dim=1)[0].cpu().numpy()
    crop_prob = float(probs[0])
    non_crop_prob = float(probs[1])
    is_crop = crop_prob >= 0.5
    return is_crop, crop_prob, non_crop_prob

print("=== EVALUATING NON-CROP IMAGES (Should be detected as False) ===")
non_crop_test = ['horse_1.jpg', 'horse_2.jpg', 'horse_3.jpg', 'dog_1.jpg', 'dog_2.jpg', 'dog_3.jpg', 'cat_1.jpg', 'car_1.jpg', 'car_2.jpg', 'person_1.jpg', 'chair_1.jpg', 'building_1.jpg']
for name in non_crop_test:
    p = os.path.join(TEST_DIR, name)
    is_crop, cp, ncp = check_image(p)
    status = "SUCCESS: REJECTED" if not is_crop else "FAILED: ACCEPTED"
    print(f"[{status}] {name} -> is_crop={is_crop}, crop_p={cp*100:.1f}%, non_crop_p={ncp*100:.1f}%")

print("\n=== EVALUATING REAL CROP IMAGES (Should be detected as True) ===")
# Test multiple different diseased and healthy crop classes
test_crop_folders = [
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Leaf_Mold',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato_healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
]

for folder in test_crop_folders:
    fpath = os.path.join(ARCHIVE_DIR, folder)
    if not os.path.exists(fpath):
        fpath = os.path.join(ARCHIVE_DIR, 'PlantVillage', folder)
    if os.path.exists(fpath):
        files = [os.path.join(fpath, f) for f in os.listdir(fpath) if f.lower().endswith(('.jpg', '.png'))]
        if files:
            # test 2 files from each class
            for i in range(min(2, len(files))):
                is_crop, cp, ncp = check_image(files[i])
                status = "SUCCESS: ACCEPTED" if is_crop else "FAILED: REJECTED"
                print(f"[{status}] {folder} [{i}] -> is_crop={is_crop}, crop_p={cp*100:.1f}%, non_crop_p={ncp*100:.1f}%")
