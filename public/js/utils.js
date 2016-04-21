import 'whatwg-fetch';

export function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else { 
		throw new Error(response.statusText, response);
	}
}