let visibilityMap = new Map();

function updateStates(root) {
  visibilityMap.set(root, root.checkVisibility());
  for (const child of root.children) {
    updateStates(child);
  }
}
var first = true;
var count = 0;
function highlightElement(element) {
  // Add CSS styles to highlight the element
  // if(element.matches(':hover')){return ;}
  element.style.border = '2px solid red'; // Example: red border
  element.style.backgroundColor = 'rgba(255, 0, 0, 0.5) '; // Semi-transparent yellow background color
  element.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'; // Example: shadow effect
  var messageElement = document.createElement('div');
  messageElement.textContent = 'Forced action detected';
  // element.innerText = element.innerText + 'Forced action removed';
  messageElement.style.backgroundColor = 'lightgreen'; // Set background color to green
  messageElement.style.padding = '5px'; // Add padding for better visibility
  messageElement.style.marginTop = '5px'; // Add margin to separate from checkbox

  // Append the message element to the checkbox
  // element.parentNode.appendChild(messageElement);

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
    if (!first) {
      if (isVisible) {
        highlightElement(root);
        // console.log(wasVisible);
        // console.log(isVisible);
        console.log(root);
        var event = new CustomEvent('nagging', { element: root });
        document.dispatchEvent(event);
        // console.log(root, 'visibility changed to visible');
        count++;
        visibilityMap.set(root, isVisible); // If visibility has changed, do not check its children
        updateStates(root);

        // Trigger your desired action or event here
      } else {
        // visibilityMap.set(root, isVisible);
        unhighlightElement(root);
        // console.log(root, 'visibility changed to hidden');
        // Trigger your desired action or event here
      }
    } else {
      visibilityMap.set(root, isVisible); // If visibility has changed, do not check its children
      updateStates(root);
    }
    return;
  }

  visibilityMap.set(root, isVisible);
  for (const child of root.children) {
    processInPreorderAndCheckVisibility(child);
  }
  first = false;
}

// Call the function initially with the document body to start processing
// processInPreorderAndCheckVisibility(document.body);

// Set interval to check for visibility changes every 500ms
setTimeout(() => {
  first = true;
  setInterval(() => {
    processInPreorderAndCheckVisibility(document.body);
  }, 1000);
}, 5000);


const ForcedMap = new Map();
function processClick(root) {
  if (!root) return;
  // console.log(root);
  const isVisible = root.checkVisibility();
  visibilityMap.set(root, isVisible);
  if (
    root.style.backgroundColor === 'rgba(255, 0, 0, 0.5)' &&
    !ForcedMap.has(root)
  ) {
    console.log('Adding message');
    var messageElement = document.createElement('div');
    messageElement.textContent = 'Forced action detected';
    // element.innerText = element.innerText + 'Forced action removed';
    messageElement.style.backgroundColor = 'lightgreen'; // Set background color to green
    messageElement.style.padding = '5px'; // Add padding for better visibility
    messageElement.style.marginTop = '5px'; // Add margin to separate from checkbox
    messageElement.style.position = 'relative';
    messageElement.style.zIndex = '1000';
    root.appendChild(messageElement);
    ForcedMap.set(root, true);
  }

  for (const child of root.children) {
    processClick(child);
  }
}

// // Key press event handler
function handleChange(event) {
  console.log('handlechange triggered');
  // console.log(event.target);
  setTimeout(() => {
    processClick(document.body);
  }, 600);
}

// // // Add event listeners
document.addEventListener('click', handleChange);
document.addEventListener('keypress', handleChange);
document.addEventListener('resize', handleChange);
document.addEventListener('blur', handleChange);
document.addEventListener('pointerover', handleChange);