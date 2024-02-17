from ultralytics import YOLO
from fastapi import WebSocket
import uvicorn
import base64
from PIL import Image
from starlette.applications import Starlette
from starlette.endpoints import WebSocketEndpoint, HTTPEndpoint
from starlette.responses import HTMLResponse
from starlette.routing import Route, WebSocketRoute
from ultralytics import YOLO
import io
from paddleocr import PaddleOCR

def process_review(review):
    ocr = PaddleOCR(use_angle_cls=True, lang='en')
    result=ocr.ocr(review,cls=True)
    for idx in range(len(result)):
        res = result[idx]
        out=''
        for line in res:
            out+=line[1][0]+'\n'
    out.strip()
    print(out)
    return True
# model = YOLO('yolov8n.pt')
model=  YOLO('bestn320Amazon.pt')
class Detector(WebSocketEndpoint):
    encoding = "text"
    async def on_connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
    async def on_receive(self, websocket, data):        
        try:
            Imb=data.split(',')[1]
        except:
            return None
        img=Image.open(io.BytesIO(base64.b64decode(Imb)))
        result=model(img,show=True,conf=0.3)
        boxes = result[0].boxes.xyxy.cpu().tolist()
        clss = result[0].boxes.cls.cpu().tolist()
        for box, cls in zip(boxes, clss):
            review = img[int(box[1]):int(box[3]), int(box[0]):int(box[2])]
            process_review(review)


routes = [
    WebSocketRoute("/ws", Detector)
]

app = Starlette(routes=routes)