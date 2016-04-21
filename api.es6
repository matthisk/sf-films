import express from 'express';
import bodyParser from 'body-parser';
import _ from 'underscore';

import { geocode } from './geocode';
import * as db from './db';

const DEFAULT_LIMIT = 20
    , DEFAULT_OFFSET = 0;

var api = express();

function nextUrlParams(db, offset, limit) {
	let length = db.length();

	if (length < offset+limit+limit) {
		let ds = length - offset+limit;
		
		if (ds > 0) {
			`offset=${offset+limit}&limit=${ds}`;
		} else {
			return null;
		}
	} else {
		return `limit=${limit}&offset=${limit+offset}`;
	}
}

function Paginator(req, db) {
	var limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT,
		offset = parseInt(req.query.offset, 10) || DEFAULT_OFFSET;

	let next = nextUrlParams(db, offset, limit);

	return db.slice(offset, limit)
		.then(rows => ({
			"results": rows,
			"next": next ? `${req.path}?${next}`: null,
		}));
}

api.get('/search', function(req, res) {
	var query = req.query.q;

	// Do not send all fields to client on search
	// to prevent excessive bandwith usage
	var fields = [':sid', 'title', 'locations', 'loc'];

	db.search(query)
		.then(results => results.map(result => _(result).pick(...fields)))
		.then(results => res.json(results));
});

api.get('/films', function(req, res) {
	Paginator(req, db)
		.then(page => res.json(page));
});

// configure app to use bodyParser()
// this will let us get the data from a POST
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

export default api;

