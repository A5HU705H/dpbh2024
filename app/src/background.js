'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

const endpoint = 'http://127.0.0.1:5000';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    fetch(endpoint + '/html', {
      method: "POST",
      headers : {
        "Content-Type": "application/json"
      },
      body : JSON.stringify(request.payload.message)
    }).then((response) => {console.log(response);})
      .catch((error) => console.error("Error:", error));
    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    sendResponse({
      message,
    });
    fetch(endpoint + '/dom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.payload.text),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.error('Error:', error));

    fetch(endpoint + '/flags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.error('Error:', error));
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
