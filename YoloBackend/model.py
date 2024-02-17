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

class frclassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.main=nn.Sequential(
            skipblock(768,512,384),
            skipblock(384,512,192),
            skipblock(192,192,192),
            skipblock(192,96,48),
            skipblock(48,48,24)
        )
        self.fin = nn.Linear(24,1)

    def forward(self, xb):
        x = self.main(xb)
        return self.fin(x)

def pred(model, embed_model, text):
    with torch.no_grad():
        embeds = embed_model.encode(text)
        print(embeds.shape)
        preds = model(torch.tensor(embeds))
    return {"text": text,"preds": preds,"embeds": embeds}