'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
// const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
// console.log(
//   `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
// );

// console.log(document.cookie);
// console.log(Object.values(sessionStorage));

// Parsing of the DOM to get the texts
const dom = document.body.innerText;

// console.log(document.body.textContent);

// const dom = parser.parseFromString(document.body.innerHTML, 'text/html');
// console.log(dom);
// console.log(dom.body.innerText);
// console.log('Hello World');

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: document.body.innerHTML,
      text: dom,
    },
  },
  (response) => {
    console.log(response.message);
    console.log(response.text);
  }
);

//Hidden PopUp Detector
const visibilityMap = new Map();

function updateStates(root){

  visibilityMap.set(root, root.checkVisibility());
  for(const child of root.children){
    updateStates(child);
  }
}
var first=true;
// Function to process elements in preorder and check visibility changes
function processInPreorderAndCheckVisibility(root) {
    if (!root) return;
    
    // Check visibility of the current element
    const wasVisible = visibilityMap.get(root) || false;
    const isVisible = root.checkVisibility();
    
    // Check if the visibility of the current element has changed
    if (wasVisible !== isVisible) {
      if(!first){
        if (isVisible) {
            console.log(root, 'visibility changed to visible');
            // Trigger your desired action or event here
        } else {
           // console.log(root, 'visibility changed to hidden');
            // Trigger your desired action or event here
        }
      }
        // Update the map with the new visibility state
        visibilityMap.set(root, isVisible);
        
        // If visibility has changed, do not check its children
        updateStates(root);
        return;
    }
    
    // If visibility hasn't changed, continue processing its children
    for (const child of root.children) {
        processInPreorderAndCheckVisibility(child);
    }
    first=false;
}

// Call the function initially with the document body to start processing
processInPreorderAndCheckVisibility(document.body);

// Set interval to check for visibility changes every 500ms
setInterval(() => {
    processInPreorderAndCheckVisibility(document.body);
}, 2000);


var removed=false;
var checkremoved=false;
// Preselection removal
function executeFunction() {
  console.log('presection removal');
  var checkboxElements = document.querySelectorAll('input[type="checkbox"]');

  // Iterate through each checkbox element
  checkboxElements.forEach(function (checkboxElement) {
    // Check if the checkbox is preselected
    if (checkboxElement.checked && !checkremoved) {
      // If preselected, uncheck the checkbox
      checkboxElement.checked = false;
      checkremoved = true;
    }
  });
  var selectElements = document.querySelectorAll('select');

  // Iterate through each select element
  selectElements.forEach(function (selectElement) {
    // Check if any option is already selected
    var selectedOption = selectElement.querySelector('option:checked');
    if (selectedOption && !removed) {
      // If selected, change the value to "none"
      selectElement.value = 'none';
      removed = true;
    }
  });
}

// Call the function initially
executeFunction();

// Call the function every 1000 milliseconds (1 second)
setInterval(executeFunction, 5000);

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
