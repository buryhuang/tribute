import requests
from flask import Flask, request, jsonify, send_from_directory
from base64 import b64encode
from flask_cors import CORS
import re
from dotenv import load_dotenv
import boto3
import hashlib
from utils import get_referenced_artists
from PIL import Image
import io 


load_dotenv()

app = Flask(__name__)
CORS(app)

s3 = boto3.client('s3')

import os, subprocess
import torch


def setup():
    install_cmds = [
        ['pip', 'install', 'ftfy', 'gradio', 'regex', 'tqdm', 'transformers==4.21.2', 'timm', 'fairscale', 'requests'],
        ['pip', 'install', 'open_clip_torch'],
        ['pip', 'install', '-e', 'git+https://github.com/pharmapsychotic/BLIP.git@lib#egg=blip'],
        ['git', 'clone', '-b', 'open-clip', 'https://github.com/pharmapsychotic/clip-interrogator.git']
    ]
    for cmd in install_cmds:
        print(subprocess.run(cmd, stdout=subprocess.PIPE).stdout.decode('utf-8'))


setup()

# download cache files
print("Download preprocessed cache files...")
CACHE_URLS = [
    'https://huggingface.co/pharma/ci-preprocess/resolve/main/ViT-H-14_laion2b_s32b_b79k_artists.pkl',
    'https://huggingface.co/pharma/ci-preprocess/resolve/main/ViT-H-14_laion2b_s32b_b79k_flavors.pkl',
    'https://huggingface.co/pharma/ci-preprocess/resolve/main/ViT-H-14_laion2b_s32b_b79k_mediums.pkl',
    'https://huggingface.co/pharma/ci-preprocess/resolve/main/ViT-H-14_laion2b_s32b_b79k_movements.pkl',
    'https://huggingface.co/pharma/ci-preprocess/resolve/main/ViT-H-14_laion2b_s32b_b79k_trendings.pkl',
]
os.makedirs('cache', exist_ok=True)
for url in CACHE_URLS:
    print(subprocess.run(['wget', url, '-P', 'cache'], stdout=subprocess.PIPE).stdout.decode('utf-8'))

import sys

sys.path.append('src/blip')
sys.path.append('clip-interrogator')

import gradio as gr
from clip_interrogator import Config, Interrogator

config = Config(clip_model_name="ViT-H-14/laion2b_s32b_b79k")
config.device = 'cuda' if torch.cuda.is_available() else 'cpu'
config.blip_offload = False if torch.cuda.is_available() else True
config.chunk_size = 2048
config.flavor_intermediate_count = 512
config.blip_num_beams = 64

ci = Interrogator(config)


def inference(image_bytes, mode, best_max_flavors):
    stream = io.BytesIO(image_bytes)
    image = Image.open(stream).convert('RGB')  # open image with PIL and convert to RGB
    if mode == 'best':
        prompt_result = ci.interrogate(image, max_flavors=int(best_max_flavors))
        print("mode best: " + prompt_result)
        return prompt_result, gr.update(visible=True), gr.update(visible=True), gr.update(visible=True)
    elif mode == 'classic':
        prompt_result = ci.interrogate_classic(image)
        print("mode classic: " + prompt_result)
        return prompt_result, gr.update(visible=True), gr.update(visible=True), gr.update(visible=True)
    else:
        prompt_result = ci.interrogate_fast(image)
        print("mode fast: " + prompt_result)
        return prompt_result, gr.update(visible=True), gr.update(visible=True), gr.update(visible=True)

def process_image(image_bytes):
    try:
        # Generate sha256 hash of the image
        image_hash = hashlib.sha256(image_bytes).hexdigest()

        # Save the image to s3 bucket
        s3.put_object(Body=image_bytes, Bucket='arthornors-images', Key=f"{image_hash}.png")

        # Send the raw image bytes to Huggingface API
        prompt, gr1, gr2, gr3  = inference(image_bytes, 'best', 4)

        print(prompt, gr1, gr2, gr3)
        # Return the referenced artists
        return jsonify({'data': get_referenced_artists(prompt)}), 200

    except requests.exceptions.HTTPError as e:
        return jsonify({'error': str(e)}), e.response.status_code


@app.route('/process_image', methods=['POST'])
def process_image_api():
    data = request.json
    image_url = data.get('image_url')
    if not image_url:
        return jsonify({'error': 'image_url not provided'}), 400
    try:
        # Download image raw bytes from the provided image url
        response = requests.get(image_url)
        response.raise_for_status()
        image_bytes = response.content

        return process_image(image_bytes)

    except requests.exceptions.HTTPError as e:
        return jsonify({'error': str(e)}), e.response.status_code


@app.route('/process_image_url', methods=['GET'])
def process_image_url_api():
    image_url = request.args.get('image_url')
    if not image_url:
        return jsonify({'error': 'image_url not provided'}), 400
    try:
        # Download image raw bytes from the provided image url
        response = requests.get(image_url)
        response.raise_for_status()
        image_bytes = response.content

        return process_image(image_bytes)

    except requests.exceptions.HTTPError as e:
        return jsonify({'error': str(e)}), e.response.status_code


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    print(f"Request path: {path}")
    print(f"Request body: {request.json}")
    return jsonify({'error': 'undefined route'}), 404


if __name__ == '__main__':
    app.run(debug=True)
