from flask import Flask, jsonify, request
from flask_cors import CORS
from rag import get_dark_patterns
import imgkit

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
    print(data)
    return data


@app.route('/query', methods = ['POST'])
def getDarkPatterns():
    data = request.json
    query = data['query']
    dark_patterns = get_dark_patterns(query)
    return jsonify(dark_patterns)

@app.route('/flags', methods = ['GET'])
def getFlags():
    print("Hello")
    return jsonify([{"text": "Ignite", "flag": "Confirm Shaming"},
                    {"text": "Chocolate", "flag": "Misdirection"},])

if __name__ == '__main__':
    app.run(threaded=True, debug=True)
