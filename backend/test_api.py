import os
import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

def test_health():
    print("=== TEST 1: Health Check ===")
    r = requests.get(f'{BASE_URL}/health')
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    data = r.json()
    print("Health response:", json.dumps(data, indent=2))
    assert data["detector_loaded"] == True
    assert data["disease_model_loaded"] == True
    assert data["diseases_count"] == 38
    print("[PASS] Health check verified.")

def test_non_crop_rejection():
    print("\n=== TEST 2: Non-Crop Image Rejection ===")
    non_crops = ['horse_1.jpg', 'horse_2.jpg', 'dog_1.jpg', 'car_1.jpg', 'person_1.jpg', 'room_1.jpg']
    for filename in non_crops:
        path = os.path.join('test_images', filename)
        if not os.path.exists(path):
            continue
        with open(path, 'rb') as f:
            resp = requests.post(f'{BASE_URL}/predict', files={'image': (filename, f, 'image/jpeg')}, data={'crop': 'auto'})
        assert resp.status_code == 200, f"Got status {resp.status_code} for {filename}"
        res = resp.json()
        assert res.get("isCrop") == False, f"Expected isCrop=False for {filename}, got {res.get('isCrop')}"
        assert res.get("nonCrop") == True, f"Expected nonCrop=True for {filename}"
        assert "Non-Crop" in res.get("alert", ""), f"Alert mismatch for {filename}: {res.get('alert')}"
        conf = res.get("confidence")
        print(f"[SUCCESS: REJECTED] {filename:15s} -> nonCrop={res.get('nonCrop')}, confidence={conf}%, alert={res.get('alert')}")
    print("[PASS] All non-crop images correctly rejected with warning alert.")

def test_real_crop_acceptance():
    print("\n=== TEST 3: Real Crop Leaf Diagnosis ===")
    crop_tests = [
        ('Potato___Late_blight', 'Potato'),
        ('Potato___Early_blight', 'Potato'),
        ('Tomato_Early_blight', 'Tomato'),
        ('Tomato_Late_blight', 'Tomato'),
        ('Pepper__bell___Bacterial_spot', 'Pepper (Bell)'),
        ('Pepper__bell___healthy', 'Pepper (Bell)'),
        ('Tomato_healthy', 'Tomato'),
        ('Potato___healthy', 'Potato'),
    ]
    archive_dir = 'archive/PlantVillage'
    for folder, expected_crop in crop_tests:
        d = os.path.join(archive_dir, folder)
        if not os.path.exists(d):
            continue
        files = [f for f in os.listdir(d) if f.lower().endswith(('.jpg', '.jpeg', '.png'))][:2]
        for f in files:
            path = os.path.join(d, f)
            with open(path, 'rb') as fp:
                resp = requests.post(f'{BASE_URL}/predict', files={'image': (f, fp, 'image/jpeg')}, data={'crop': 'auto'})
            assert resp.status_code == 200, f"Got {resp.status_code} for {folder}/{f}"
            res = resp.json()
            assert res.get("isCrop") == True, f"Falsely rejected real crop {folder}/{f}! Response: {res}"
            assert res.get("nonCrop") == False, f"Falsely flagged real crop {folder}/{f} as nonCrop!"
            dname = res.get("disease", {}).get("name")
            crop_name = res.get("crop")
            conf = res.get("confidence")
            quality = res.get("quality", {}).get("rating")
            print(f"[SUCCESS: DIAGNOSED] {folder:30s} -> Crop: {crop_name:12s} | Disease: {dname:20s} | Conf: {conf}% | Quality: {quality}")
    print("[PASS] All real crop images successfully accepted and diagnosed without false rejections!")

def test_orders():
    print("\n=== TEST 4: Orders API ===")
    order_payload = {
        "name": "Ramesh Kumar",
        "phone": "+91 98765 43210",
        "address": "Kisan Nagar, Rohtak, Haryana",
        "items": [
            {"id": "mancozeb-75", "name": "Mancozeb 75% WP", "qty": 2, "price": 420.0},
            {"id": "neem-oil", "name": "Organic Neem Oil 1500 PPM", "qty": 1, "price": 310.0}
        ],
        "total": 1150.0,
        "paymentMethod": "Cash on Delivery"
    }
    r = requests.post(f'{BASE_URL}/api/orders', json=order_payload)
    assert r.status_code == 200, f"Order placement failed: {r.status_code}"
    res = r.json()
    order_id = res["order"]["id"]
    print(f"Placed order ID: {order_id}")

    r2 = requests.get(f'{BASE_URL}/api/orders')
    assert r2.status_code == 200
    orders = r2.json()
    assert any(o["id"] == order_id for o in orders), "Order not found in list"
    print(f"[PASS] Orders API verified. Total orders: {len(orders)}")

if __name__ == '__main__':
    test_health()
    test_non_crop_rejection()
    test_real_crop_acceptance()
    test_orders()
    print("\n==========================================")
    print("ALL TESTS PASSED WITH 100% SUCCESS RATE!")
    print("==========================================")
