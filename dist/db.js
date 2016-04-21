'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getColumn = getColumn;
exports.search = search;
exports.slice = slice;
exports.length = length;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _es = require('core-js/es6');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function getColumn(row, name) {
	return row[name] || '';
}

function search(query) {
	var columns = arguments.length <= 1 || arguments[1] === undefined ? ['locations', 'title'] : arguments[1];

	if (!_underscore2.default.isArray(columns)) columns = [columns];

	query = query.toLowerCase();

	var results = (0, _underscore2.default)(db).filter(function (row) {
		return _underscore2.default.some(columns, function (col) {
			return getColumn(row, col).toLowerCase().startsWith(query);
		});
	});

	return _es.Promise.resolve(results);
}

function slice(offset, limit) {
	return _es.Promise.resolve(db.slice(offset, offset + limit));
}

function length() {
	return db.length;
}