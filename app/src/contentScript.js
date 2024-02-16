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


let projcss='body{outline:1px solid #2980b9!important}article{outline:1px solid #3498db!important}nav{outline:1px solid #0088c3!important}aside{outline:1px solid #33a0ce!important}section{outline:1px solid #66b8da!important}header{outline:1px solid #99cfe7!important}footer{outline:1px solid #cce7f3!important}h1{outline:1px solid #162544!important}h2{outline:1px solid #314e6e!important}h3{outline:1px solid #3e5e85!important}h4{outline:1px solid #449baf!important}h5{outline:1px solid #c7d1cb!important}h6{outline:1px solid #4371d0!important}main{outline:1px solid #2f4f90!important}address{outline:1px solid #1a2c51!important}div{outline:1px solid #036cdb!important}p{outline:1px solid #ac050b!important}hr{outline:1px solid #ff063f!important}pre{outline:1px solid #850440!important}blockquote{outline:1px solid #f1b8e7!important}ol{outline:1px solid #ff050c!important}ul{outline:1px solid #d90416!important}li{outline:1px solid #d90416!important}dl{outline:1px solid #fd3427!important}dt{outline:1px solid #ff0043!important}dd{outline:1px solid #e80174!important}figure{outline:1px solid #f0b!important}figcaption{outline:1px solid #bf0032!important}table{outline:1px solid #0c9!important}caption{outline:1px solid #37ffc4!important}thead{outline:1px solid #98daca!important}tbody{outline:1px solid #64a7a0!important}tfoot{outline:1px solid #22746b!important}tr{outline:1px solid #86c0b2!important}th{outline:1px solid #a1e7d6!important}td{outline:1px solid #3f5a54!important}col{outline:1px solid #6c9a8f!important}colgroup{outline:1px solid #6c9a9d!important}button{outline:1px solid #da8301!important}datalist{outline:1px solid #c06000!important}fieldset{outline:1px solid #d95100!important}form{outline:1px solid #d23600!important}input{outline:1px solid #fca600!important}keygen{outline:1px solid #b31e00!important}label{outline:1px solid #ee8900!important}legend{outline:1px solid #de6d00!important}meter{outline:1px solid #e8630c!important}optgroup{outline:1px solid #b33600!important}option{outline:1px solid #ff8a00!important}output{outline:1px solid #ff9619!important}progress{outline:1px solid #e57c00!important}select{outline:1px solid #e26e0f!important}textarea{outline:1px solid #cc5400!important}details{outline:1px solid #33848f!important}summary{outline:1px solid #60a1a6!important}command{outline:1px solid #438da1!important}menu{outline:1px solid #449da6!important}del{outline:1px solid #bf0000!important}ins{outline:1px solid #400000!important}img{outline:1px solid #22746b!important}iframe{outline:1px solid #64a7a0!important}embed{outline:1px solid #98daca!important}object{outline:1px solid #0c9!important}param{outline:1px solid #37ffc4!important}video{outline:1px solid #6ee866!important}audio{outline:1px solid #027353!important}source{outline:1px solid #012426!important}canvas{outline:1px solid #a2f570!important}track{outline:1px solid #59a600!important}map{outline:1px solid #7be500!important}area{outline:1px solid #305900!important}a{outline:1px solid #ff62ab!important}em{outline:1px solid #800b41!important}strong{outline:1px solid #ff1583!important}i{outline:1px solid #803156!important}b{outline:1px solid #cc1169!important}u{outline:1px solid #ff0430!important}s{outline:1px solid #f805e3!important}small{outline:1px solid #d107b2!important}abbr{outline:1px solid #4a0263!important}q{outline:1px solid #240018!important}cite{outline:1px solid #64003c!important}dfn{outline:1px solid #b4005a!important}sub{outline:1px solid #dba0c8!important}sup{outline:1px solid #cc0256!important}time{outline:1px solid #d6606d!important}code{outline:1px solid #e04251!important}kbd{outline:1px solid #5e001f!important}samp{outline:1px solid #9c0033!important}var{outline:1px solid #d90047!important}mark{outline:1px solid #ff0053!important}bdi{outline:1px solid #bf3668!important}bdo{outline:1px solid #6f1400!important}ruby{outline:1px solid #ff7b93!important}rt{outline:1px solid #ff2f54!important}rp{outline:1px solid #803e49!important}span{outline:1px solid #cc2643!important}br{outline:1px solid #db687d!important}wbr{outline:1px solid #db175b!important}'


let stylesheet = document.createElement('style');
let cssNode = document.createTextNode(projcss);
stylesheet.appendChild(cssNode);
//
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);
const dom = document.body.innerText;

// console.log(document.body.textContent);

// const dom = parser.parseFromString(document.body.innerHTML, 'text/html');
// console.log(dom);
// console.log(dom.body.innerText);
// console.log('Hello World');

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

//Hidden PopUp Detector
const visibilityMap = new Map();

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

//Only check change when user is idle for atleast 1 second
// chrome.idle.queryState({detectionIntervalInSeconds:1}).then( (idleState) => {
//     console.log("idle")
//     processInPreorderAndCheckVisibility(Document.body);

// }).catch(console.log("error"))
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
function traverse(root,request){
  let text=request['text']
  let Dp=request['darkPattern']
  console.log(request)
  console.log(text,' ',Dp,"Travesing")
  if(!root||!text)return;
  root.childNodes.forEach((child)=>{
    traverse(child,request);
    if(child.innerText==text){
      child.style.backgroundColor = 'rgba(255,0,0,0.3)';
      child.appendChild(document.createTextNode('\n'+Dp));
      child.style.border = '5px solid black';
    }
  })
}
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
  if(request.type==='result'){
      console.log(request);
      traverse(document.body,request)
  }
  if (request.type === 'innerText') {
    const res = request.payload;
    console.log('innerText received');
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
