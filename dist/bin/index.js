'use strict';

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _es = require('core-js/es6');

var _geocode = require('../geocode');

var _db = require('../db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var argv = require('yargs').command('geocode', 'Geocode the database').command('columnize', 'Add columns to database rows').demand(1).alias('i', 'input').alias('o', 'output').argv;

var input = argv.input || 'data/input.json';
var db;

try {
	db = require(process.cwd() + '/' + input);
} catch (ex) {
	console.error('Can not read input database file', input);
	process.exit();
}

/**
 * Geocoding helper methods
 */
function parseLocation(loc) {
	var regex = /^[^\(]+\(([^\)]+)\)$/;
	var matches = regex.exec(loc);

	if (matches !== null) {
		return matches[1];
	} else {
		return loc;
	}
}

function geocodeRows(rows) {
	var promises = [];

	(0, _underscore2.default)(rows).forEach(function (row) {
		var location = parseLocation(row.locations);

		promises.push((0, _geocode.geocode)(location).then(function (loc) {
			return Object.assign({}, row, { loc: loc });
		}).catch(function (ex) {
			console.error('Failed to retrieve geocode', ex);
			return row;
		}));
	});

	return _es.Promise.all(promises);
}

function geocodeDB(rows) {
	var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	var limit = arguments[2];

	var _rows = rows.slice(offset, limit || rows.length);

	return geocodeRows(_rows);
}

if (argv._[0] === 'geocode') {
	(function () {
		var output = argv.output || 'data/geocoded-db.json';
		var rows = db['data'];

		console.log('Geocoding database `', input, '` to `', output, '`');

		geocodeDB(rows).then(function (newDB) {
			db['data'] = newDB;

			var dbString = JSON.stringify(db, null, '\t');

			fs.writeFile(output, dbString, function (err) {
				if (err) {
					console.error('Failed to geocode database, with error', ex);
				} else {
					console.log('Succesfully geocoded database');
				}

				process.exit();
			});
		}).catch(function (ex) {
			console.error('failed geocoding', ex.toString());
			process.exit();
		});
	})();
}

if (argv._[0] === 'columnize') {
	var _output = argv.output || 'data/columnized-db.json';

	var rows = db['data'];
	var columns = db['meta']['view']['columns'];

	console.log('Columnize database `', input, '` to `', _output, '`');

	rows = (0, _underscore2.default)(rows).map(function (row) {
		var result = {};

		(0, _underscore2.default)(columns).forEach(function (_ref, index) {
			var col = _ref.fieldName;
			return result[col] = row[index];
		});

		return result;
	});

	db['data'] = rows;
	var dbString = JSON.stringify(db, null, '\t');

	fs.writeFile(_output, dbString, function (ex) {
		if (ex) {
			console.error('Failed to columnize database, with error', ex);
		} else {
			console.log('Succesfully columnized database');
		}
	});
}