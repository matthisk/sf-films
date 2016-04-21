import { Promise } from 'core-js/es6';

export function memoize(fn) {
	let cache = {};

	return function(...args) {
		if (cache.hasOwnProperty(args)) {
			return cache[args];
		} else {
			let result = fn(...args);
			cache[args] = result;

			return result;
		}
	}
}

export function Scheduler(maxPerInterval = 100, interval = 1000) {
	this.interval = interval;
	this.maxPerInterval = maxPerInterval;
	this.tasks = [];
}

Scheduler.prototype.start = function() {
	if (this._timer) {
		throw new Error('The scheduler is already running, please do not restart it');
	}

	var interval = this.interval / this.maxPerInterval;

	this._timer = setInterval(this.consume.bind(this), interval);
};

Scheduler.prototype.stop = function() {
	clearInterval(this._timer);

	delete this._timer;
};

Scheduler.prototype.schedule = function(task, args) {
	return new Promise((resolve, reject) => {
		this.tasks.push({ task, args, resolve, reject })
	});
};

Scheduler.prototype.consume = function() {
	var {
		task,
		args,
		resolve,
		reject,
	} = this.tasks.pop() || {};

	if (task) {
		try {
			var result = task.apply(null, args);

			// When the result is another promise we should
			// call resolve and reject when this promise is
			// respectively resolved or rejected
			if (result instanceof Promise) {
				result.then(resolve, reject);
			} else {
				resolve( result );
			}
		} catch (ex) {
			reject( ex );
		}
	}
};

export function limit(fn, maxPerInterval = 100, interval = 1000) {
	var scheduler = new Scheduler(maxPerInterval, interval);
	var initCall = true;

	return function() {
		if (initCall) { 
			scheduler.start(); 
			initCall = false;
		}

		return scheduler.schedule(fn, arguments);
	}
}