from flask import Flask, jsonify, request
from flask_cors import CORS
import torch
from sentence_transformers import SentenceTransformer
from model import Classifier, skipblock, predlist
from rag import get_dark_patterns
import time
start = time.time()
dpdet = Classifier()
embed_model  = SentenceTransformer('BAAI/bge-large-en')
dpdet.load_state_dict(torch.load('model.bin'))
print('Time taken to load model:', time.time()-start)
app = Flask(__name__)
CORS(app)

@app.route('/dom', methods = ['POST'])
def returnDOM():
    data = request.json.split('\n')
    st=time.time()
    det = predlist(dpdet, embed_model, data)
    dark = {}
    for i in det:
        dark[i[0]] = get_dark_patterns(i[1])[0][-1]
    print('Time taken:',time.time()-st)
    return jsonify(dark)


if __name__ == '__main__':
    app.run(threaded=True, debug=True)
