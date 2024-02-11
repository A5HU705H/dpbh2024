'use strict';

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
            highlightElement(root);
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
    first=false;
}

// Call the function initially with the document body to start processing
// processInPreorderAndCheckVisibility(document.body);

// Set interval to check for visibility changes every 500ms
setTimeout(()=>{
  first=true;
  setInterval(() => {
    processInPreorderAndCheckVisibility(document.body);
},1000);
},1000);

//Only check change when user is idle for atleast 1 second
// chrome.idle.queryState({detectionIntervalInSeconds:1}).then( (idleState) => {
//     console.log("idle")
//     processInPreorderAndCheckVisibility(Document.body);

// }).catch(console.log("error"))

function processClick(root){
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
  setTimeout(()=>{
    processClick(document.body);;
  },300);
  
  }

// // // Add event listeners
document.addEventListener('click', handleChange);
document.addEventListener('keypress', handleChange);
document.addEventListener('resize',handleChange);
document.addEventListener('blur', handleChange);
document.addEventListener("pointerover", handleChange);

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




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

  }
});
