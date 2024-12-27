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
  "blurred-vision": "",
};

Object.keys(vision).forEach((type) => {
  const li = document.createElement("li");
  li.dataset.type = type;
  li.textContent = type.replace(/-/g, " ");
  li.addEventListener("click", handler, false);
  ul.appendChild(li);
});

document.body.appendChild(ul);

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tabId = tabs[0].id;
  chrome.tabs.sendMessage(tabId, { type: "restoreFilter" }, (filter) => {
    update(filter);
  });
});

function update(type) {
  $.all("li").forEach((li) => {
    if (li.dataset.type === type) {
      li.classList.add("current");
    } else {
      li.classList.remove("current");
    }
  });
}

function handler(e) {
  const filter = this.dataset.type;
  update(filter);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, { type: "applyFilter", filter }, () => {
      let filterString = `url(#${filter})`;
      if (filter !== "normal" && !filter.includes("-")) {
        filterString = `url(#gamma-before) ${filterString} url(#gamma-after)`;
      }
      chrome.scripting.insertCSS({
        target: { tabId },
        css: `:root { filter: ${filterString}; }`,
      });
    });
  });
}
