function $(selector, context) {
  return (context || document).querySelector(selector)
}
 
$.all = function (selector, context) {
  return Array.prototype.slice.call(
    (context || document).querySelectorAll(selector)
  )
}

var ul = document.createElement('ul')
  , current = 'normal'

!['normal'
, 'protanopia'
, 'deuteranopia'
, 'tritanopia'
, 'achromatopsia'
, 'protanomaly'
, 'deuteranomaly'
, 'tritanomaly'
, 'achromatomaly'
].forEach(function (el) {
  var li = document.createElement('li')
  li.dataset['type'] = el
  li.textContent = el[0].toUpperCase() + el.slice(1)
  li.addEventListener('click', handler, false)
  el == current && li.classList.add('current')
  ul.appendChild(li);
})

document.body.appendChild(ul)

function handler(e) {
  current = this.dataset['type']
  $.all('li').forEach(function(li) {
    li.classList.remove('current')
  })
  this.classList.add('current')
  chrome.tabs.insertCSS(null, { code: 'body {-webkit-filter: url(#' + current + ');' })
}


