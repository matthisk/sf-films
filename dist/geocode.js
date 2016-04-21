'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.geocode = undefined;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GAPPS_KEY = 'AIzaSyDaWeJnjddEw0VFDCnxUtdoQ-_NXC0f5cQ';
var GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

function _geocode(address) {
	return (0, _nodeFetch2.default)(GEOCODING_URL + '?address=' + encodeURIComponent(address) + '&key=' + GAPPS_KEY + '&components=administrative_area:CA|country:US').catch(function (ex) {
		console.error('Fetch http exception', ex);
		console.error('Are you being rate limitted?');
		return {};
	}).then(function (res) {
		return res.json();
	}).then(function (json) {
		if (json.results.length === 0) {
			console.error('Failed geocode with status', json.status, 'for address', address);
			return {};
		}

		var result = json.results[0];
		console.log('Geocoded address', address, 'with', result.geometry.location);

		return result.geometry.location;
	});
}

// We only schedule 10 requests per second
// (because gMaps API does not allow more)
var geocode = exports.geocode = (0, _utils.memoize)((0, _utils.limit)(_geocode, 10));