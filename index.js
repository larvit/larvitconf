'use strict';

const	topLogPrefix	 = 'larvitconf - index.js: ',
	LUtils	= require('larvitutils'),
	async = require('async'),
	log = require('winston'),
	fs	= require('fs');

function Configs(options, cb) {
	const	that	= this;

	if ( ! that) {
		throw new Error('This library must be instanciated.');
	}

	if (typeof cb !== 'function') {
		cb	= function () {};
	}

	that.options	= options || {};

	if ( ! options.log) {
		const	tmpLUtils	= new LUtils();
		options.log	= new tmpLUtils.Log();
	}

	that.log	= that.options.log;

	cb();
}

/**
 * Load configuration files
 * @param {obj} paths - {OPTIONAL: statics, OPTIONAL: envs}
 * @param {function} cb	- callback
 */
Configs.prototype.loadConfigs = function loadConfigs(cb) {
	const	logPrefix	= topLogPrefix + 'loadConfigs - ',
		configs	= {},
		tasks	= [],
		that	= this;

	if (typeof cb !== 'function') {
		cb	= function () {};
	}

	that.log.info(logPrefix + 'Loading config files');

	configs.statics = {};
	configs.envs	= {};

	// Load configs
	tasks.push(function (cb) {
		const tasks = [],
			fileList = {
				statics: [],
				envs: []
			};

		let configPath = process.cwd() + '/config/';

		function getFiles(path, cb) {
			const files = {};

			fs.readdir(path, function (err, list) {
				if (err) return cb(err);

				if (list.length === 0)  {
					that.log.warn(logPrefix + 'No configuration files found in: ' + path);
					return cb();
				}

				// Add file paths to files list
				for (let i = 0; list[i] !== undefined; i++) {
					if (list[i].match(/\.json_example$/)) {
						if (! list.includes(list[i].substring(0, list[i].length - 8))) {
							that.log.error(logPrefix + 'Missing configfile: ' + list[i].substring(0, list[i].length - 8));
						} else {
							files[list[i].substring(0, list[i].length - 13)] = (path + list[i].substring(0, list[i].length - 8));
						}
					}
				}

				cb(err, files);
			});
		}

		// Check if a path is given
		if (that.options.configPath) configPath = that.options.configPath;

		// List files in the statics path
		tasks.push(function (cb) {
			getFiles(configPath + 'statics/', function (err, files) {
				if (err) return cb(err);

				fileList.statics = files;
				cb();
			});
		});

		// List files in the statics path
		//tasks.push(function (cb) {
		//	fs.readdir(staticsPath, function (err, list) {
		//		if (err) return cb(err);
//
		//		if (list.length === 0)  {
		//			that.log.warn(logPrefix + 'No configuration files found in: ' + staticsPath);
		//			return cb();
		//		}
//
		//		// Add file paths to files list
		//		for (let i = 0; list[i] !== undefined; i++) {
		//			if (list[i].match(/\.json_example$/)) {
		//				if (! list.includes(list[i].substring(0, list[i].length - 8))) {
		//					that.log.error(logPrefix + 'Missing configfile: ' + list[i].substring(0, list[i].length - 8));
		//				} else {
		//					fileList.statics[list[i].substring(0, list[i].length - 13)] = (staticsPath + list[i].substring(0, list[i].length - 8));
		//				}
		//			}
		//		}
//
		//		cb();
		//	});
		//});


		// List files in the statics path
		tasks.push(function (cb) {
			getFiles(configPath + 'envs/', function (err, files) {
				if (err) return cb(err);

				fileList.envs = files;
				cb();
			});
		});

		// List files in the envs path
		//tasks.push(function (cb) {
		//	fs.readdir(envsPath, function (err, list) {
		//		if (err) return cb(err);
//
		//		if (list.length === 0)  {
		//			that.log.warn(logPrefix + 'No configuration files found in: ' + envsPath);
		//			return cb();
		//		}
//
		//		// Add file paths to files list
		//		for (let i = 0; list[i] !== undefined; i++) {
		//			if (list[i].match(/\.json_example$/)) {
		//				if (! list.includes(list[i].substring(0, list[i].length - 8))) {
		//					that.log.error(logPrefix + 'Missing configfile: ' + list[i].substring(0, list[i].length - 8));
		//				} else {
		//					fileList.envs[list[i].substring(0, list[i].length - 13)] = (envsPath + list[i].substring(0, list[i].length - 8));
		//				}
		//			}
		//		}
//
		//		cb();
		//	});
		//});

		// Load files
		tasks.push(function (cb) {
			const tasks = [];

			for (let app in fileList.statics) {
				tasks.push(function (cb) {
					fs.readFile(fileList.statics[app], function (err, file) {
						if (err) return cb(err);

						configs.statics[app] = JSON.parse(file);

						cb();
					});
				});
			}

			for (let app in fileList.envs) {
				tasks.push(function (cb) {
					fs.readFile(fileList.envs[app], function (err, file) {
						if (err) return cb(err);

						configs.envs[app] = JSON.parse(file);

						cb();
					});
				});
			}

			async.series(tasks, cb);
		});

		async.series(tasks, cb);
	});

	async.series(tasks, function (err) {
		if (err) throw err;
		cb(err, configs);
	});

};

exports = module.exports = Configs;