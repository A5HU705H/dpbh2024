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
let cssStyle=`
  .replaced{
    display: inline-block;
    position: relative;
    background-color:rgba(255,0,0,0.1);
    width: 100%;
  }
  .replaced::before{
    content: '';
    position: absolute;
    height: 20px;
    top: -20px !important;
    left: 0;
    z-index: 1000;
    width: 92%;
    padding-left: 4%;
    padding-right: 4%;
  }
  .replaced:hover::before{
    content: attr(data-content) !important;
    background-color: rgba(255,255,255) !important;
    border-radius: 5px 5px 0 0!important;
  }
`
let stylesheet2=document.createElement('style');
let cssNode2=document.createTextNode(cssStyle);
stylesheet2.appendChild(cssNode2);
document.head.appendChild(stylesheet2);

const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);
const dom = document.body.innerText;


// Communicate with background file by sending a message
function getDirectInnerText(element) {
  // console.log(element);
  if(element.tagName.toLowerCase() === 'script')return;
  let childNodes = element.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    if(childNodes[i].nodeType == 3) {
      chrome.runtime.sendMessage(
        {
          type:'innerText',
          payload:{
            text:childNodes[i].data,
          }
        }
      )
    }
  }
  return ;
}
document.body.querySelectorAll('*').forEach(getDirectInnerText);

function updateBanner(event) {
  var id = event.target.id.toString() || '';
  var classList = event.target.classList.toString() || '';
  var node = event.target.nodeName.toLowerCase() || '';
  console.log({ id, classList, node });
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
        forcedActionText.textContent = ' Forced Action detected';
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

// Listen for message
let ReportingMode = false;
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
  if(request.type==='result'){
    document.body.querySelectorAll('*').forEach((element)=>{
      if(element.tagName.toLowerCase() === 'script')return;
      let childNodes = element.childNodes;
    
      for (let i = 0; i < childNodes.length; i++) {
        if(childNodes[i].nodeType == 3) {
          if(childNodes[i].data===request.text){
            let sp1=document.createElement('span');
            sp1.textContent = childNodes[i].data;
            sp1.setAttribute('data-content', request.darkPattern);
            sp1.style.color='rgba(255,0,0,0.5)'
            sp1.className="replaced";
            console.log(sp1);
            element.replaceChild(sp1,childNodes[i]);
          }
        }
      }
      return;
    });
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

