import { checkStatus } from 'utils';

const CHANGE = 'sf-films/search/CHANGE';
const RECEIVE_RESULTS = 'sf-films/search/RECEIVE_RESULTS';
const REQUEST_RESULTS = 'sf-films/search/REQUEST_RESULTS';
const HIDE_RESULTS = 'sf-films/search/HIDE_RESULTS';

export default function reducer(state = {
	value: '',
	showResults: false,
	isFetching: false,
	results: [],
}, action) {
	switch (action.type) {
		case CHANGE:
			return {
				...state,
				value: action.value,
			};
		case RECEIVE_RESULTS:
			return {
				...state,
				isFetching: false,
				showResults: true,
				results: action.results,
			};
		case REQUEST_RESULTS:
			return {
				...state,
				isFetching: true,
			}
		case HIDE_RESULTS:
			return {
				...state,
				showResults: false,
			};
		default:
			return state;
	}
}

function _change(value) {
	return {
		type: CHANGE,
		value
	};
}

export function change(value) {
	return dispatch => {
		dispatch(_change(value));
		dispatch(fetchResults(value));
	}
}

export function requestResults() {
	return {
		type: REQUEST_RESULTS
	};
}

export function receiveResults(results) {
	return {
		type: RECEIVE_RESULTS,
		results
	};
}

export function hideResults() {
	return {
		type: HIDE_RESULTS
	};
}

export function fetchResults(query) {
	let url = `/api/v1.0/search?q=${encodeURIComponent(query)}`;

	return dispatch => {
		fetch(url)
			.then(checkStatus)
			.then(res => res.json())
			.then((results = []) => dispatch(receiveResults(results)));
	}
}