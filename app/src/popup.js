'use strict';

import './popup.css';
console.log('this is a popup');
// async function Make_boxes() {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   console.log('clicked');
//   chrome.tabs.sendMessage(tab.id, {
//     type: 'Boxes',
//   });
// }
// document.getElementById('Boxes').addEventListener('click', Make_boxes);
// console.log('erew');

let submit = document.querySelector('button#report');

submit.addEventListener('click', () => {
  console.log('clicked');

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'SELECT_MODE' }, (response) => {
      console.log(response);
      console.log('Popup received response');
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SELECTED_INPUT') {
    sendResponse({});
  }
});

// (function () {
//   // broadcast to content scripts and active background scripts
//   chrome.runtime.sendMessage(
//     {
//       type: 'GREETINGS',
//       payload: {
//         message: 'Hello, my name is Pop. I am from Popup.',
//       },
//     },
//     (response) => {
//       // console.log(response.message);
//       console.log('Popup received response');
//     }
//   );
// })();
