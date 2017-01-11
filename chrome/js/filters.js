var filter = null;
var xhr = new XMLHttpRequest()
xhr.open('GET', chrome.extension.getURL('img/filters.svg'))
xhr.addEventListener('load', function(e) {
  filter = xhr.responseXML.documentElement
  filter.style.display = 'none'
  filter.width = 0
  filter.height = 0
})
xhr.send()

function applyFilter(){
    document.body.appendChild(filter);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendReponse){
    if (request.method=="load"){
      applyFilter();
      sendResponse(true);
    }
  }
)