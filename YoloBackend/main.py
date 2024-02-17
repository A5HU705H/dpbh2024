from ultralytics import YOLO
from fastapi import WebSocket
import torch
import torch.nn as nn
import base64
from PIL import Image
from starlette.applications import Starlette
from starlette.endpoints import WebSocketEndpoint, HTTPEndpoint
from sentence_transformers import SentenceTransformer
from starlette.routing import Route, WebSocketRoute
from ultralytics import YOLO
import io
from paddleocr import PaddleOCR
import numpy as np
from model import frclassifier , pred

ocr = PaddleOCR(use_angle_cls=False, lang='en')
embed_model =  SentenceTransformer('sentence-transformers/all-distilroberta-v1').to('cpu')
embed_model[1].pooling_mode_mean_tokens = True
embed_model[1].pooling_mode_cls_token = False
review_classifier = frclassifier()


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
        img = np.array(img)
        
        result=model(img, show = False, conf = 0.3)
        boxes = result[0].boxes.xyxy.cpu().tolist()
        clss = result[0].boxes.cls.cpu().tolist()
        
        reviews = []
        def process_review(review):
            result=ocr.ocr(review,cls=False)
            for idx in range(len(result)):
                res = result[idx]
                review=''
                for line in res:
                    review+=(line[1][0]+' ')
                reviews.append(review)
            # print(review)
            # review.strip()
        
        for box, cls in zip(boxes, clss):
            review = img[int(box[1]):int(box[3]), int(box[0]):int(box[2])]
            process_review(review)
        
        # print(reviews)
        embeds = embed_model.encode(reviews)
        preds = review_classifier(torch.tensor(embeds))
        # preds = review_classifier(torch.tensor(embeds).to(review_classifier.fin.device))
        for review, pred in zip(reviews, preds):
            if(pred>0.7):await websocket.send_json({"type":"FakeReview","text":review,"darkPattern":"Fake Review"})


 


routes = [
    WebSocketRoute("/ws", Detector)
]

app = Starlette(routes=routes)