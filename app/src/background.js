'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

const endpoint = 'http://127.0.0.1:5000';
console.log('Background is running');
let tab;
chrome.tabs.query({ active: true, currentWindow: true }).then(([activeTab])=>{
  tab=activeTab;
  console.log(tab);
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('message received');
  if (request.type === 'innerText') {
    sendResponse({type:'innerText'});
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
        chrome.tabs.sendMessage(tab.id, { type: 'innerText', payload: res });
    }
    asyncOperation().then(() => {
      sendResponse(fetchRes());
    });

    return true;
  }
});
