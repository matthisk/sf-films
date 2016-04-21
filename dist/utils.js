'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.memoize = memoize;
exports.Scheduler = Scheduler;
exports.limit = limit;

var _es = require('core-js/es6');

function memoize(fn) {
	var cache = {};

	return function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (cache.hasOwnProperty(args)) {
			return cache[args];
		} else {
			var result = fn.apply(undefined, args);
			cache[args] = result;

			return result;
		}
	};
}

function Scheduler() {
	var maxPerInterval = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];
	var interval = arguments.length <= 1 || arguments[1] === undefined ? 1000 : arguments[1];

	this.interval = interval;
	this.maxPerInterval = maxPerInterval;
	this.tasks = [];
}

Scheduler.prototype.start = function () {
	if (this._timer) {
		throw new Error('The scheduler is already running, please do not restart it');
	}

	var interval = this.interval / this.maxPerInterval;

	this._timer = setInterval(this.consume.bind(this), interval);
};

Scheduler.prototype.stop = function () {
	clearInterval(this._timer);

	delete this._timer;
};

Scheduler.prototype.schedule = function (task, args) {
	var _this = this;

	return new _es.Promise(function (resolve, reject) {
		_this.tasks.push({ task: task, args: args, resolve: resolve, reject: reject });
	});
};

Scheduler.prototype.consume = function () {
	var _ref = this.tasks.pop() || {};

	var task = _ref.task;
	var args = _ref.args;
	var resolve = _ref.resolve;
	var reject = _ref.reject;


	if (task) {
		try {
			var result = task.apply(null, args);

			// When the result is another promise we should
			// call resolve and reject when this promise is
			// respectively resolved or rejected
			if (result instanceof _es.Promise) {
				result.then(resolve, reject);
			} else {
				resolve(result);
			}
		} catch (ex) {
			reject(ex);
		}
	}
};

function limit(fn) {
	var maxPerInterval = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
	var interval = arguments.length <= 2 || arguments[2] === undefined ? 1000 : arguments[2];

	var scheduler = new Scheduler(maxPerInterval, interval);
	var initCall = true;

	return function () {
		if (initCall) {
			scheduler.start();
			initCall = false;
		}

		return scheduler.schedule(fn, arguments);
	};
}