"""
Remove backgrounds from the four program card images using rembg.
Saves transparent PNG files back to the assets directory.
"""
import sys
import os
from pathlib import Path

try:
    from rembg import remove
    from PIL import Image
    import io
except ImportError as e:
    print(f"Import error: {e}")
    sys.exit(1)

assets_dir = Path(r"c:\Users\SNEHA SAHADEVAN\OneDrive\Desktop\robokidz\assets")

images = [
    "program-junior.png",
    "program-senior.png",
    "program-coding.png",
    "program-advanced.png",
]

for filename in images:
    src = assets_dir / filename
    if not src.exists():
        print(f"[SKIP] {filename} not found")
        continue

    print(f"[PROCESSING] {filename} ...")

    # Read original
    with open(src, "rb") as f:
        input_data = f.read()

    # Remove background — produces RGBA PNG
    output_data = remove(input_data)

    # Open result and verify it has alpha channel
    img = Image.open(io.BytesIO(output_data)).convert("RGBA")

    # Save back as PNG (lossless, preserves transparency)
    img.save(src, format="PNG")
    print(f"[DONE]       {filename} — {img.size[0]}x{img.size[1]} RGBA saved")

print("\nAll program images processed successfully.")
