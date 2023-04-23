import requests
from flask import Flask, request, jsonify, send_from_directory
from base64 import b64encode
from flask_cors import CORS
import re
from dotenv import load_dotenv
import boto3
import hashlib
from utils import get_referenced_artists
import os
import json
from dotenv import dotenv_values
import openai

app = Flask(__name__)
CORS(app)

s3 = boto3.client('s3')

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@app.route('/.well-known/<path:filename>')
def well_known(filename):
    print(filename)
    return send_from_directory('static', filename)


def generate_image_with_prompt(prompt):
    openai.api_key = OPENAI_API_KEY

    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size="1024x1024"
    )
    image_url = response['data'][0]['url']
    return image_url


def process_image(image_url):
    try:
        # # Generate sha256 hash of the image
        # image_hash = hashlib.sha256(image_bytes).hexdigest()
        #
        # # Save the image to s3 bucket
        # s3.put_object(Body=image_bytes, Bucket='arthornors-images', Key=f"{image_hash}.png")

        # Send the raw image bytes to Huggingface API
        # huggingface_response = requests.post("https://fffiloni-clip-interrogator-2.hf.space/run/clipi2", json={
        #     "data": [
        #         "data:image/png;base64," + b64encode(image_bytes).decode('utf-8'),
        #         "best",
        #         4,
        #     ]
        # }).json()
        describe_result = requests.post("http://52.72.94.195:5000/process_image", json={
            "image_url": image_url
        }).json()
        print(describe_result)

        generated_url = generate_image_with_prompt(describe_result['data']['prompt'])
        print(generated_url)

        describe_result['data']['similar_image'] = generated_url
        return jsonify(describe_result), 200

        # # Extract the output data from Huggingface API response
        # output_data = huggingface_response.get('data')
        # if not output_data:
        #     return jsonify({'error': 'no output data from Huggingface API'}), 500
        #
        # print(output_data)
        # # Return the referenced artists
        # return jsonify({'data': get_referenced_artists(output_data[0])}), 200

    except requests.exceptions.HTTPError as e:
        return jsonify({'error': str(e)}), e.response.status_code


@app.route('/process_image', methods=['POST'])
def process_image_api():
    data = request.json
    image_url = data.get('image_url')
    if not image_url:
        return jsonify({'error': 'image_url not provided'}), 400
    try:
        # # Download image raw bytes from the provided image url
        # response = requests.get(image_url)
        # response.raise_for_status()
        # image_bytes = response.content

        return process_image(image_url)

    except requests.exceptions.HTTPError as e:
        return jsonify({'error': str(e)}), e.response.status_code


@app.route('/process_image_url', methods=['GET'])
def process_image_url_api():
    image_url = request.args.get('image_url')
    if not image_url:
        return jsonify({'error': 'image_url not provided'}), 400
    try:
        # Download image raw bytes from the provided image url
        # response = requests.get(image_url)
        # response.raise_for_status()
        # image_bytes = response.content

        return process_image(image_url)

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
