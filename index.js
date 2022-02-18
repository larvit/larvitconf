'use strict';

const _ = require('lodash');
const { Log } = require('larvitutils');
const fs = require('fs');
const path = require('path');

const topLogPrefix = 'larvitconf - index.js: ';

async function loadConfigs(options) {
	const logPrefix = topLogPrefix + 'loadConfigs - ';
	const result = {
		configs: {},
	};

	if (!options.configFolder) options.configFolder = process.cwd() + '/config/';

	if (options.requiredFiles === undefined || options.requiredFiles.length === 0) throw new Error('No config files specified.');

	const log = options.log || new Log();

	log.info(logPrefix + 'Loading config files');

	result.configFolder = options.configFolder;

	// Load config files
	for (const file of options.requiredFiles) {
		const filePath = path.join(options.configFolder, file);

		log.verbose(logPrefix + 'Loading config file: ' + filePath);

		const fileContent = await fs.promises.readFile(filePath);
		let parsedFile = {};

		try {
			parsedFile = JSON.parse(fileContent);
		} catch (err) {
			throw new Error(`Configfile "${file}" is not a valid json-file: ${err.message}`);
		}

		const split = file.split('/');

		if (split[0] === '') split.shift();

		let tmpObj = {};
		let configObj = tmpObj = {};

		for (let i = 0; i < split.length; i++) {
			if (i === split.length - 1) {
				const fileNameWithoutJson = split[i].substring(0, split[i].length - 5);
				tmpObj = tmpObj[fileNameWithoutJson] = parsedFile;
			} else {
				tmpObj = tmpObj[split[i]] = {};
			}
		}

		// Merge data into config object
		result.configs = _.merge(result.configs, configObj);
	}

	return result;
};

exports.loadConfigs = loadConfigs;
