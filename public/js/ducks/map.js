const CENTER = 'films-sf/ducks/CENTER';

export default function reducer(state = {
	center: { "lat" : 37.7749295, "lng" : -122.4194155 },
	zoom: 11
}, action) {
	switch (action.type) {
		case CENTER:
			return Object.assign({}, state, { center: action.loc, zoom: 15 });
		default:
			return state;
	}
}

export function moveCenter(loc) {
	return {
		type: CENTER,
		loc: loc
	};
}