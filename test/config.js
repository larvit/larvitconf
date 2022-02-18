'use strict';

const { Log } = require('larvitutils');
const assert = require('assert');
const configLib = require('../index.js');

const log = new Log();

describe('Configurations', function () {
	it('Should load configs files in default path if no path was given', async () => {
		const options = {
			requiredFiles: [
				'statics/staticConfig1.json',
				'/statics/staticConfig2.json',
				'envs/envConfig1.json',
				'/envs/envConfig2.json',
				'envs/badgers/individuals.json',
				'/envs/badgers/honeybadgers/individuals.json',
			],
			log,
		};

		const result = await configLib.loadConfigs(options);
		assert.notEqual(result.configFolder, undefined);
		assert.notEqual(result.configs, undefined);
		assert.notEqual(result.configs.statics, undefined);
		assert.notEqual(result.configs.envs, undefined);

		assert.strictEqual(result.configs.statics.staticConfig1.testConfigFile, 'defaultStaticConfig1.json');
		assert.strictEqual(result.configs.statics.staticConfig2.testConfigFile, 'defaultStaticConfig2.json');
		assert.strictEqual(result.configs.envs.envConfig1.testConfigFile, 'defaultEnvConfig1.json');
		assert.strictEqual(result.configs.envs.envConfig2.testConfigFile, 'defaultEnvConfig2.json');

		assert.strictEqual(result.configs.envs.badgers.individuals.testConfigFile, 'individuals.json');
		assert.strictEqual(result.configs.envs.badgers.honeybadgers.individuals.testConfigFile, 'individuals.json');
	});

	it('Should load configs when specific paths are given', async () => {
		let options = {
			requiredFiles: [
				'statics/staticConfig1.json',
				'/statics/staticConfig2.json',
				'envs/envConfig1.json',
				'/envs/envConfig2.json',
				'envs/badgers/individuals.json',
				'/envs/badgers/honeybadgers/individuals.json',
			],
			configFolder: __dirname + '/config/',
			log,
		};

		const result = await configLib.loadConfigs(options);
		assert.strictEqual(result.configs.statics.staticConfig1.testConfigFile, 'specificStaticConfig1.json');
		assert.strictEqual(result.configs.statics.staticConfig2.testConfigFile, 'specificStaticConfig2.json');
		assert.strictEqual(result.configs.envs.envConfig1.testConfigFile, 'specificEnvConfig1.json');
		assert.strictEqual(result.configs.envs.envConfig2.testConfigFile, 'specificEnvConfig2.json');
		assert.strictEqual(result.configs.envs.badgers.individuals.testConfigFile, 'specificIndividuals.json');
		assert.strictEqual(result.configs.envs.badgers.honeybadgers.individuals.testConfigFile, 'specificIndividuals.json');
	});

	it('Should construct with no log provided', async () => {
		let options = {
			requiredFiles: [
				'statics/staticConfig1.json',
			],
			configFolder: __dirname + '/config/',
		};

		await assert.doesNotReject(async () => await configLib.loadConfigs(options));
	});

	it('Should get an error if configfile isn\'t valid json', async () => {
		let options = {
			requiredFiles: [
				'invalidFile.json',
			],
			configFolder: __dirname + '/config/',
			log,
		};

		await assert.rejects(async () => await configLib.loadConfigs(options), new Error('Configfile "invalidFile.json" is not a valid json-file: Unexpected token T in JSON at position 0'));
	});

	it('Should get an error if configfile isn\'t found', async () => {
		let options = {
			requiredFiles: [
				'nonExistingFile.json',
			],
			configFolder: __dirname + '/config/',
			log: log,
		};

		await assert.rejects(async () => await configLib.loadConfigs(options), err => {
			assert.ok(err.message.includes('ENOENT: no such file or directory'));

			return true;
		});
	});

	it('Should get an error if no configfiles specified', async () => {
		let options = {
			requiredFiles: [],
			configFolder: __dirname + '/config/',
			log: log,
		};

		await assert.rejects(async () => await configLib.loadConfigs(options), new Error('No config files specified.'));
	});
});
