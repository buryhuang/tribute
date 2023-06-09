import boto3
import json
import os
import ssl
import urllib
from dotenv import load_dotenv


def send_to_elasticsearch(endpoint, username, password, data):
    p = urllib.request.HTTPPasswordMgrWithDefaultRealm()
    p.add_password(None, endpoint, username, password)

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    auth_handler = urllib.request.HTTPBasicAuthHandler(p)
    https_handler = urllib.request.HTTPSHandler(context=ctx)
    opener = urllib.request.build_opener(https_handler, auth_handler)

    urllib.request.install_opener(opener)

    try:
        req = urllib.request.Request(endpoint, data=data.encode("utf-8"),
                                     headers={"Content-Type": "application/json"})
        result = opener.open(req)
        messages = result.read()
        return messages
    except IOError as e:
        print(e)


class Searcher:
    def __init__(self, region="us-east-1"):
        load_dotenv()
        self.es_endpoint = os.environ.get("ES_ENDPOINT")
        self.es_username = os.environ.get("ES_USER")
        self.es_password = os.environ.get("ES_PASSWORD")
        self.index_name = "art-tribute-images"

    def create_index(self):
        knn_index = {
            "settings": {
                "index.knn": True,
            },
            "mappings": {
                "properties": {
                    "feature_vector": {
                        "type": "knn_vector",
                        "dimension": 512,
                    }
                }
            },
        }
        send_to_elasticsearch(f"{self.es_endpoint}/{self.index_name}", self.es_username, self.es_password,
                              json.dumps(knn_index))

    def bulk_ingest(self, generate_data, chunk_size=128):
        data_chunk = []
        for data in generate_data:
            data_chunk.append(data)
            if len(data_chunk) >= chunk_size:
                for item in data_chunk:
                    endpoint = f"{self.es_endpoint}/{self.index_name}/_doc"
                    send_to_elasticsearch(endpoint, self.es_username, self.es_password, json.dumps(item))
                data_chunk = []

        if data_chunk:
            for item in data_chunk:
                endpoint = f"{self.es_endpoint}/{self.index_name}/_doc"
                send_to_elasticsearch(endpoint, self.es_username, self.es_password, json.dumps(item))

    def knn_search(self, query_features, k=10):
        body = {
            "size": k,
            "query": {
                "knn": {
                    "feature_vector": {
                        "vector": query_features,
                        "k": k,
                    }
                }
            },
        }
        endpoint = f"{self.es_endpoint}/{self.index_name}/_search"
        response_data = send_to_elasticsearch(endpoint, self.es_username, self.es_password, json.dumps(body))
        if response_data:
            response_json = json.loads(response_data)
            return response_json.get("hits", {}).get("hits", [])
        else:
            return []
