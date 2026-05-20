import pytesseract
from PIL import Image
import cv2
import numpy as np
import re
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Tesseract path if specified in .env
tesseract_cmd = os.getenv("TESSERACT_CMD")
if tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

def preprocess_image(image_path):
    """
    Preprocess image for better OCR accuracy.
    Converts to grayscale, applies thresholding.
    """
    img = cv2.imread(image_path)
    if img is None:
        return None
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # Noise removal
    kernel = np.ones((1, 1), np.uint8)
    img_cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    
    return img_cleaned

def extract_entities(text):
    """
    Basic regex-based entity extraction for receipts.
    """
    data = {
        "vendor": None,
        "date": None,
        "amount": None,
        "raw_text": text
    }
    
    # Simple amount extraction (looks for $X.XX or X.XX at end of lines)
    amount_matches = re.findall(r'\$?(\d+\.\d{2})', text)
    if amount_matches:
        # Assuming the largest amount is the total
        try:
            amounts = [float(a) for a in amount_matches]
            data["amount"] = max(amounts)
        except ValueError:
            pass
            
    # Simple date extraction
    date_matches = re.search(r'(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})', text)
    if date_matches:
        data["date"] = date_matches.group(1)
        
    # Vendor (usually first line, very naive approach)
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        data["vendor"] = lines[0]
        
    return data

def process_receipt(image_path):
    """
    Main pipeline: Preprocess -> OCR -> Extract
    """
    try:
        # Try to preprocess if it's an image
        if image_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            processed_img = preprocess_image(image_path)
            if processed_img is not None:
                text = pytesseract.image_to_string(processed_img)
            else:
                # Fallback to simple PIL image
                text = pytesseract.image_to_string(Image.open(image_path))
        else:
            # Not an image (e.g. PDF), would need PyMuPDF integration here
            # For simplicity, returning empty
            text = "PDF processing not fully implemented in this stub."
            
        return extract_entities(text)
    except Exception as e:
        print(f"OCR Error: {e}")
        return {"vendor": None, "date": None, "amount": None, "raw_text": str(e)}
