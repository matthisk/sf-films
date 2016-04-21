import _ from 'underscore';
import { Promise } from 'core-js/es6';

// Load the JSON database in memory
var RAW = require('../data/db.json');
var db = RAW['data'];

/** Availabel Column Names */
// :sid
// :id
// :position
// :created_at
// :created_meta
// :updated_at
// :updated_meta
// :meta
// title
// release_year
// locations
// fun_facts
// production_company
// distributor
// director
// writer
// actor_1
// actor_2
// actor_3
// smile_again_jenny_lee

export function getColumn(row, name) {
	return row[name] || '';
}

export function search(query, columns = ['locations', 'title']) {
	if (! _.isArray(columns)) columns = [columns];

	query = query.toLowerCase();

	let results = _(db)
		.filter(function (row) {
			return _.some(columns, col => getColumn(row, col).toLowerCase().startsWith(query));
		});

	return Promise.resolve(results);
}

export function slice(offset, limit) {
	return Promise.resolve(db.slice(offset, offset+limit));
}

export function length() {
	return db.length;
}