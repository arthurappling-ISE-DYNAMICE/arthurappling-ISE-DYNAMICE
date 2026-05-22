import subprocess
from pathlib import Path

def run_tesseract(image_path: str) -> str:
    """Run Tesseract OCR on a file. Returns extracted text."""
    try:
        result = subprocess.run(
            ["tesseract", image_path, "stdout", "--psm", "6"],
            capture_output=True,
            text=True,
            timeout=30,
            shell=False
        )
        return result.stdout.strip()
    except subprocess.TimeoutExpired:
        raise RuntimeError("OCR processing timed out")
    except FileNotFoundError:
        raise RuntimeError("Tesseract not installed or not in PATH")
