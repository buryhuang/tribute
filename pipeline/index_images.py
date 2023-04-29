import os
import sys
import base64
import requests
from PIL import Image
from pathlib import Path
from elasticsearch import Elasticsearch
from image_embedding import ImageEmbeddingModel

# Configuration
ELASTICSEARCH_HOST = "localhost"
ELASTICSEARCH_PORT = 9200
ELASTICSEARCH_INDEX = "image_embeddings"

# Initialize Elasticsearch client
es = Elasticsearch([{"host": ELASTICSEARCH_HOST, "port": ELASTICSEARCH_PORT}])

# Initialize the image embedding model
embedding_model = ImageEmbeddingModel()

def index_image_embedding(image_path):
    # Open the image file
    with Image.open(image_path) as image:
        # Compute the image embedding vector
        embedding_vector = embedding_model.compute_embedding(image)

    # Index the embedding vector in Elasticsearch
    document = {
        "image_path": str(image_path),
        "embedding_vector": embedding_vector.tolist(),
    }
    response = es.index(index=ELASTICSEARCH_INDEX, document=document)

    print(f"Indexed image: {image_path} - response: {response}")


def process_images(folder):
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tiff")):
                image_path = Path(root) / file
                try:
                    index_image_embedding(image_path)
                except Exception as e:
                    print(f"Error processing image {image_path}: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_images_folder>")
        sys.exit(1)

    image_folder = sys.argv[1]
    process_images(image_folder)
