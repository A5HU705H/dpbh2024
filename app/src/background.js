'use strict';

const ws = new WebSocket("ws://127.0.0.1:8000/ws");
const wsb = new WebSocket("ws://127.0.0.1:50037/ws");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "innerText") {
    const arr = request.payload.text.split('\n')
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length > 2) {
        wsb.send(JSON.stringify({ "text": arr[i], "tabId": sender.tab.id }))
      }
    }
  }
});

wsb.addEventListener("message", (event) => {
  let obj = JSON.parse(event.data)
  console.log(obj)
  chrome.tabs.sendMessage(obj.tabId, { "type": 'result', ...obj })
});

ws.addEventListener("message", (event) => {
  let obj = JSON.parse(event.data)
  console.log(obj)
  // chrome.tabs.sendMessage(obj.tabId, { "type": 'result', ...obj })
});

function takeAndSendScreenshot() {
  chrome.tabs.captureVisibleTab(
    null,
    { format: 'png' },
    function (dataUrl) {
      ws.send(dataUrl);
    }
  );
}

setInterval(takeAndSendScreenshot, 1000);
