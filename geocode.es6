import fetch from 'node-fetch';

import { memoize, limit } from './utils';

const GAPPS_KEY = process.env['GAPPS_KEY'];
const GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

function _geocode(address) {
	return fetch(`${GEOCODING_URL}?address=${encodeURIComponent(address)}&key=${GAPPS_KEY}&components=administrative_area:CA|country:US`)
		.catch(function(ex) {
			console.error('Fetch http exception', ex);
			console.error('Are you being rate limitted?');
			return {};
		})
		.then(res => res.json())
		.then(json => {
			if (json.results.length === 0) {
				console.error('Failed geocode with status', json.status, 'for address', address);
				return {};
			}

			let result = json.results[0];
			console.log('Geocoded address', address, 'with', result.geometry.location);

			return result.geometry.location;
		});
}

// We only schedule 10 requests per second
// (because gMaps API does not allow more)
export let geocode = memoize( limit(_geocode, 10) );