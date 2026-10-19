"""Create small, transparent WebP versions of the original brand and partner logos.

Run: python -m pip install Pillow && python scripts/optimize-brand-logos.py
Original PNG files are preserved. Do not replace logos with unverified artwork.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "public" / "images"
LOGOS = (
    ("brand/premier-resort-travel-horizontal-logo.png", (320, 640)),
    ("logo-palace-resorts-clean.png", (240, 480)),
)

for relative_path, widths in LOGOS:
    source = IMAGES / relative_path
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGBA")
        for width in widths:
            target_width = min(width, image.width)
            target_height = max(1, round(image.height * target_width / image.width))
            resized = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
            target = source.with_name(f"{source.stem}-{width}.webp")
            resized.save(target, "WEBP", quality=86, method=6, exact=True)
            print(f"{target.relative_to(ROOT)}: {target.stat().st_size:,} bytes; {target_width}x{target_height}")
