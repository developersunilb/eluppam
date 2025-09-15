from fastapi import FastAPI
from pydantic import BaseModel
from PIL import Image, ImageOps, ImageFilter
import pytesseract
import base64
import io
from fastapi.middleware.cors import CORSMiddleware
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set the path to the Tesseract executable
# IMPORTANT: Replace 'YOUR_TESSERACT_PATH' with the actual path to your tesseract.exe
# Example for Windows: r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# Example for Linux/macOS: r'/usr/bin/tesseract' or r'/usr/local/bin/tesseract'
pytesseract.pytesseract.tesseract_cmd = pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageData(BaseModel):
    image: str

@app.post("/recognize")
async def recognize_image(image_data: ImageData):
    try:
        image_data_url = image_data.image
        header, encoded = image_data_url.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(image_bytes))

        logger.info(f"Original image size: {image.size}")

        # Convert image to grayscale
        image = image.convert("L")

        # Invert image
        image = ImageOps.invert(image)

        # Binarize the image
        threshold = 128
        image = image.point(lambda p: p > threshold and 255)

        # Noise removal
        image = image.filter(ImageFilter.MedianFilter(size=3))

        # Find bounding box
        bbox = image.getbbox()
        if bbox:
            image = image.crop(bbox)
            logger.info(f"Image size after cropping: {image.size}")
        else:
            logger.warning("No bounding box found, image might be empty.")

        # Resize image to a standard size (e.g., 300x300) and set DPI
        image = image.resize((300, 300), Image.LANCZOS)
        image.info['dpi'] = (300, 300)
        logger.info(f"Image size after resize and DPI set: {image.size}, DPI: {image.info.get('dpi')}")


        # Save the processed image for debugging
        timestamp = int(time.time())
        processed_image_path = f"processed_image_{timestamp}.png"
        image.save(processed_image_path)
        logger.info(f"Processed image saved to: {processed_image_path}")

        # Perform OCR using Tesseract
        # Experiment with different PSM values
        # psm 10: Treat the image as a single character. (Current)
        # psm 6: Assume a single uniform block of text.
        # psm 7: Treat the image as a single text line.
        
        custom_config_psm10 = r'--oem 3 --psm 10'
        custom_config_psm6 = r'--oem 3 --psm 6'
        custom_config_psm7 = r'--oem 3 --psm 7'

        # Try psm 10 first
        data_psm10 = pytesseract.image_to_data(image, lang='mal', config=custom_config_psm10, output_type=pytesseract.Output.DICT)
        text_psm10 = " ".join(data_psm10['text']).strip()
        conf_psm10 = data_psm10['conf'][0] if data_psm10['conf'] else -1
        logger.info(f"Tesseract output (PSM 10): '{text_psm10}', Confidence: {conf_psm10}")
        if text_psm10 != '':
            recognized_text = text_psm10
        else:
            # If psm 10 doesn't work, try psm 6
            data_psm6 = pytesseract.image_to_data(image, lang='mal', config=custom_config_psm6, output_type=pytesseract.Output.DICT)
            text_psm6 = " ".join(data_psm6['text']).strip()
            conf_psm6 = data_psm6['conf'][0] if data_psm6['conf'] else -1
            logger.info(f"Tesseract output (PSM 6): '{text_psm6}', Confidence: {conf_psm6}")
            if text_psm6 != '':
                recognized_text = text_psm6
            else:
                # If psm 6 doesn't work, try psm 7
                data_psm7 = pytesseract.image_to_data(image, lang='mal', config=custom_config_psm7, output_type=pytesseract.Output.DICT)
                text_psm7 = " ".join(data_psm7['text']).strip()
                conf_psm7 = data_psm7['conf'][0] if data_psm7['conf'] else -1
                logger.info(f"Tesseract output (PSM 7): '{text_psm7}', Confidence: {conf_psm7}")
                recognized_text = text_psm7
        
        # Try psm 10 first
        text_psm10 = pytesseract.image_to_string(image, lang='mal', config=custom_config_psm10)
        logger.info(f"Tesseract output (PSM 10): \'{text_psm10.strip()}\'")
        if text_psm10.strip() != '':
            recognized_text = text_psm10
        else:
            # If psm 10 doesn't work, try psm 6
            text_psm6 = pytesseract.image_to_string(image, lang='mal', config=custom_config_psm6)
            logger.info(f"Tesseract output (PSM 6): \'{text_psm6.strip()}\'")
            if text_psm6.strip() != '':
                recognized_text = text_psm6
            else:
                # If psm 6 doesn't work, try psm 7
                text_psm7 = pytesseract.image_to_string(image, lang='mal', config=custom_config_psm7)
                logger.info(f"Tesseract output (PSM 7): \'{text_psm7.strip()}\'")
                recognized_text = text_psm7

        return {"text": recognized_text.strip()}
    except Exception as e:
        logger.error(f"Error during recognition: {e}", exc_info=True)
        return {"error": str(e)}
