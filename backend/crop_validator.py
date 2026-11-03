import numpy as np
from PIL import Image

def rgb_to_hsv(r, g, b):
    """Normalized RGB (0-1) to HSV (h in 0-360, s in 0-1, v in 0-1)."""
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    d = max_c - min_c
    h = 0.0
    if d != 0:
        if max_c == r:
            h = ((g - b) / d) % 6
        elif max_c == g:
            h = (b - r) / d + 2
        else:
            h = (r - g) / d + 4
        h *= 60.0
        if h < 0:
            h += 360.0
    s = 0.0 if max_c == 0 else d / max_c
    v = max_c
    return h, s, v

def inspect_image_foliar_signals(image: Image.Image) -> dict:
    """
    Bio-spectral, foliar & chromaticity inspector.
    Accurately identifies whether an image has plant/crop leaf properties vs
    mammalian fur (horse, dog, cat), human skin, metallic/synthetic objects, or background scenes.
    """
    img = image.convert('RGB').resize((128, 128), Image.Resampling.BILINEAR)
    arr = np.asarray(img, dtype=np.float32)
    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]

    total_pixels = 128 * 128
    
    # Excess Green Index (standard agricultural remote sensing / machine vision metric)
    # ExG = 2*G - R - B
    exg = 2.0 * g - r - b
    mean_exg = float(np.mean(exg))
    positive_exg_ratio = float(np.sum(exg > 5.0) / total_pixels)

    # Convert to normalized HSV for color segmentation
    r_n = r / 255.0
    g_n = g / 255.0
    b_n = b / 255.0
    
    green_count = 0
    yellow_chlorosis_count = 0
    lesion_brown_dark_count = 0
    mammal_fur_count = 0
    human_skin_count = 0
    neutral_bg_count = 0

    flat_r = r_n.flatten()
    flat_g = g_n.flatten()
    flat_b = b_n.flatten()
    flat_r_raw = r.flatten()
    flat_g_raw = g.flatten()
    flat_b_raw = b.flatten()

    for i in range(total_pixels):
        rv, gv, bv = flat_r[i], flat_g[i], flat_b[i]
        h, s, v = rgb_to_hsv(rv, gv, bv)

        # Background exclusion
        if v < 0.08 or (s < 0.12 and v > 0.35):
            neutral_bg_count += 1
            continue

        raw_r, raw_g, raw_b = flat_r_raw[i], flat_g_raw[i], flat_b_raw[i]

        # Mammalian fur signature (dogs, horses, cats, bears, mammals):
        # Warm, high red-to-green and red-to-blue excess with low green/yellow chromaticity
        if (raw_r > raw_g + 18) and (raw_r > raw_b + 25) and (h < 35 or h > 340):
            mammal_fur_count += 1

        # Human skin tone heuristic (Peer et al.)
        if raw_r > 95 and raw_g > 40 and raw_b > 20 and (raw_r - raw_g > 15) and (raw_r > raw_b):
            human_skin_count += 1

        # Foliar green (chlorophyll)
        if 65 <= h <= 175 and s >= 0.18:
            green_count += 1
        # Chlorosis / yellow leaf tissue
        elif 38 <= h < 65 and s >= 0.20:
            yellow_chlorosis_count += 1
        # Foliar necrotic lesion / dark brown spot on leaf
        elif (h < 38 or h > 330) and v < 0.45 and s >= 0.20:
            lesion_brown_dark_count += 1

    valid_pixels = max(1, total_pixels - neutral_bg_count)
    foliar_green_ratio = green_count / valid_pixels
    chlorosis_ratio = yellow_chlorosis_count / valid_pixels
    lesion_ratio = lesion_brown_dark_count / valid_pixels
    total_foliar_ratio = (green_count + yellow_chlorosis_count + lesion_brown_dark_count) / valid_pixels
    mammal_fur_ratio = mammal_fur_count / valid_pixels
    skin_ratio = human_skin_count / valid_pixels

    # Measure image quality (sharpness & brightness)
    grey = 0.299 * r + 0.587 * g + 0.114 * b
    brightness = float(np.mean(grey) / 255.0)
    laplacian = (
        4 * grey[1:-1, 1:-1]
        - grey[:-2, 1:-1]
        - grey[2:, 1:-1]
        - grey[1:-1, :-2]
        - grey[1:-1, 2:]
    )
    sharpness = float(np.var(laplacian))

    # Quality and foliar signals are computed for telemetry and feedback.
    # The primary non-crop classification is delegated to the deep-learning MobileNetV2 crop detector
    # to avoid false rejections on brown necrotic lesions or chlorotic leaves.
    is_non_crop = False
    rejection_reason = ""

    # Only flag as non-crop heuristic if virtually 0 foliar signals across all bands (< 1%) AND extreme negative ExG
    if total_foliar_ratio < 0.01 and mean_exg < -45:
        is_non_crop = True
        rejection_reason = "No botanical foliage detected in frame."

    return {
        "is_non_crop": is_non_crop,
        "rejection_reason": rejection_reason,
        "foliar_green_ratio": foliar_green_ratio,
        "total_foliar_ratio": total_foliar_ratio,
        "chlorosis_ratio": chlorosis_ratio,
        "lesion_ratio": lesion_ratio,
        "mammal_fur_ratio": mammal_fur_ratio,
        "skin_ratio": skin_ratio,
        "mean_exg": mean_exg,
        "positive_exg_ratio": positive_exg_ratio,
        "brightness": brightness,
        "sharpness": sharpness,
    }
