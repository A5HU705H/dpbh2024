
const config = { attributes: false, childList: true, subtree: true };
const visibilityMap = new Map();
var makeRed=true;
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
  var count=0;
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
          if(window.getComputedStyle(root).position==='fixed' && makeRed && !root.classList.contains("injectedModal")){
            highlightElement(root);
          }

            if(window.getComputedStyle(root).position==='fixed'){
             console.log(root);
             console.log(makeRed);
            }

            var event=new CustomEvent("nagging",{"element":root});
            document.dispatchEvent(event);
            // console.log(root, 'visibility changed to visible');
            count++;
            visibilityMap.set(root, isVisible);// If visibility has changed, do not check its children
            // updateStates(root);

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
    // makeRed=true;

}

function handleChange(event) {
  console.log("handlechange triggered");
  // console.log(event.target);
  makeRed=false;
  console.log("red made false");
  first=true;
  setTimeout(()=>{
    
    // processClick(document.body);
    console.log("red made true");
    makeRed=true;
    first=false;
  },1000);
  
  }
  function handleChangeLoad(event) {
      console.log("handlechangeLoad triggered");
      // console.log(event.target);
      makeRed=false;
      console.log("red made false");
      first=true;
      setTimeout(()=>{
        
        // processClick(document.body);
        console.log("red made true");
        makeRed=true;
        first=false;
      },4000);
      
      }

document.addEventListener('click', handleChange);
document.addEventListener("keydown", handleChange);
document.addEventListener('resize',handleChange);
document.addEventListener('blur', handleChange);
window.addEventListener("load", handleChangeLoad);
window.addEventListener('popstate', handleChangeLoad);


// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    console.log("callback fired");
    processInPreorderAndCheckVisibility(document.body);
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
window.onload = () => {
   console.log('page loaded');
   handleChangeLoad();
   observer.observe(document.body,config);
}