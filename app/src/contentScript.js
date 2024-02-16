'use strict';

const dom = document.body.innerText;

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'innerText',
    payload: {
      message: document.body.innerHTML,
      text: dom,
    },
  }
);
function updateBanner(event) {
  var id = event.target.id.toString() || '';
  var classList = event.target.classList.toString() || '';
  var node = event.target.nodeName.toLowerCase() || '';
  console.log({ id, classList, node });
}

let ReportingMode = false;



// Listen for message
let ReportEvent = new CustomEvent('ReportClick');
let NotReportEvent = new CustomEvent('NotReportClick');
document.addEventListener('ReportClick', () => {
  document.head.appendChild(stylesheet);
  document.addEventListener('click', updateBanner, false);
});
document.addEventListener('NotReportClick', () => {
  document.head.removeChild(stylesheet);
  document.removeEventListener('click', updateBanner, false);
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'Boxes') {
    console.log('Boxes received');
    ReportingMode = !ReportingMode;
    if (ReportingMode) {
      document.dispatchEvent(ReportEvent);
    } else {
      document.dispatchEvent(NotReportEvent);
    }
    sendResponse({});
  } else if(request.type==='result'){
      console.log(request);
  } else if (request.type === 'innerText') {
    const res = request.payload;
    console.log('innerText received');
    console.log(res);
  }
  console.log(request.payload.message);
  return true;
});
