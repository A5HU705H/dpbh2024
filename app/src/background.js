'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

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
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    chrome.tabs.captureVisibleTab(
      null,
      { format: 'png' },
      function (dataUrl) {
        console.log(dataUrl);
        fetch(endpoint + '/screenshot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ screenshotData: dataUrl }),
        })
          .then((response) => {
            if (response.ok) {
              console.log('Screenshot sent successfully');
            } else {
              console.error('Error sending screenshot:', response.statusText);
            }
          })
          .catch((error) => {
            console.error('Error sending screenshot:', error);
          });
      }
    );
  });
}

// Function to schedule taking and sending screenshots every 5 seconds
function scheduleScreenshot() {

  setInterval(takeAndSendScreenshot, 5000); // 5000 milliseconds = 5 seconds
}

// Call the function to start scheduling screenshots
scheduleScreenshot();


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
      chrome.tabs.sendMessage(tabId, {
          message: 'hello',
          url: changeInfo.url
      });
  }
});