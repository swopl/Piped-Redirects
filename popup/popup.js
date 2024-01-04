"use strict";

let redirectHostDOM = document.getElementById("redirectHost");

window.browser = window.browser || window.chrome;

browser.storage.sync.get(["redirectHost"]).then((result) => {
	redirectHostDOM.setAttribute("value", result.redirectHost);
});

browser.storage.onChanged.addListener((changes) => {
	if (changes?.redirectHost?.newValue) {
		redirectHostDOM.setAttribute("value", changes.redirectHost.newValue);
	}
});

redirectHostDOM.addEventListener("blur", (event) => {
	browser.storage.sync.set({ redirectHost: event.target.value });
});
