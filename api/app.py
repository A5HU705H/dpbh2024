from fastapi import WebSocket
import torch
import json
from sentence_transformers import SentenceTransformer
from starlette.endpoints import WebSocketEndpoint
from starlette.routing import  WebSocketRoute
from starlette.applications import Starlette
from model import Classifier , pred
from rag import get_dark_patterns
import __main__
dpdet=Classifier()
dpdet.load_state_dict(torch.load('distill3skip2.bin'))
embed_model  = SentenceTransformer('sentence-transformers/all-distilroberta-v1')
def preProcess(InputStr:str)->str:
    l=''.join(e for e in InputStr if e.isalpha() or e.isspace() or e=='\n' or e=='\r' or e=='\t')
    # print(l)
    return l
class Pipeline(WebSocketEndpoint):
    async def on_connect(self, websocket: WebSocket):
        return await websocket.accept()
    async def on_receive(self, websocket: WebSocket,data):
        Input=json.loads(data)
        print(Input)
        result=pred(dpdet,embed_model,Input['text'])
        try:
            if(result['preds']>0.7):
                DarkPatterns=get_dark_patterns(result['embeds'])
                Dp=DarkPatterns[0][-1]
                res={"text":Input['text'],'darkPattern':Dp,'tabId':Input['tabId']}
                await websocket.send_json(res)
        except:
            pass
routes = [
    WebSocketRoute("/ws", Pipeline)
]

app = Starlette(routes=routes)
