from flask import Flask, jsonify, request
from flask_cors import CORS
import torch
from sentence_transformers import SentenceTransformer
from model import Classifier, skipblock, predlist
from rag import get_dark_patterns
import imgkit
import base64
from flask import Flask, request, send_from_directory
import time

dpdet = Classifier()
embed_model  = SentenceTransformer('BAAI/bge-large-en')
dpdet.load_state_dict(torch.load('model.bin'))
print('Time taken to load model:', time.time()-start)
app = Flask(__name__)
CORS(app)

@app.route('/screenshot', methods = ['POST'])
def renderScreenshot():
    print("Screenshot recieved")
    screenshot_data = request.json.get('screenshotData')
    image_data = base64.b64decode(screenshot_data.split(',')[1])
    with open('out.jpg', 'wb') as f:
        f.write(image_data)
    return 'Image saved as out.jpg'

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
