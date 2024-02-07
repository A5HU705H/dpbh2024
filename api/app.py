from flask import Flask, jsonify, request
from flask_cors import CORS
import imgkit

app = Flask(__name__)
CORS(app)

@app.route('/html', methods = ['POST'])
def returnHTML():
    data = request.json
    imgkit.from_string(data, 'out.jpg')
    # print(data)
    return 'successfully recieved'

if __name__ == '__main__':
    app.run(threaded=True, debug=True)
