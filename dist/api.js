'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _geocode = require('./geocode');

var _db = require('./db');

var db = _interopRequireWildcard(_db);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_LIMIT = 20,
    DEFAULT_OFFSET = 0;

var api = (0, _express2.default)();

function nextUrlParams(db, offset, limit) {
	var length = db.length();

	if (length < offset + limit + limit) {
		var ds = length - offset + limit;

		if (ds > 0) {
			'offset=' + (offset + limit) + '&limit=' + ds;
		} else {
			return null;
		}
	} else {
		return 'limit=' + limit + '&offset=' + (limit + offset);
	}
}

function Paginator(req, db) {
	var limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT,
	    offset = parseInt(req.query.offset, 10) || DEFAULT_OFFSET;

	var next = nextUrlParams(db, offset, limit);

	return db.slice(offset, limit).then(function (rows) {
		return {
			"results": rows,
			"next": next ? req.path + '?' + next : null
		};
	});
}

api.get('/search', function (req, res) {
	var query = req.query.q;

	// Do not send all fields to client on search
	// to prevent excessive bandwith usage
	var fields = [':sid', 'title', 'locations', 'loc'];

	db.search(query).then(function (results) {
		return results.map(function (result) {
			var _ref;

			return (_ref = (0, _underscore2.default)(result)).pick.apply(_ref, fields);
		});
	}).then(function (results) {
		return res.json(results);
	});
});

api.get('/films', function (req, res) {
	Paginator(req, db).then(function (page) {
		return res.json(page);
	});
});

// configure app to use bodyParser()
// this will let us get the data from a POST
api.use(_bodyParser2.default.urlencoded({ extended: true }));
api.use(_bodyParser2.default.json());

exports.default = api;