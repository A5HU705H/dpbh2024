'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

const endpoint = 'http://127.0.0.1:5000';
console.log('Background is running');
const [tab]= await chrome.tabs.query({ active: true, currentWindow: true });
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('message received');
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;
    sendResponse({});
    async function fetchRes() {
      const res = await fetch(endpoint + '/dom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(request.payload.text),
      })
        .then((response) => {
          return response.json();
        })
        .catch((error) => console.error('Error:', error));
        chrome.tabs.sendMessage(tab.id, { type: 'GREETINGS', payload: res });
    }
    fetchRes();
    return true;
  }
});
