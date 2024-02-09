from flask import Flask, jsonify, request
from flask_cors import CORS
import imgkit
import base64
from flask import Flask, request, send_from_directory

app = Flask(__name__)
CORS(app)

# @app.route('/html', methods = ['POST'])
# def returnHTML():
#     data = request.json
#     imgkit.from_string(data, 'out.jpg')
#     # print(data)
#     return 'successfully recieved'

@app.route('/screenshot', methods = ['POST'])
def renderScreenshot():
    print("Screenshot recieved")
    screenshot_data = request.json.get('screenshotData')
    image_data = base64.b64decode(screenshot_data.split(',')[1])
    with open('out.jpg', 'wb') as f:
        f.write(image_data)
    return 'Image saved as out.jpg'

    

if __name__ == '__main__':
    app.run(threaded=True, debug=True)
