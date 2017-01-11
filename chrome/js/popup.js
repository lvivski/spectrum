function $(selector, context) {
  return (context || document).querySelector(selector)
}

$.all = function (selector, context) {
  return Array.prototype.slice.call(
    (context || document).querySelectorAll(selector)
  )
}

const ul = document.createElement('ul')
const vision = {
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
Object.keys(vision).forEach((type) => {
	const li = document.createElement('li')
  li.dataset.type = type
  li.textContent = type
	li.addEventListener('click', handler, false)
  ul.appendChild(li)
})

update('normal')
chrome.tabs.query({ active:true, currentWindow:true }, (tabs) => {
	chrome.tabs.sendMessage(tabs[0].id, { type: 'getFilter' }, (response) => {
		update(response || 'normal')
	})
})

document.body.appendChild(ul)

function update(type) {
	$.all('li').forEach(li => {
		if (li.dataset.type === type) {
			li.classList.add('current')
		} else {
			li.classList.remove('current')
		}
	})
}

function handler(e) {
	const type = this.dataset.type
	update(type)
  chrome.tabs.query({ active:true, currentWindow:true }, (tabs) => {
		const tab = tabs[0].id;
		chrome.tabs.sendMessage(tab, { type: 'applyFilter', filter: type }, (message) => {
			chrome.tabs.insertCSS(tab, { code: `html { -webkit-filter: url(#${type}); }` })
		})
	})
}
