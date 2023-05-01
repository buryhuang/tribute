import boto3
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from dotenv import load_dotenv
import os
import urllib
import ssl
import json


def send_to_elasticsearch(endpoint, username, password, data):
    # create an authorization handler
    p = urllib.request.HTTPPasswordMgrWithDefaultRealm()
    p.add_password(None, endpoint, username, password);

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    auth_handler = urllib.request.HTTPBasicAuthHandler(p)
    https_handler = urllib.request.HTTPSHandler(context=ctx)
    opener = urllib.request.build_opener(https_handler, auth_handler)

    urllib.request.install_opener(opener)

    try:
        req = urllib.request.Request(endpoint, data=data.encode('utf-8'),
                                     headers={'Content-Type': 'application/json'}
                                     )
        result = opener.open(req)
        messages = result.read()
        # print(messages)
    except IOError as e:
        print(e)


class Searcher:
    def __init__(self, region="us-east-1"):
        load_dotenv()
        self.es_endpoint = os.environ.get("ES_ENDPOINT")
        self.es_username = os.environ.get("ES_USER")
        self.es_password = os.environ.get("ES_PASSWORD")

        self.client = Elasticsearch(
            hosts=[self.es_endpoint],
            http_auth=(self.es_username, self.es_password),
            headers={"Content-Type": "application/json"},
            # use_ssl=True,
            # verify_certs=True,
            # connection_class=RequestsHttpConnection,
            # port=443,
        )
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
        # return self.client.indices.create(index=self.index_name, body=knn_index, ignore=400)
        send_to_elasticsearch(f"{self.es_endpoint}/{self.index_name}", self.es_username, self.es_password,
                              json.dumps(knn_index))

    def bulk_ingest(self, generate_data, chunk_size=128):
        return bulk(self.client, generate_data, chunk_size=chunk_size)

    def knn_search(self, query_features, k=10):
        body = {
            "size": k,
            "_source": {
                "exclude": ["feature_vector"],
            },
            "query": {
                "knn": {
                    "feature_vector": {
                        "vector": query_features,
                        "k": k,
                    }
                }
            },
        }
        return self.client.search(index=self.index_name, body=body)
