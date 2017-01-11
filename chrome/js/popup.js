function $(selector, context) {
  return (context || document).querySelector(selector)
}
 
$.all = function (selector, context) {
  return Array.prototype.slice.call(
    (context || document).querySelectorAll(selector)
  )
}

var ul = document.createElement('ul'),
    current = 'normal',
    vision = {
      normal: '',
      protanopia: '1%',
      protanomaly: '1%',
      deuteranopia: '1%',
      deuteranomaly: '6%',
      tritanopia: '0.1%',
      tritanomaly: '0.01%',
      achromatopsia: '0.00001%',
      achromatomaly: '0.00001%',
      'low-contrast': ''
    }

Object.keys(vision).forEach(function (el) {
  var li = document.createElement('li')
  li.dataset['type'] = el
  li.textContent = el
  li.addEventListener('click', handler, false)
  el == current && li.classList.add('current')
  ul.appendChild(li)
})

document.body.appendChild(ul)

var filterLoaded = false;
function handler(e) {
  if (!filterLoaded){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {method:"load"}, function(response){
        filterLoaded = response;
      });
    });
  }
  current = this.dataset['type']
  $.all('li').forEach(function(li) {
    li.classList.remove('current')
  })
  this.classList.add('current')
  chrome.tabs.insertCSS(null, { code: 'html { -webkit-filter: url(#' + current + '); }' })
}
