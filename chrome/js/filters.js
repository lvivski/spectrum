var xhr = new XMLHttpRequest()
xhr.open('GET', chrome.extension.getURL("img/filters.svg"))
xhr.addEventListener('load', function(e) {
  document.body.appendChild(xhr.responseXML.documentElement)
})
xhr.send()