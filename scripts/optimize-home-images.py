"""Generate responsive WebP versions of homepage travel-style photographs.

Run: python -m pip install Pillow && python scripts/optimize-home-images.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "public" / "images"
NAMES = ("home-style-family-beach", "home-style-adults-only", "home-style-romantic-dinner")
WIDTHS = (480, 960)

for name in NAMES:
    source = IMAGES / f"{name}.jpg"
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        for width in WIDTHS:
            target_width = min(width, image.width)
            target_height = round(image.height * target_width / image.width)
            resized = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
            target = IMAGES / f"{name}-{width}.webp"
            resized.save(target, "WEBP", quality=78, method=6)
            print(f"{target.relative_to(ROOT)}: {target.stat().st_size:,} bytes")
