'use strict';

const topLogPrefix	 = 'larvitconf - index.js: ';
const LUtils	= require('larvitutils');
const async = require('async');
const fs	= require('fs');
const _ = require('lodash');

/**
  * Load configuration files
  * @param {obj} options {OPTIONAL: path, OPTIONAL: required_files}
  * @param {function} cb callback, OPTIONAL
  * @returns {obj} a merged json object from the specifield files
  */
function loadConfigs(options, cb) {
	const	logPrefix	= topLogPrefix + 'loadConfigs - ';
	const tasks	= [];
	const result	= {
		'configs': {}
	};

	let log;

	if (typeof options === 'function') cb	= function () {};
	if (typeof cb !== 'function') cb	= function () {};

	if (!options.log) {
		const	tmpLUtils	= new LUtils();

		options.log = new tmpLUtils.Log();
	}

	if (!options.config_folder) options.config_folder = process.cwd() + '/config/';

	if (options.required_files === undefined || options.required_files.length === 0) return cb(new Error('No config files specified.'));

	log	= options.log;

	log.info(logPrefix + 'Loading config files');

	result.config_folder = options.config_folder;

	// Load config files
	tasks.push(function (cb) {
		const	files	= options.required_files;
		const	tasks	= [];

		for (let i = 0; files[i] !== undefined; i++) {
			// Load files
			tasks.push(function (cb) {
				const path = options.config_folder + files[i];

				log.verbose(logPrefix + 'Loading config file: ' + path);

				fs.readFile(path, function (err, file) {
					const split = files[i].split('/');

					let	tmpObj;
					let	configObj = tmpObj = {};

					if (err) return cb(err);

					try {
						JSON.parse(file);
					} catch (err) {
						return cb(new Error('Configfile is not a valid json-file: ' + err.message));
					}

					if (split[0] === '') split.shift();

					for (let i = 0; i < split.length; i++) {
						if (i === split.length - 1) {
							tmpObj = tmpObj[split[i].substring(0, split[i].length - 5)] = JSON.parse(file);
						} else {
							tmpObj = tmpObj[split[i]] = {};
						}
					}

					// Merge data into config object
					_.merge(result.configs, configObj);

					cb();
				});
			});
		}

		async.series(tasks, cb);
	});

	async.series(tasks, function (err) {
		cb(err, result);
	});
};

exports.loadConfigs = loadConfigs;
