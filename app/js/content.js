console.log(document.body.innerText)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // changed comment
  console.log(request.message)
});