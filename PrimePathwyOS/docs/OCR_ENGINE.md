# OCR ENGINE ARCHITECTURE: Prime Pathwy Sovereign OS

## 1. Local OCR Pipeline
To maintain strict data sovereignty, the Prime Pathwy Sovereign OS utilizes a fully local OCR pipeline, eliminating reliance on cloud APIs (like Google Cloud Vision or AWS Textract).

### 1.1 Core Components
- **Engine:** Tesseract OCR (via `pytesseract`).
- **Preprocessing:** OpenCV (`opencv-python-headless`) and NumPy.
- **Extraction Logic:** Regular Expressions (Regex) and custom Python heuristics.

### 1.2 The Processing Pipeline
1. **Ingestion:** The file is saved to the `/temporary` directory.
2. **Preprocessing (Crucial for Accuracy):**
   - The image is loaded via OpenCV.
   - Converted to grayscale (`cv2.cvtColor`).
   - Adaptive thresholding is applied to handle varying lighting conditions typical of field-captured receipts.
   - Morphological operations (noise removal) are applied to clean the image.
3. **Text Extraction:** Tesseract processes the cleaned image and outputs raw text.
4. **Entity Parsing:**
   - **Amount:** Regex searches for currency symbols and decimal patterns (e.g., `\$?\d+\.\d{2}`).
   - **Date:** Regex searches for common date formats (MM/DD/YYYY, YYYY-MM-DD).
   - **Vendor:** Heuristics analyze the first few lines of text, often cross-referencing against a known vendor list in the database.

## 2. Future Enhancements & AI Integration
The current regex-based extraction is brittle when faced with highly irregular receipt layouts.

### 2.1 AI-Enhanced OCR Roadmap
- **Phase 1: Semantic Parsing:** Continue using Tesseract for raw text extraction, but replace the regex parser with a local, quantized Large Language Model (LLM) like Llama-3-8B. The LLM will be prompted to extract structured JSON from the messy OCR text.
- **Phase 2: Vision-Language Models (VLMs):** Replace Tesseract entirely with a local VLM (e.g., LLaVA or Moondream). The VLM takes the raw image as input and directly outputs the structured JSON, bypassing the intermediate raw-text step and significantly improving accuracy on complex layouts.
- **Phase 3: Confidence Scoring:** Implement a confidence scoring system. If the VLM's confidence for the "Total Amount" falls below a threshold (e.g., 85%), the receipt is automatically flagged for manual administrative review, ensuring the database is never polluted with low-confidence data.
