import os
import urllib.request
import random
from PIL import Image, ImageEnhance

NON_CROP_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'non_crop')
TEST_DIR = os.path.join(os.path.dirname(__file__), '..', 'test_images')
os.makedirs(NON_CROP_DIR, exist_ok=True)
os.makedirs(TEST_DIR, exist_ok=True)

# Extended list of fast, direct image URLs across non-crop categories:
URLS = {
    # Dogs
    'dog_1': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80',
    'dog_2': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80',
    'dog_3': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&q=80',
    'dog_4': 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&q=80',
    'dog_5': 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=500&q=80',
    'dog_6': 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&q=80',
    # Horses
    'horse_1': 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500&q=80',
    'horse_2': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80',
    'horse_3': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80',
    'horse_4': 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=500&q=80',
    'horse_5': 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=500&q=80',
    # Cats
    'cat_1': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80',
    'cat_2': 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&q=80',
    'cat_3': 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=500&q=80',
    # Cars & Vehicles
    'car_1': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80',
    'car_2': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80',
    'car_3': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80',
    'motorcycle_1': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80',
    'bicycle_1': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&q=80',
    # People & Faces
    'person_1': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
    'person_2': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
    'person_3': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
    # Objects & Indoor / Outdoor
    'chair_1': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80',
    'room_1': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80',
    'building_1': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80',
    'street_1': 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&q=80',
    'coffee_1': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
    'laptop_1': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print(f'Downloading {len(URLS)} primary high-res non-crop images...')
base_images = []
for name, url in URLS.items():
    dest = os.path.join(NON_CROP_DIR, f'{name}.jpg')
    test_dest = os.path.join(TEST_DIR, f'{name}.jpg')
    try:
        if not os.path.exists(dest) or os.path.getsize(dest) == 0:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp, open(dest, 'wb') as f:
                f.write(resp.read())
        im = Image.open(dest).convert('RGB')
        im.save(dest, 'JPEG', quality=92)
        im.save(test_dest, 'JPEG', quality=92)
        base_images.append((name, im))
        print(f'Ready: {name}.jpg')
    except Exception as e:
        print(f'Error downloading {name}: {e}')

print(f'Base images downloaded: {len(base_images)}')

# Generate augmented non-crop dataset so the model has hundreds of diverse non-crop training samples
print('Generating augmented non-crop training samples...')
aug_count = 0
for name, im in base_images:
    w, h = im.size
    for i in range(15):  # 15 augmentations per base image -> ~400 images
        crop_size = min(w, h) * random.uniform(0.7, 0.98)
        left = random.uniform(0, max(0, w - crop_size))
        top = random.uniform(0, max(0, h - crop_size))
        cropped = im.crop((left, top, left + crop_size, top + crop_size)).resize((224, 224), Image.Resampling.BILINEAR)
        
        if random.random() > 0.5:
            cropped = cropped.transpose(Image.FLIP_LEFT_RIGHT)
        
        # Color jitter
        enh_b = ImageEnhance.Brightness(cropped)
        cropped = enh_b.enhance(random.uniform(0.8, 1.2))
        enh_c = ImageEnhance.Contrast(cropped)
        cropped = enh_c.enhance(random.uniform(0.8, 1.2))
        
        aug_name = f'aug_{name}_{i:02d}.jpg'
        cropped.save(os.path.join(NON_CROP_DIR, aug_name), 'JPEG', quality=88)
        aug_count += 1

print(f'Successfully prepared {len(os.listdir(NON_CROP_DIR))} non-crop images in {NON_CROP_DIR}')
print(f'Test images saved in {TEST_DIR}: {len(os.listdir(TEST_DIR))}')
