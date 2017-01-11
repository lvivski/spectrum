let filter = null
const xhr = new XMLHttpRequest()
xhr.open('GET', chrome.extension.getURL('img/filters.svg'))
xhr.addEventListener('load', (e) => {
  filter = xhr.responseXML.documentElement
  filter.style.display = 'none'
  filter.width = 0
  filter.height = 0
})
xhr.send()

sessionStorage.removeItem('spectrumFilter');

chrome.runtime.onMessage.addListener((message, sender, sendReponse) => {
	if (message.type === 'getFilter') {
		sendReponse(sessionStorage.getItem('spectrumFilter'))
	} else if (message.type === 'applyFilter') {
		sessionStorage.setItem('spectrumFilter', message.filter);
		if (message.filter !== 'normal' && filter.parentNode !== document.body) {
			document.body.appendChild(filter)
		} else if (message.filter === 'normal') {
			filter.parentNode.removeChild(filter)
		}
		sendReponse()
	}
})
