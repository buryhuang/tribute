import boto3
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from dotenv import load_dotenv
import os


class Searcher:
    def __init__(self, region="us-east-1"):
        load_dotenv()
        es_endpoint = os.environ.get("ES_ENDPOINT")
        es_username = os.environ.get("ES_USER")
        es_password = os.environ.get("ES_PASSWORD")

        self.client = Elasticsearch(
            hosts=[es_endpoint],
            http_auth=(es_username, es_password),
            # use_ssl=True,
            # verify_certs=True,
            # connection_class=RequestsHttpConnection,
            port=443,
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
        return self.client.indices.create(index=self.index_name, body=knn_index, ignore=400)

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
