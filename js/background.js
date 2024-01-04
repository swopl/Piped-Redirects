window.browser = window.browser || window.chrome;

const INVIDIOUS_INSTANCES = [];

fetch("https://api.invidious.io/instances.json")
	.then((resp) => resp.json())
	.then((array) => array.forEach((json) => INVIDIOUS_INSTANCES.push(json[0])));

const redirectHostDefault = "piped.video";
let redirectHost = redirectHostDefault;

browser.storage.sync.get(["redirectHost"], (result) => {
	redirectHost = result.redirectHost || redirectHostDefault;
	if (!result.redirectHost) {
		browser.storage.sync.set({ redirectHost });
	}
});

browser.storage.onChanged.addListener((changes) => {
	redirectHost = changes?.redirectHost?.newValue || redirectHostDefault;
	if (!changes.redirectHost.newValue) {
		browser.storage.sync.set({ redirectHost: redirectHostDefault });
	}
});

browser.webRequest.onBeforeRequest.addListener(
	(details) => {
		const url = new URL(details.url);
		if (url.hostname.endsWith("youtu.be") && url.pathname.length > 1) {
			return { redirectUrl: `https://${redirectHost}/watch?v=${url.pathname.substr(1)}` };
		}
		if (
			url.hostname.endsWith("youtube.com") ||
			url.hostname.endsWith("youtube-nocookie.com") ||
			INVIDIOUS_INSTANCES.includes(url.hostname)
		) {
			url.hostname = redirectHost;
			return { redirectUrl: url.href };
		}
	},
	{
		urls: ["<all_urls>"],
	},
	["blocking"],
);
