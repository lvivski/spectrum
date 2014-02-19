var xhr = new XMLHttpRequest()
xhr.open('GET', chrome.extension.getURL('img/filters.svg'))
xhr.addEventListener('load', function(e) {
  var filter = xhr.responseXML.documentElement
  filter.style.display = 'none'
  filter.width = 0
  filter.height = 0
  document.body.appendChild(filter)
})
xhr.send()
