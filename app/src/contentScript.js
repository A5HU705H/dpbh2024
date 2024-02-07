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
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: document.body.innerHTML,
    },
  },
  (response) => {
    console.log(response.message);
  }
).then().catch();



// Preselection removal
function executeFunction() {
  console.log("presection removal");
  var selectElements = document.querySelectorAll("select");

  // Iterate through each select element
  selectElements.forEach(function (selectElement) {
    // Check if any option is already selected
    var selectedOption = selectElement.querySelector("option:checked");
    if (selectedOption) {
      // If selected, change the value to "none"
      selectElement.value = "none";
    }
  });

  // Get all checkbox elements
  var checkboxElements = document.querySelectorAll('input[type="checkbox"]');
  // console.log(checkboxElements);

  // Iterate through each checkbox element
  checkboxElements.forEach(function (checkboxElement) {
    // Check if the checkbox is preselected
    if (checkboxElement.checked) {
      // If preselected, uncheck the checkbox
      checkboxElement.checked = false;
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
