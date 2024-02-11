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
# model = YOLO('yolov8n.pt')
model=  YOLO('bestn320Amazon.pt')
class Echo(WebSocketEndpoint):
    encoding = "text"
    async def on_connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
    async def on_receive(self, websocket, data):        
        try:
            Imb=data.split(',')[1]
        except:
            return None
        img=Image.open(io.BytesIO(base64.b64decode(Imb)))
        return model(img,show=True,conf=0.3)


routes = [
    WebSocketRoute("/ws", Echo)
]

app = Starlette(routes=routes)