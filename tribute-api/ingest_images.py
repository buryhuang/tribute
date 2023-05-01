import os
import sys
import glob
import json
from PIL import Image

sys.path.append('clip_image_search')
from clip_image_search import CLIPFeatureExtractor, Searcher
from clip_image_search.utils import pil_loader

import time

def get_image_paths(image_folder):
    return glob.glob(os.path.join(image_folder, "**", "*"), recursive=True)


def main(image_folder_path):
    image_paths = get_image_paths(image_folder_path)
    extractor = CLIPFeatureExtractor()
    searcher = Searcher()
    # searcher.create_index()

    def generate_data():
        for path in image_paths:
            if not os.path.isfile(path):
                continue

            root_ext = os.path.splitext(path)
            image_base_path = root_ext[0]
            image_ext = root_ext[1].lower()

            if image_ext not in [".jpg", ".jpeg", ".png"]:
                continue

            try:
                image = pil_loader(path)
                features = extractor.get_image_features([image])[0]

                metadata_path = image_base_path + ".json"
                if os.path.exists(metadata_path):
                    with open(metadata_path, "r") as metadata_file:
                        metadata = json.load(metadata_file)
                else:
                    metadata = {
                        "contract_address": "",
                        "image_url": ""
                    }

                yield {
                    "timestamp": int(os.path.getmtime(path)),
                    "created_at": int(os.path.getmtime(path)),
                    "indexed_at": int(time.time() * 1000),
                    "feature_vector": features,
                    "path": path,
                    "metadata": metadata
                }
            except Exception as e:
                print(f"Error processing image {path}: {e}")

    searcher.bulk_ingest(generate_data(), chunk_size=128)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ingest_images.py <image_folder>")
        sys.exit(1)
    image_folder = sys.argv[1]
    main(image_folder)
