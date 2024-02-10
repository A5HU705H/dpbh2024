'use strict';

import './popup.css';
console.log("this is a popup");
async function Make_boxes(){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("clicked");
  chrome.tabs.sendMessage(
    tab.id,
    {
      type: 'Boxes',
    }
  );
};
document.getElementById('Boxes').addEventListener('click',Make_boxes);
console.log("erew");

(function () {
  // broadcast to content scripts and active background scripts
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    (response) => {
      // console.log(response.message);
      console.log('Popup received response');
    }
  );
})();
