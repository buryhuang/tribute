import io
import json

from PIL import Image
from flask import Flask, request, jsonify
from transformers import CLIPProcessor, CLIPModel

app = Flask(__name__)

# Load the CLIP model and processor
model = CLIPModel.from_pretrained("fffiloni/CLIP-Interrogator-2")
processor = CLIPProcessor.from_pretrained("fffiloni/CLIP-Interrogator-2")


# Define the API endpoint
@app.route('/extract_text', methods=['POST'])
def extract_text():
    # Get the image data from the request body
    image_data = request.get_data()

    # Convert the image data to a PIL image
    image = Image.open(io.BytesIO(image_data))

    # Preprocess the image for the CLIP model
    inputs = processor(image, return_tensors="pt", padding=True)

    # Pass the image through the CLIP model
    outputs = model(**inputs)

    # Get the text embeddings from the CLIP model
    text_embeddings = outputs.last_hidden_state[:, 0, :]

    # Decode the text embeddings to get the corresponding text
    text = processor.decode(text_embeddings)

    # Return the extracted text as a JSON response
    return jsonify({'text': text})
