'use strict';

if ( ! Element.prototype.matches) {
	const ElementPrototype = Element.prototype;

	/**
	 * Is not extremely fast, so use with caution
	 * @param  {String}  selector
	 * @return {Boolean}
	 */
	const matchesPolyfill = function matches(selector) {
		const elements = document.querySelectorAll(selector);
		const length = elements.length;
		let i = 0;

		for (; i < length; i++) {
			if (elements[i] === this) {
				return true;
			}
		}

		return false;
	};

	Element.prototype.matches = (
		ElementPrototype.matchesSelector ||
		ElementPrototype.mozMatchesSelector ||
		ElementPrototype.msMatchesSelector ||
		ElementPrototype.oMatchesSelector ||
		ElementPrototype.webkitMatchesSelector ||
		matchesPolyfill
	);
}

/**
 * Returns true if the host and the pathname are the same for both urls.
 * The sameBy object May be any portion of URL object. Other possible properties of samyBy are:
 * 		begins: Returns true if the url begins with the comparator's url, ignores the other properties passed
 * @param  {URL}     url
 * @param  {Object}  comparator - The url to compare against
 * @param  {Object}  rules      - Tells what to compare the URLs by.
 * @return {Boolean}
 */
function isSameURL(url, comparator, rules) {
	const actual        = new URL(url);
	const comparatorURL = new URL(comparator);

	if (rules.begins) {
		if (rules.ignoreProtocol) {
			return (
				(new RegExp('^' + rules.url)).test(url)
			);
		}

		return (new RegExp('^' + rules.url)).test(url);
	}

	// Compares the URLs by the attribute properties of a URL object
	return Object.keys(rules)
		.map(function (attribute) {
			return actual[attribute] === comparatorURL[attribute];
		})
		.concat(
			Object.keys(Object(rules.beginsWith))
				.map(function (attribute) {
					return (new RegExp('^\\/' + rules.beginsWith[attribute])).test(actual[attribute]);
				})
			)
		.every(bool => bool);
}

/**
 * Returns a partially applied function that will return the result
 * of isSameURL(url, comparator, rules).
 *
 * @example
 *   const isTwitchURL = isURL({ host: true }, 'https://www.twitch.tv/');
 *   console.log(isTwitchURL('https://www.twitch.tv/')); // true
 *
 * @param  {Object}  rules      - The rules to compare the URL, see isSameURL
 * @param  {String}  comparator - The URL to compare to
 * @return {Function}
 */
function isURL(rules, comparator) {
	return function (url, c) {
		c = (typeof comparator === 'string') ? comparator : c;
		return isSameURL(url, c, rules);
	};
};