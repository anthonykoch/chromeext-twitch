"use strict";

{
	/**
	 * Track URL changes
	 * @type {Object}
	 */
	const urls = {};

	/**
	 * Since we can't detect a URL change, we have to listen to chrome's
	 * onUpdated event for tabs and send
	 */
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
		if (urls[tabId] !== tab.url) {
			chrome.tabs.sendMessage(tabId, {
				type: 'UPDATE_URL',
				data: {
					url: tab.url
				}
			});
			urls[tabId] = tab.url;
		}
	});
}

{
	/**
	 * Tabs that match the urls will be muted when navigated to.
	 * @type {Object}
	 */
	const blacklistedURLs = {
		mute:
		[
			{
				url: 'https://www.twitch.tv/',
				rules: {
					hostname: true,
					pathname: true
				}
			},
			{
				url: 'https://www.twitch.tv/directory/game/Creative',
				rules: {
					beginsWith: {
						pathname: 'directory/game/Creative'
					}
				}
			}
		]
	};

	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if (tab.status !== 'complete' || tab.mutedInfo.reason === 'user') {
			return;
		}

		// Mute blacklisted URLs when they load
		blacklistedURLs.mute.forEach(function ({ url, rules }) {
			let muted;

			if (isSameURL(tab.url, url, rules)) {
				muted = true;
			} else {
				if (tab.mutedInfo.reason !== 'user') {
					muted = false;
				}
			}

			chrome.tabs.update(tabId, { muted });
		});
	});
}