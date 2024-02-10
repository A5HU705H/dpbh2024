from fastapi import WebSocket
import uvicorn
from starlette.applications import Starlette
from starlette.endpoints import WebSocketEndpoint, HTTPEndpoint
from starlette.responses import HTMLResponse
from starlette.routing import Route, WebSocketRoute
from ultralytics import YOLO

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

class Homepage(HTTPEndpoint):
    async def get(self, request):
        return HTMLResponse(html)

class Echo(WebSocketEndpoint):
    encoding = "text"
    async def on_connect(self, websocket: WebSocket) -> None:
        self.model=YOLO('yolov8n.pt')
        await websocket.accept()
        
    async def on_receive(self, websocket, data):
        results=self.model.track('https://ultralytics.com/images/bus.jpg',persist=True)
        # print(results)
        await websocket.send_text(f"Message text was: {data} LOlm {results}")

routes = [
    Route("/", Homepage),
    WebSocketRoute("/ws", Echo)
]

app = Starlette(routes=routes)