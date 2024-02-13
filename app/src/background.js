'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
const ws = new WebSocket("ws://localhost:8000/ws");
const endpoint = 'http://127.0.0.1:5000';

console.log('Background is running');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {    
  if (request.type === "innerText") {
      console.log('message received');      
      fetch(endpoint + '/dom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(request.payload.text),
      })
          .then(response => response.json())
          .then(response => sendResponse(response))
          .catch(error => console.log('Error:', error));
      return true;
  }
});

function takeAndSendScreenshot() {
    chrome.tabs.captureVisibleTab(
      null,
      { format: 'png' },
      function (dataUrl) {
        console.log(dataUrl,"dataUrl: ");
        ws.send(dataUrl);
      }
    );
}
setInterval(takeAndSendScreenshot, 550);
