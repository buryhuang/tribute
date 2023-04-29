import os
import sys
import glob
from PIL import Image
import clip_image_search.utils as utils
from clip_image_search import CLIPFeatureExtractor, Searcher
from utils import pil_loader


def get_image_paths(image_folder):
    return glob.glob(os.path.join(image_folder, "**", "*"), recursive=True)


def main(image_folder):
    image_paths = get_image_paths(image_folder)
    extractor = CLIPFeatureExtractor()
    searcher = Searcher()
    searcher.create_index()

    def generate_data():
        for path in image_paths:
            if not os.path.isfile(path):
                continue
            try:
                image = pil_loader(path)
                features = extractor.get_image_features([image])[0]
                yield {
                    "_op_type": "index",
                    "_index": searcher.index_name,
                    "_source": {
                        "path": path,
                        "feature_vector": features,
                    },
                }
            except Exception as e:
                print(f"Error processing image {path}: {e}")

    searcher.bulk_ingest(generate_data)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ingest_images.py <image_folder>")
        sys.exit(1)
    image_folder = sys.argv[1]
    main(image_folder)
