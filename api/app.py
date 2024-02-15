from fastapi import WebSocket
import torch
import json
from sentence_transformers import SentenceTransformer
from starlette.endpoints import WebSocketEndpoint
from starlette.routing import  WebSocketRoute
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from model import Classifier, skipblock, pred
from rag import get_dark_patterns

dpdet = Classifier()
embed_model  = SentenceTransformer('BAAI/bge-large-en')
dpdet.load_state_dict(torch.load('model.bin'))
class Pipeline(WebSocketEndpoint):
    async def on_connect(self, websocket: WebSocket):
        return await websocket.accept()
    async def on_receive(self, websocket: WebSocket,data):
        Input=json.loads(data)
        result=pred(dpdet,embed_model,Input['text'])
        if(result['preds']>0.7):
            await websocket.send_json({"text":result['text'],'darkPattern':get_dark_patterns(result['embeds'])[0][-1],'tabId':Input['tabId']})
    
routes = [
    WebSocketRoute("/ws", Pipeline)
]

app = Starlette(routes=routes)
