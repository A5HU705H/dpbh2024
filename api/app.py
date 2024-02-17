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

# loading the classifier and the embedding model
dpdet=Classifier()
dpdet.load_state_dict(torch.load('distill3skip2.bin'))

embed_model  = SentenceTransformer('sentence-transformers/all-distilroberta-v1')

class Pipeline(WebSocketEndpoint):
    async def on_connect(self, websocket: WebSocket):
        return await websocket.accept()
    
    # socket endpoint for messages
    async def on_receive(self, websocket: WebSocket,data):
        Input = json.loads(data)
        print(Input)
        # create text embeddings and then do dark patterns detection
        result = pred(dpdet, embed_model, Input['text'])
        try:
            if(result['preds'] >  0.7):
                # for high confidence dark patterns use rag
                DarkPatterns = get_dark_patterns(result['embeds'])
                Dp = DarkPatterns[0][-1]
                res={ 
                     'text':result['text'], 
                     'darkPattern':Dp, 
                     'tabId':Input['tabId']
                    }
                
                # send the dark patterns based on text
                await websocket.send_json(res)
        except:
            pass
routes = [
    WebSocketRoute("/ws", Pipeline)
]

app = Starlette(routes = routes)
