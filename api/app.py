from flask import Flask, jsonify, request
from flask_cors import CORS
import torch
from sentence_transformers import SentenceTransformer
from model import Classifier, skipblock, predlist
from rag import get_dark_patterns
import imgkit
import time
dpdet = Classifier()
embed_model  = SentenceTransformer('BAAI/bge-large-en')
dpdet.load_state_dict(torch.load('model.bin'))
app = Flask(__name__)
CORS(app)

@app.route('/html', methods = ['POST'])
def returnHTML():
    data = request.json
    imgkit.from_string(data, 'out.jpg')
    # print(data)
    return 'successfully recieved'


@app.route('/dom', methods = ['POST'])
def returnDOM():
    data = request.json.split('\n')
    # print(data)
    st=time.time()
    det = predlist(dpdet, embed_model,data)
    dark = []
    for i in det:
        dark.append({
            "text": i[0],
            "label": get_dark_patterns(i[1])[0][-1]
        })
    print(dark)
    return jsonify(dark)


if __name__ == '__main__':
    app.run(threaded=True, debug=True)
