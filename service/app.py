import requests
from flask import Flask, request, jsonify
from base64 import b64encode
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)


def get_referenced_artists(image_text):
    # Search for all occurrences of the phrase "inspired by" and extract the artist names
    pattern = r"inspired by (\w+(?: \w+)*)"
    matches = re.findall(pattern, image_text)
    if matches:
        print(matches)
        results = []
        initial_percent = 45
        factor = 0.35
        for match in matches:
            results.append({
                'name': match,
                'percentage': initial_percent
            })
            initial_percent = initial_percent * factor
        print(results)
        return results
    else:
        return None

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
            return jsonify({'error': 'no output data from Huggingface API'}), 500

        # Example data
        # {
        #     "data": [
        #         "a painting of a taxi cab on a city street, inspired by Ken Howard, trending on cg society, american scene painting, hands raised, ny, waving, full width",
        #         {
        #             "__type__": "update",
        #             "visible": true
        #         },
        #         {
        #             "__type__": "update",
        #             "visible": true
        #         },
        #         {
        #             "__type__": "update",
        #             "visible": true
        #         }
        #     ]
        # }

        print(output_data)
        # Return the referenced artists
        return jsonify({'data': get_referenced_artists(output_data[0])}), 200

    except requests.exceptions.HTTPError as e:
        return jsonify({'error': str(e)}), e.response.status_code


if __name__ == '__main__':
    app.run(debug=True)