import os
from PIL import Image

folder = "public/team"

# Crop parameters for each team member to perfectly align face position, head top, and scale to Subash's framing

crops = {
    "subash.png": {
        # Orig: 1536x1024
        # Crop 1:1 box: x_center=794, y: 0..1024
        "box": (282, 0, 1306, 1024)
    },
    "saran.png": {
        # Orig: 1264x843
        # Crop 1:1 box: x_center=633, y: 0..843
        "box": (211, 0, 1054, 843)
    },
    "thiru.png": {
        # Orig: 1536x1024
        # Crop 1:1 box: x_center=766, y: 0..1024 (adjust y to align top of head to 32px)
        "box": (254, 0, 1278, 1024)
    },
    "sasi.png": {
        # Orig: 1264x843
        # Crop 1:1 box: x_center=675, y: 0..843
        "box": (254, 0, 1097, 843)
    },
    "udaya.png": {
        # Orig: 843x1264 (Portrait)
        # Top of head is at y=133.
        # To align head top with Subash (~3% from top), start crop at y=107, height=843
        "box": (0, 107, 843, 950)
    }
}

target_size = (1024, 1024)

for filename, info in crops.items():
    path = os.path.join(folder, filename)
    if not os.path.exists(path):
        # fallback to team images root if needed
        path = os.path.join("team images", filename)
    
    img = Image.open(path)
    cropped = img.crop(info["box"])
    resized = cropped.resize(target_size, Image.Resampling.LANCZOS)
    
    out_path = os.path.join(folder, filename)
    resized.save(out_path, quality=95)
    print(f"Successfully processed {filename} -> saved to {out_path} ({target_size[0]}x{target_size[1]})")
