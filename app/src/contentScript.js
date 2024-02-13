'use strict';
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'hello') {
      const { url } = request;
      chrome.location.replace(url);
  }

});
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
var makeRed=true;
function updateStates(root){

  visibilityMap.set(root, root.checkVisibility());
  for(const child of root.children){
    updateStates(child);
  }
}
var first=true;
var count=0;
function highlightElement(element) {
  // Add CSS styles to highlight the element
  // if(element.matches(':hover')){return ;}
  element.style.border = '2px solid red'; // Example: red border
  element.style.backgroundColor = 'rgba(255, 0, 0, 0.5) '; // Semi-transparent yellow background color
  element.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'; // Example: shadow effect

  // You can also apply other styles to make the element stand out more
}
function unhighlightElement(element) {
  // Add CSS styles to highlight the element
  // if(element.matches(':hover')){return ;}
  element.style.border = ''; // Example: red border
  element.style.backgroundColor = ''; // Semi-transparent yellow background color
  element.style.boxShadow = ''; // Example: shadow effect

  // You can also apply other styles to make the element stand out more
}
// Function to process elements in preorder and check visibility changes
function processInPreorderAndCheckVisibility(root) {
    if (!root) return;
    
    // Check visibility of the current element
    const wasVisible = visibilityMap.get(root) || false;
    const isVisible = root.checkVisibility();
   // unhighlightElement(root);
    // Check if the visibility of the current element has changed
    if (wasVisible !== isVisible) {
      if(!first){
        if (isVisible) {
          if(makeRed){
            highlightElement(root);
          }
            // console.log(wasVisible);
            // console.log(isVisible);
             console.log(root);
            var event=new CustomEvent("nagging",{"element":root});
            document.dispatchEvent(event);
            // console.log(root, 'visibility changed to visible');
            count++;
            visibilityMap.set(root, isVisible);// If visibility has changed, do not check its children
            updateStates(root);

            // Trigger your desired action or event here
        } else {
         // visibilityMap.set(root, isVisible);
          unhighlightElement(root);
           // console.log(root, 'visibility changed to hidden');
            // Trigger your desired action or event here
        }
      }
      else{
        visibilityMap.set(root, isVisible);// If visibility has changed, do not check its children
        updateStates(root);
      }
        return;
    }

    visibilityMap.set(root, isVisible);
    for (const child of root.children) {
        processInPreorderAndCheckVisibility(child);
    }
  //  first=false;
}

// Call the function initially with the document body to start processing
// processInPreorderAndCheckVisibility(document.body);


// Define regular expressions to match specific text patterns
const regexList = [
  /\d+\s+[dD]ays\s+\d+\s+[hH]ours\s+\d+\s+[mM]inutes/,
  /\d+\s+[dD]ays\s+\d+\s+[hH]ours/,
  /\d+\s+[hH]ours\s+\d+\s+[mM]inutes/,
  /[dD]on't\s+[mM]iss\s+[oO]ut/,
  /[lL]imited\s+[aA]vailability/,
  /[wW]hile\s+[sS]upplies\s+last/,
  /[lL]imited\s+[qQ]uantities/,
  /[oO]ffer\s+[eE]xpires\s+[sS]oon/,
  /[aA]ct\s+[nN]ow/,
  /[lL]ightning\s+[dD]eal/,
  /[bB]uy\s+[sS]oon/,
  /\d+:\d+/,
  /deal\s+of\s+the\s+day/i, // Added regex for "Deal of the day" with case-insensitivity
  /\b\d+% off\b/i, // Added regex for percentages like "85% off" with case-insensitivity
  "Deal of the day",
];
// Function to check if text matches any of the regular expressions
function matchesRegexList(text) {
  return regexList.some(regex => text.match(regex) !== null);
}

function highlightMatchingElements() {
  function traverse(element) {
    // If the element is a text node
    if (element.nodeType === Node.TEXT_NODE) {
      // Check if the text matches any of the regular expressions
      if (matchesRegexList(element.nodeValue)) {
        // Create a span element to wrap the text
        const span = document.createElement('span');
        span.textContent = element.nodeValue;
        
        // Apply styles to the span element
        span.style.backgroundColor = 'yellow'; // Change background color as needed
        span.style.color = 'blue'; // Change text color as needed
        span.style.fontSize = '12px'; // Change font size as needed
        
        // Add the text "Forced action detected" to the span element
        const forcedActionText = document.createElement('span');
        forcedActionText.textContent = ' False Urgency detected';
        span.appendChild(forcedActionText);
        
        // Replace the text node with the span element
        element.parentNode.replaceChild(span, element);
      }
    } else {
      // If the element is not a text node, traverse its child nodes
      for (let i = 0; i < element.childNodes.length; i++) {
        traverse(element.childNodes[i]);
      }
    }
  }

  // Call traverse function starting from the body element
  traverse(document.body);
}

document.addEventListener('DOMContentLoaded', highlightMatchingElements);
setTimeout(()=>{

    highlightMatchingElements();

},5000);

// Set interval to check for visibility changes every 500ms
setTimeout(()=>{
  first=true;
  setInterval(() => {
    processInPreorderAndCheckVisibility(document.body);
},2000);
},
5000);

//Only check change when user is idle for atleast 1 second
// chrome.idle.queryState({detectionIntervalInSeconds:1}).then( (idleState) => {
//     console.log("idle")
//     processInPreorderAndCheckVisibility(Document.body);

// }).catch(console.log("error"))

function processClick(root){
  first=true;
  if (!root) return;
    // console.log(root);
    const isVisible = root.checkVisibility();
    visibilityMap.set(root, isVisible);
    
    for (const child of root.children) {
        processClick(child);
    }
    

}


// // Key press event handler
function handleChange(event) {
  console.log("handlechange triggered");
  // console.log(event.target);
  makeRed=false;
  first=true;
  setTimeout(()=>{
    
    processClick(document.body);makeRed=true;
  },300);
  
  }
  function handleChangeLoad(event) {
    // console.log("handlechangeClick triggered");
    
    // console.log(event.target);
    makeRed=false;
    console.log("URL LOaded")
    first=true;
    setTimeout(()=>{
      console.log("First triggered");
     
      processClick(document.body);
      // makeRed=true;
    },4000);
    setTimeout(()=>{
      first=false;
    },5000);
    
    }
// // // Add event listeners
document.addEventListener('click', handleChangeLoad);
document.addEventListener("keydown", handleChange);
document.addEventListener('resize',handleChange);
document.addEventListener('blur', handleChange);
window.addEventListener("load", handleChangeLoad);

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
      checkboxElement.style.backgroundColor = 'yellow';
      checkboxElement.appendChild(document.createTextNode("Preselection removed"));
      checkboxElement.style.border = '5px solid red';
      var messageElement = document.createElement('div');
      messageElement.textContent = "Preselection removed";
      messageElement.style.backgroundColor = 'lightgreen'; // Set background color to green
      messageElement.style.padding = '5px'; // Add padding for better visibility
      messageElement.style.marginTop = '5px'; // Add margin to separate from checkbox

      // Append the message element to the checkbox
      checkboxElement.parentNode.appendChild(messageElement);


      // checkboxElement.innerText=checkboxElement.innerText+"Preselection removed";

      checkremoved = false;
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

