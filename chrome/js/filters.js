let svg = null;
const xhr = new XMLHttpRequest();
xhr.open("GET", chrome.runtime.getURL("img/filters.svg"));
xhr.addEventListener("load", (e) => {
  svg = xhr.responseXML.documentElement;
  svg.style.display = "none";
  svg.width = 0;
  svg.height = 0;
});
xhr.send();

sessionStorage.removeItem("spectrumFilter");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let filter = "normal";
  if (message.type === "restoreFilter") {
    filter = sessionStorage.getItem("spectrumFilter");
  } else if (message.type === "applyFilter") {
    filter = message.filter;
    sessionStorage.setItem("spectrumFilter", message.filter);
    if (filter !== "normal" && svg.parentNode !== document.body) {
      document.body.appendChild(svg);
    } else if (filter === "normal") {
      svg.parentNode?.removeChild(svg);
    }
  }
  sendResponse(filter);
});
