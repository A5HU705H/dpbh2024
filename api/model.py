import json
from PIL import Image
import requests
import numpy as np
import transformers
import re
import torch
import torch.nn as nn
import torch.nn.functional as F
import urllib
from matplotlib import pyplot as plt
from PIL import Image
import requests
from torch.utils.data import Dataset
from torchvision import datasets
import torchvision.transforms as transforms
from sentence_transformers import SentenceTransformer
import pandas as pd
from PIL import Image
import torch.optim as optim

class skipblock(nn.Module):
    def __init__(self,inp,hid,out):
        super().__init__()
        self.first = nn.Sequential(
            nn.Linear(inp, hid),
            nn.LeakyReLU(0.01))
        self.second= nn.Sequential(
            nn.Linear(hid, out),
            nn.LeakyReLU(0.01)
        )
        self.skip = nn.Linear(inp,out)
        self.ln  = nn.LayerNorm(out)

    def forward(self, xb):
        x= self.first(xb)
        return self.ln(self.skip(xb) + self.second(x))
    

class Classifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.skip1 = skipblock(1024,512,256)
        self.skip2 = skipblock(256,128,64)
        self.l = nn.Linear(64,1)

    def forward(self, xb):
        return F.sigmoid(self.l(self.skip2(self.skip1(xb))))



def pred(model, embed_model, text):
    with torch.no_grad():
        embeds = embed_model.encode(text)
        preds = model(torch.tensor(embeds))
    return {"text": text,"preds": preds,"embeds": embeds}
