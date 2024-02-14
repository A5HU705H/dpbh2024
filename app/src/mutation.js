/* 
    Nagging Checks:
    a) elements that do not overlap with any other element apart from their parents or children are 
       probably not nagging
    b) elements that appear when the user triggers onclicked, keypress, hover events are probably not 
       nagging
    c) elements that appear when the user is idle or is scrolling
*/

// parse the dom tree, report any collisions between sibling nodes at each point
// if there are collisions then highlight both of them in red

// intersection observer will only track the visibility of existing elements
// mutation observer will track if new elements are inserted
// insertion of new elements will be tracked by document.body.

// onload return nodes that are added that have
// a) .checkVisibility() = true
// b) position : fixed returns true
// c) check if the user had done a keypress or onclick event soon
// note if their parent satisfies these conditions then do not log these

// function to monitor added Nodes (check if the child nodes are also logged)
// filter out the absolute nodes that are added and apply subsequent observers on them

// only log nodes that are added or removed
const config = { attributes: false, childList: true, subtree: true };
const visibilityMap = new Map();
var makeRed=false;
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
          if(window.getComputedStyle(root).position==='fixed' && makeRed){
            highlightElement(root);
          }

          // console.log(root);
            // console.log(wasVisible);
            // console.log(isVisible);
         //    console.log(root);
             console.log(window.getComputedStyle(root).position);
             console.log(makeRed);
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
//   console.log("handlechange triggered");
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
    //   console.log("handlechange triggered");
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
   observer.observe(document.body,config);
}