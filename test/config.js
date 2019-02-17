'use strict';

const	assert	= require('assert');
const	configLib	= require('../index.js');
const	log = require('winston');

// Set up winsston
log.remove(log.transports.Console);
/**/log.add(log.transports.Console, {
	'level': 'warn',
	'colorize': true,
	'timestamp': true,
	'json': false
});/**/

before(function (done) {
	done();
});

describe('Configurations', function () {
	it('Should load configs files in default path if no path was given', function (done) {
		let options = {
			'required_files': [
				'statics/staticConfig1.json',
				'/statics/staticConfig2.json',
				'envs/envConfig1.json',
				'/envs/envConfig2.json',
				'envs/badgers/individuals.json',
				'/envs/badgers/honeybadgers/individuals.json'
			],
			'log': log
		};

		configLib.loadConfigs(options, function (err, result) {
			if (err) throw err;

			assert.notEqual(result.config_folder, undefined);
			assert.notEqual(result.configs, undefined);
			assert.notEqual(result.configs.statics, undefined);
			assert.notEqual(result.configs.envs, undefined);

			assert.strictEqual(typeof result.configs.statics.staticConfig1, 'object');
			assert.strictEqual(typeof result.configs.statics.staticConfig2, 'object');
			assert.strictEqual(typeof result.configs.envs.envConfig1, 'object');
			assert.strictEqual(typeof result.configs.envs.envConfig1, 'object');

			assert.strictEqual(result.configs.statics.staticConfig1.testConfigFile, 'defaultStaticConfig1.json');
			assert.strictEqual(result.configs.statics.staticConfig2.testConfigFile, 'defaultStaticConfig2.json');
			assert.strictEqual(result.configs.envs.envConfig1.testConfigFile, 'defaultEnvConfig1.json');
			assert.strictEqual(result.configs.envs.envConfig2.testConfigFile, 'defaultEnvConfig2.json');

			assert.strictEqual(result.configs.envs.badgers.individuals.testConfigFile, 'individuals.json');
			assert.strictEqual(result.configs.envs.badgers.honeybadgers.individuals.testConfigFile, 'individuals.json');


			done();
		});
	});

	it('Should load configs when specific paths are given', function (done) {
		let options = {
			'required_files': [
				'statics/staticConfig1.json',
				'/statics/staticConfig2.json',
				'envs/envConfig1.json',
				'/envs/envConfig2.json',
				'envs/badgers/individuals.json',
				'/envs/badgers/honeybadgers/individuals.json'
			],
			'config_folder': __dirname + '/config/',
			'log': log
		};

		configLib.loadConfigs(options, function (err, result) {
			if (err) throw err;

			assert.notEqual(result.config_folder, undefined);
			assert.notEqual(result.configs, undefined);
			assert.notEqual(result.configs.statics, undefined);
			assert.notEqual(result.configs.envs, undefined);

			assert.strictEqual(typeof result.configs.statics.staticConfig1, 'object');
			assert.strictEqual(typeof result.configs.statics.staticConfig2, 'object');
			assert.strictEqual(typeof result.configs.envs.envConfig1, 'object');
			assert.strictEqual(typeof result.configs.envs.envConfig1, 'object');

			assert.strictEqual(result.configs.statics.staticConfig1.testConfigFile, 'specificStaticConfig1.json');
			assert.strictEqual(result.configs.statics.staticConfig2.testConfigFile, 'specificStaticConfig2.json');
			assert.strictEqual(result.configs.envs.envConfig1.testConfigFile, 'specificEnvConfig1.json');
			assert.strictEqual(result.configs.envs.envConfig2.testConfigFile, 'specificEnvConfig2.json');

			assert.strictEqual(result.configs.envs.badgers.individuals.testConfigFile, 'specificIndividuals.json');
			assert.strictEqual(result.configs.envs.badgers.honeybadgers.individuals.testConfigFile, 'specificIndividuals.json');

			done();
		});
	});

	it('Should get an error if configfile isn\'t valid json', function (done) {
		let options = {
			'required_files': [
				'invalidFile.json'
			],
			'config_folder': __dirname + '/config/',
			'log': log
		};

		configLib.loadConfigs(options, function (err) {
			assert.notEqual(err, null);
			done();
		});
	});

	it('Should get an error if configfile isn\'t found', function (done) {
		let options = {
			'required_files': [
				'nonExistingFile.json'
			],
			'config_folder': __dirname + '/config/',
			'log': log
		};

		configLib.loadConfigs(options, function (err) {
			assert.notEqual(err, null);
			done();
		});
	});

	it('Should get an error if no configfiles specified', function (done) {
		let options = {
			'required_files': [],
			'config_folder': __dirname + '/config/',
			'log': log
		};

		configLib.loadConfigs(options, function (err) {
			assert.notEqual(err, null);
			done();
		});
	});
});
