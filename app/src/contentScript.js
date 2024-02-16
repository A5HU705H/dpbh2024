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


var removed = false;
var checkremoved = false;
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
      checkboxElement.appendChild(
        document.createTextNode('Preselection removed')
      );
      checkboxElement.style.border = '5px solid red';
      var messageElement = document.createElement('div');
      messageElement.textContent = 'Preselection removed';
      messageElement.style.backgroundColor = 'lightgreen'; // Set background color to green
      messageElement.style.padding = '5px'; // Add padding for better visibility
      messageElement.style.marginTop = '5px'; // Add margin to separate from checkbox

      // Append the message element to the checkbox
      checkboxElement.parentNode.appendChild(messageElement);

      // checkboxElement.innerText=checkboxElement.innerText+"Preselection removed";
    }
  });
  checkremoved = true;
  var selectElements = document.querySelectorAll('select');

  // Iterate through each select element
  selectElements.forEach(function (selectElement) {
    // Check if any option is already selected
    var selectedOption = selectElement.querySelector('option:checked');
    if (selectedOption && !removed) {
      // If selected, change the value to "none"
      selectElement.value = 'none';
    }
  });
  removed = true;
}

// Call the function initially
executeFunction();

// Call the function every 1000 milliseconds (1 second)
setInterval(executeFunction, 5000);
