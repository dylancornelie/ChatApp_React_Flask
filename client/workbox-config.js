module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{js,json,png,svg,ico,jpg,html,txt,css}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'build/sw.js'
};