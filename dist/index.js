'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use('/static', _express2.default.static(__dirname + '/public'));

app.get('/', function (req, res) {
	var options = {};

	return res.sendFile(__dirname + '/public/index.html', options, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
	});
});

app.use('/api/v1.0', _api2.default);
app.listen(8000);