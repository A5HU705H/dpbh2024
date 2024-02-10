import json
import pickle
import hnswlib
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer, CrossEncoder

def create_query_embedding(biencoder, query):
    embedding = biencoder.encode([query], normalize_embeddings=True)[0]
    return embedding

def create_hnsw_index(embedding, M=16, efC=100):
    embeddings = embedding
    num_dim = embeddings.shape[1]
    ids = np.arange(embeddings.shape[0])
    index = hnswlib.Index(space="ip", dim=num_dim)
    index.init_index(max_elements=embeddings.shape[0], ef_construction=efC, M=M)
    index.add_items(embeddings, ids)
    return index

def find_nearest_neighbors(query_embedding, queries, search_index, EF=100, K = 1, COSINE_THRESHOLD = 0.3):
    search_index.set_ef(EF)
    labels, distances = search_index.knn_query(query_embedding, k=K)  # Find the k-nearest neighbors for the query embedding
    labels = [label for label, distance in zip(labels[0], distances[0]) if (1 - distance) >= COSINE_THRESHOLD]
    query_list = [queries[i] for i in labels]
    return query_list

def rerank_queries_with_cross_encoder(query, chunks):
    pairs = [(query, chunk) for chunk in chunks]
    scores = cross_encoder.predict(pairs)
    sorted_chunks = [chunk for _, chunk in sorted(zip(scores, chunks), reverse=True)]
    return sorted_chunks

# data = pd.read_csv('/content/dataset.tsv',sep='\t')

# dark_patterns = data.values.tolist()

biencoder = SentenceTransformer("BAAI/bge-large-en-v1.5", device="cpu")
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-12-v2", max_length=512, device="cpu")

# vec_database = []
# for row in dark_patterns:
#   entry = []
#   name = row[1]
#   label = row[3]
#   embedding = create_query_embedding(biencoder, name)
#   entry.append(embedding)
#   entry.append(label)
#   vec_database.append(entry)
#   print(row)


# with open('embeddings.pkl', 'wb') as f:
#   pickle.dump(vec_database,f)

with open('embeddings.pkl', 'rb') as f:
  vec_database = pickle.load(f)


def get_dark_patterns(query):
    list_of_embeddings = [i[0] for i in vec_database]
    search_index = create_hnsw_index(np.array(list_of_embeddings))
    topk_queries = find_nearest_neighbors(query, vec_database , search_index)
    return topk_queries
