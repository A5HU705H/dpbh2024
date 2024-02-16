'use strict';




//Hidden PopUp Detector
const visibilityMap = new Map();
var makeRed=true;
function updateStates(root){

  visibilityMap.set(root, root.checkVisibility());
  for(const child of root.children){
    updateStates(child);
  }
}

var count=0;
function highlightElement(element) {

  element.style.border = '2px solid red'; // Example: red border
  element.style.backgroundColor = 'rgba(255, 0, 0, 0.5) '; // Semi-transparent yellow background color
  element.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'; // Example: shadow effect


}
function unhighlightElement(element) {

  element.style.border = ''; 
  element.style.backgroundColor = ''; 
  element.style.boxShadow = ''; 

  // You can also apply other styles to make the element stand out more
}
function processInPreorderAndCheckVisibility(root) {
  if (!root) return;
  // console.log(root);
  // Check visibility of the current element
  const wasVisible = visibilityMap.get(root) || false;
  const isVisible = root.checkVisibility();
 // unhighlightElement(root);
  // Check if the visibility of the current element has changed
  if (wasVisible !== isVisible) {
    if(true){
      if (isVisible) {
        if(window.getComputedStyle(root).position==='fixed'){
          highlightElement(root);
        }
        if(isElementCoveringViewport(root)){
          highlightElement(root);
        }

        // console.log(root);
          // console.log(wasVisible);
          // console.log(isVisible);
           console.log(root);
           console.log(window.getComputedStyle(root).position);
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

}


function isElementCoveringViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= 0 &&
    rect.bottom >= window.innerHeight &&
    rect.left <= 0 &&
    rect.right >= window.innerWidth
  );
}



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
  /(?:\b\d+% off\b|\bdeal\s+of\s+the\s+day\b|\blightning\s+deal\b|\bhurry\s+up\b|\bsale\s+ends\b)\s*[^.!?]*(?:\d+\s+[dD]ays\s+\d+\s+[hH]ours\s+\d+\s+[mM]inutes|\d+\s+[dD]ays\s+\d+\s+[hH]ours|\d+\s+[hH]ours\s+\d+\s+[mM]inutes)/i
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
    return true;
  }
  if (request.type === 'innerText') {
    const res = request.payload;
    console.log(res);
  }
  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }
  console.log(request.payload.message);
  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});