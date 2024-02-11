'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
const ws = new WebSocket("ws://localhost:8000/ws");
const endpoint = 'http://127.0.0.1:5000';
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log('message received');
//   if (request.type === 'innerText') {
//     sendResponse({type:'innerText'});
//     async function fetchRes() {
//       const res = await fetch(endpoint + '/dom', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify(request.payload.text),
//       })
//         .then((response) => {
//           return response.json();
//         })
//         .catch((error) => console.error('Error:', error));
//         chrome.tabs.sendMessage(sender.tab.id, { type: 'innerText', payload: res });
//     }
//     fetchRes();
//     return true;
//   }
// });
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

// Function to schedule taking and sending screenshots every 5 seconds

setInterval(takeAndSendScreenshot, 550); // 5000 milliseconds = 5 seconds
