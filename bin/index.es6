var fs = require('fs');
var argv = require('yargs')
					.command('geocode', 'Geocode the database')
					.command('columnize', 'Add columns to database rows')
					.demand(1)
					.alias('i', 'input')
					.alias('o', 'output')
					.argv;

import _ from 'underscore';
import { Promise } from 'core-js/es6';
import { geocode } from '../geocode';
import { columnize } from '../db';

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

	_(rows).forEach(row => {
		let location = parseLocation(row.locations);
		
		promises.push(
			geocode(location)
				.then(loc => Object.assign({}, row, { loc }))
				.catch(ex => {
					console.error('Failed to retrieve geocode', ex);
					return row;
				})
		);
	});

	return Promise.all(promises);
}

function geocodeDB(rows, offset = 0, limit) {
	var _rows = rows.slice(offset, limit || rows.length);

	return geocodeRows(_rows);
}


if (argv._[0] === 'geocode') {
	let output = argv.output || 'data/geocoded-db.json';
	let rows = db['data'];

	console.log('Geocoding database `', input, '` to `', output, '`');

	geocodeDB( rows )
		.then(function(newDB) {
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
		})
		.catch(function (ex) {
			console.error('failed geocoding', ex.toString());
			process.exit();
		})
}

if (argv._[0] === 'columnize') {
	let output = argv.output || 'data/columnized-db.json';

	var rows = db['data'];
	var columns = db['meta']['view']['columns'];

	console.log('Columnize database `', input, '` to `', output, '`');

	rows = _(rows).map(row => {
		let result = {};

		_(columns).forEach(({ fieldName: col }, index) => result[col] = row[index]);

		return result;
	});

	db['data'] = rows;
	var dbString = JSON.stringify(db, null, '\t');

	fs.writeFile(output, dbString, function (ex) {
		if (ex) {
			console.error('Failed to columnize database, with error', ex);
		} else {
			console.log('Succesfully columnized database');
		}
	});
}
