const exampleButton = document.querySelector("#example")
console.log('hello')
exampleButton.onClick =  function(){
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        const activeTabId = tabs[0].id;
        chrome.tabs.sendMessage(activeTabId, {"message": "This worked!"});
    });
};