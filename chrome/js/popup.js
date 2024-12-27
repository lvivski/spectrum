const $ = (selector, context) => (context || document).querySelector(selector);

$.all = (selector, context) =>
  Array.prototype.slice.call((context || document).querySelectorAll(selector));

const ul = document.createElement("ul");
const vision = {
  normal: "",
  protanopia: "1%",
  protanomaly: "1%",
  deuteranopia: "1%",
  deuteranomaly: "6%",
  tritanopia: "0.1%",
  tritanomaly: "0.01%",
  achromatopsia: "0.00001%",
  achromatomaly: "0.00001%",
  "low-contrast": "",
};
Object.keys(vision).forEach((type) => {
  const li = document.createElement("li");
  li.dataset.type = type;
  li.textContent = type;
  li.addEventListener("click", handler, false);
  ul.appendChild(li);
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tabId = tabs[0].id;
  chrome.scripting.executeScript(
    {
      target: { tabId },
      function: restoreFilter,
    },
    (results) => {
      const filter = results[0].result;
      update(filter);
    }
  );
});

document.body.appendChild(ul);

function update(type) {
  $.all("li").forEach((li) => {
    if (li.dataset.type === type) {
      li.classList.add("current");
    } else {
      li.classList.remove("current");
    }
  });
}

function restoreFilter() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "restoreFilter" }, (response) => {
      resolve(response.filter);
    });
  });
}

function handler(e) {
  const filter = this.dataset.type;
  update(filter);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, { type: "applyFilter", filter }, () => {
      chrome.scripting.insertCSS({
        target: { tabId },
        css: `body { filter: url(#${filter}); }`,
      });
    });
  });
}
