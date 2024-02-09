'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

const endpoint = 'http://127.0.0.1:5000';
console.log('Background is running');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('message received');
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

    // fetch(endpoint + '/html', {
    //   method: "POST",
    //   headers : {
    //     "Content-Type": "application/json"
    //   },
    //   body : JSON.stringify(request.payload.message)
    // }).then((response) => {console.log(response);})
    //   .catch((error) => console.error("Error:", error));
    // // Log message coming from the `request` parameter
    // console.log(request.payload.message);
    // // Send a response message
    // sendResponse({
    //   message,
    // });
    fetch(endpoint + '/dom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.payload.text),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .catch((error) => console.error('Error:', error));
  }
});
