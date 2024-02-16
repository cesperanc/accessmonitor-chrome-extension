/**
 * This source code is licensed under the GPLv3 license.
 * 
 * Copyright (c) 2024 Norberto Sousa e Cláudio Esperança <cesperanc@gmail.com>
 */
chrome.action.onClicked.addListener((tab) => {
	chrome.tabs.create({
		url:
			"https://accessmonitor.acessibilidade.gov.pt/results/" +
			encodeURIComponent(tab.url),
	});
});
