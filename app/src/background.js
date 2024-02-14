'use strict';

// With background scripts you can communicate with popup
// and contentScript filess.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_page
const ws = new WebSocket('ws://localhost:8000/ws');
const wsb = new WebSocket('ws://localhost:50037/ws');
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'innerText') {
    const Arr = request.payload.text.split('\n');
    for (let i in Arr) {
      if (Arr[i])
        wsb.send(
          JSON.stringify({
            type: 'innerText',
            text: Arr[i],
            tabId: sender.tab.id,
          })
        );
    }
  } else if (request.type === 'SELECTED_INPUT') {
    console.log('request: ', request);
    wsb.send(JSON.stringify(request));
  }
});

wsb.addEventListener('message', (event) => {
  let obj = JSON.parse(event.data);
  console.log(obj);
  chrome.tabs.sendMessage(obj.tabId, { type: 'result', ...obj });
});
function takeAndSendScreenshot() {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, function (dataUrl) {
    // console.log(dataUrl, 'dataUrl: ');
    ws.send(dataUrl);
  });
}
setInterval(takeAndSendScreenshot, 550);
