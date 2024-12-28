const $ = (/** @type {string} */ selector, context = document) =>
  context.querySelector(selector);
const $$ = (/** @type {string} */ selector, context = document) =>
  Array.from(context.querySelectorAll(selector));

/*
FYI http://en.wikipedia.org/wiki/Color_blindness
further reading:
http://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
http://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_PCA/CVD_PCA.html
http://vision.psychol.cam.ac.uk/jdmollon/papers/Dichromatsimulation.pdf
http://vision.psychol.cam.ac.uk/jdmollon/papers/colourmaps.pdf
http://scien.stanford.edu/class/psych221/projects/05/ofidaner/project_report.pdf
http://scien.stanford.edu/pages/labsite/2005/psych221/projects/05/ofidaner/conv_img.m
Note: use `web.archive.org` for old links
*/
const filters = {
  normal: `<filter id="normal">
			<feColorMatrix values="1 0 0 0 0
				0 1 0 0 0
				0 0 1 0 0
				0 0 0 1 0" />
		</filter>`,
  protanopia: `<filter id="protanopia" color-interpolation-filters="linearRGB">
			<feColorMatrix
				values="0.152286 1.052583 -0.204868 0 0
				0.114503 0.786281 0.099216 0 0
				-0.003882 -0.048116 1.051998 0 0
				0 0 0 1 0" />
		</filter>`,
  protanomaly: `<filter id="protanomaly" color-interpolation-filters="linearRGB">
			<feColorMatrix
				values="0.458064 0.679578 -0.137642 0 0
				0.092785 0.846313 0.060902 0 0
				-0.007494 -0.016807 1.024301 0 0
				0 0 0 1 0" />
		</filter>`,
  deuteranopia: `<filter id="deuteranopia" color-interpolation-filters="linearRGB">
			<feColorMatrix
				values="0.367322 0.860646 -0.227968 0 0
				0.280085 0.672501 0.047413 0 0
				-0.011820 0.042940 0.968881 0 0
				0 0 0 1 0" />
		</filter>`,
  deuteranomaly: `<filter id="deuteranomaly" color-interpolation-filters="linearRGB">
			<feColorMatrix
				values="0.547494 0.607765 -0.155259 0 0
				0.181692 0.781742 0.036566 0 0
				-0.010410 0.027275 0.983136 0 0
				0 0 0 1 0" />
		</filter>`,
  tritanopia: `<filter id="tritanopia" color-interpolation-filters="linearRGB">
			<feColorMatrix
				values="1.255528 -0.076749 -0.178779 0 0
				-0.078411 0.930809 0.147602 0 0
				0.004733 0.691367 0.303900 0 0
				0 0 0 1 0" />
		</filter>`,
  tritanomaly: `<filter id="tritanomaly" color-interpolation-filters="linearRGB">
			<feColorMatrix
				values="1.017277 0.027029 -0.044306 0 0
				-0.006113 0.958479 0.047634 0 0
				0.006379 0.248708 0.744913 0 0
				0 0 0 1 0" />
		</filter>`,
  achromatopsia: `<filter id="achromatopsia" color-interpolation-filters="linearRGB">
			<feColorMatrix
				values="0.212656 0.715158 0.072186 0 0
				0.212656 0.715158 0.072186 0 0
				0.212656 0.715158 0.072186 0 0
				0 0 0 1 0" />
			<feColorMatrix type="saturate" values="0" />
		</filter>`,
  achromatomaly: `<filter id="achromatomaly">
			<feColorMatrix type="saturate" values="0.5" />
		</filter>`,
  "low-contrast": `<filter id="low-contrast">
			<feComponentTransfer>
				<!-- slope = [amount] intercept = (1 - [amount] / 2) -->
				<feFuncR type="linear" slope=".5" intercept=".25" />
				<feFuncG type="linear" slope=".5" intercept=".25" />
				<feFuncB type="linear" slope=".5" intercept=".25" />
			</feComponentTransfer>
		</filter>`,
  blurred: `<filter id="blurred">
			<feGaussianBlur stdDeviation="3 2" />
		</filter>`,
};

const ul = document.createElement("ul");
Object.keys(filters).forEach((type) => {
  const li = document.createElement("li");
  li.dataset.type = type;
  li.textContent = type.replace(/-/g, " ");
  li.addEventListener("click", handler, false);
  ul.appendChild(li);
});
document.body.appendChild(ul);

chrome.tabs.query({ active: true, currentWindow: true }, ([{ id: tabId }]) => {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      func: () => sessionStorage.getItem("spectrumFilter"),
    },
    ([{ result }]) => {
      update(result);
    }
  );
});

function update(/** @type {keyof filters} */ type) {
  $$("li").forEach((/** @type {HTMLLIElement}*/ li) => {
    if (li.dataset.type === type) {
      li.classList.add("current");
    } else {
      li.classList.remove("current");
    }
  });
}

function handler(e) {
  const filter = /** @type {keyof filters} */ (this.dataset.type);
  update(filter);
  chrome.tabs.query(
    { active: true, currentWindow: true },
    ([{ id: tabId }]) => {
      chrome.scripting.executeScript({
        target: { tabId },
        func: (filter) => {
          sessionStorage.setItem("spectrumFilter", filter);
        },
        args: [filter],
      });
      chrome.scripting.insertCSS({
        target: { tabId },
        css: `:root { filter: url('${createDataURI(filter)}') }`,
      });
    }
  );
}

function createDataURI(/** @type {keyof filters} */ filter) {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg">${filters[
    filter
  ].replace(/\n\s+/g, " ")}</svg>#${filter}`;
}
