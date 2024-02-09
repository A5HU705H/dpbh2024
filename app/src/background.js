'use strict';

const endpoint = 'http://127.0.0.1:5000';

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

  setInterval(takeAndSendScreenshot, 500); // 5000 milliseconds = 5 seconds
}

// Call the function to start scheduling screenshots
scheduleScreenshot();
