'use strict';

const { Log } = require('larvitutils');
const assert = require('assert');
const configLib = require('../index.js');

const log = new Log();

describe('Configurations', () => {
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

	it('Should override with env variable if set', async () => {
		process.env['envConfig1__testConfigFile'] = '"override"';
		let options = {
			configFolder: __dirname + '/config/',
			requiredFiles: ['envs/envConfig1.json'],
			log,
			envOverride: true,
		};

		const config = await configLib.loadConfigs(options);
		assert.strictEqual(config.configs.envs.envConfig1.testConfigFile, 'override');
	});

	it('Should not override with env variable if envOverride option is not set to true', async () => {
		process.env['envConfig1__testConfigFile'] = '"override"';
		let options = {
			configFolder: __dirname + '/config/',
			requiredFiles: ['envs/envConfig1.json'],
			log,
		};

		const config = await configLib.loadConfigs(options);
		assert.strictEqual(config.configs.envs.envConfig1.testConfigFile, 'specificEnvConfig1.json');
	});

	it('Should add to config with env variable even if not set', async () => {
		process.env['envConfig1__newKey'] = '"value"';
		let options = {
			configFolder: __dirname + '/config/',
			requiredFiles: ['envs/envConfig1.json'],
			log,
			envOverride: true,
		};

		const config = await configLib.loadConfigs(options);
		assert.strictEqual(config.configs.envs.envConfig1.newKey, 'value');
	});

	it('Should parse json value from env override', async () => {
		process.env['envConfig1__anArray'] = '["value","value2"]';
		let options = {
			configFolder: __dirname + '/config/',
			requiredFiles: ['envs/envConfig1.json'],
			log,
			envOverride: true,
		};

		const config = await configLib.loadConfigs(options);
		assert.deepEqual(config.configs.envs.envConfig1.anArray, ['value', 'value2']);
	});

	it('Should override with env variable in deep object structure', async () => {
		process.env['envConfig2__a__nested__object__key'] = '5';
		let options = {
			configFolder: __dirname + '/config/',
			requiredFiles: ['envs/envConfig2.json'],
			log,
			envOverride: true,
		};

		const config = await configLib.loadConfigs(options);
		assert.strictEqual(config.configs.envs.envConfig2.a.nested.object.key, 5);
	});

	it('Should not override if env override value is bad json', async () => {
		process.env['envConfig1__testConfigFile'] = 'this is not quoted';
		let options = {
			configFolder: __dirname + '/config/',
			requiredFiles: ['envs/envConfig1.json'],
			log,
			envOverride: true,
		};

		const config = await configLib.loadConfigs(options);
		assert.strictEqual(config.configs.envs.envConfig1.testConfigFile, 'specificEnvConfig1.json');
	});

	it('Should not override if there is no file to override', async () => {
		process.env['envConfig1__testConfigFile'] = 'this is not quoted';
		let options = {
			configFolder: __dirname + '/config/',
			requiredFiles: ['statics/staticConfig1.json'],
			log,
			envOverride: true,
		};

		const config = await configLib.loadConfigs(options);
		assert.strictEqual(config.configs.envs, undefined);
	});
});
