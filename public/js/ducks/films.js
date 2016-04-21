const REQUEST_FILMS = 'sf-films/ducks/REQUEST_FILMS';
const RECEIVE_FILMS = 'sf-films/ducks/RECEIVE_FILMS';

function intoObject(items, prop) {
	var results = {};
	items.forEach(item => results[item[prop]] = item);
	return results;
}

export default function reducer(state = {}, action) {
	switch (action.type) {
		case REQUEST_FILMS:
			return state;
		case RECEIVE_FILMS:
			return Object.assign({}, state, intoObject(action.films, ':id'));
		default:
			return state;
	}
}

export function requestFilms() {
	return {
		type: REQUEST_FILMS
	};
}

export function receiveFilms(films) {
	return {
		type: RECEIVE_FILMS,
		films
	};
}

export function fetchFilms(offset = 0, limit = 1000) {
	let url = `/api/v1.0/films?offset=${offset}&limit=${limit}`;

	return dispatch => {
		dispatch(requestFilms());

		fetch(url)
			.then(res => res.json())
			.then(json => dispatch(receiveFilms(json.results)));
	};
}