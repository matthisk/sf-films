import { combineReducers } from 'redux';

import searchReducer from 'ducks/search';
import filmsReducer from 'ducks/films';
import mapReducer from 'ducks/map';

export default combineReducers({
	search: searchReducer,
	films: filmsReducer,
	map: mapReducer,
});