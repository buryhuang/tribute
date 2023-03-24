import requests
from flask import Flask, request, jsonify
from base64 import b64encode
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/process_image', methods=['POST'])
def process_image():
    data = request.json
    image_url = data.get('image_url')
    if not image_url:
        return jsonify({'error': 'image_url not provided'}), 400
    try:
        # Download image raw bytes from the provided image url
        response = requests.get(image_url)
        response.raise_for_status()
        image_bytes = response.content

        # Send the raw image bytes to Huggingface API
        huggingface_response = requests.post("https://fffiloni-clip-interrogator-2.hf.space/run/clipi2", json={
            "data": [
                "data:image/png;base64," + b64encode(image_bytes).decode('utf-8'),
                "best",
                4,
            ]
        }).json()

        # Extract the output data from Huggingface API response
        output_data = huggingface_response.get('data')
        if not output_data:
            return jsonify({'error': 'no output data fromHuggingface API'}), 500

        return jsonify({'data': output_data}), 200

    except requests.exceptions.HTTPError as e:
        return jsonify({'error': str(e)}), e.response.status_code

if __name__ == '__main__':
    app.run(debug=True)