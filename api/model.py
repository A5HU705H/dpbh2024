import torch
import torch.nn as nn

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
        self.skip1 = skipblock(768,512,384)
        self.skip2 = skipblock(384,256,128)
        self.skip3 = skipblock(128,64,32)
        self.fin = nn.Linear(32,1)



    def forward(self, xb):
        return self.fin(self.skip3(self.skip2(self.skip1(xb))))




def pred(model, embed_model, text):
    with torch.no_grad():
        embeds = embed_model.encode(text)
        preds = model(torch.tensor(embeds))
    return {"text": text,"preds": preds,"embeds": embeds}
