import express from 'express';
import api from './api';

var app = express();

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	let options = {};

	return res.sendFile(__dirname + '/public/index.html', options, function (err) {
	    if (err) {
	      console.log(err);
	      res.status(err.status).end();
	    }
  	});	
});

app.use('/api/v1.0', api);
app.listen(8000);