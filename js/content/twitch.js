'use strict';

/**
 * Prevent links from being clicked in twitch chat
 */
$.delegate(window, 'click', '.chat-line > .message > a', function onLinkClick(e) {
	e.preventDefault();
});

chrome.runtime.onMessage.addListener(function (action, sender) {
	switch (action.type) {
		case 'UPDATE_URL':
			return;
	}
});