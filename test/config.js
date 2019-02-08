'use strict';

const	assert	= require('assert'),
	Config	= require('../index.js'),
	lUtils	= new (require('larvitutils'))(),
	async	= require('async'),
	log	= new lUtils.Log('warning');

//before(function (done) {
//	this.timeout(10000);
//	const	tasks	= [];


//	tasks.push(function (cb) {
//		config = new Config({
//			'log':	log
//		}, cb);
//	});

//	async.series(tasks, done);
//});


describe('Configurations', function () {
	it('Should load default configs if no options given', function (done) {
		const tasks = [];

		let config;

		tasks.push(function (cb) {
			config = new Config({
				'log':	log
			}, cb);
		});

		tasks.push(function (cb) {
			config.loadConfigs(function (err, configuration) {
				assert.notEqual(configuration, undefined);
				assert.notEqual(configuration.statics, undefined);
				assert.notEqual(configuration.envs, undefined);

				assert.strictEqual(typeof configuration.statics.staticConfig1, 'object');
				assert.strictEqual(typeof configuration.statics.staticConfig2, 'object');
				assert.strictEqual(typeof configuration.envs.envConfig1, 'object');
				assert.strictEqual(typeof configuration.envs.envConfig1, 'object');

				assert.strictEqual(configuration.statics.staticConfig1.testConfigFile, 'defaultStaticConfig1.json');
				assert.strictEqual(configuration.statics.staticConfig2.testConfigFile, 'defaultStaticConfig2.json');
				assert.strictEqual(configuration.envs.envConfig1.testConfigFile, 'defaultEnvConfig1.json');
				assert.strictEqual(configuration.envs.envConfig2.testConfigFile, 'defaultEnvConfig2.json');

				cb();
			});
		});

		async.series(tasks, done);
	});

	it('Should load configs when specific paths are given', function (done) {
		const tasks = [];

		let config;

		tasks.push(function (cb) {
			config = new Config({
				'log':	log,
				'configPath': __dirname + '/config/'
			}, cb);
		});

		tasks.push(function (cb) {
			config.loadConfigs(function (err, configuration) {

				assert.notEqual(configuration, undefined);
				assert.notEqual(configuration.statics, undefined);
				assert.notEqual(configuration.envs, undefined);

				assert.strictEqual(typeof configuration.statics.staticConfig1, 'object');
				assert.strictEqual(typeof configuration.statics.staticConfig2, 'object');
				assert.strictEqual(typeof configuration.envs.envConfig1, 'object');
				assert.strictEqual(typeof configuration.envs.envConfig1, 'object');

				assert.strictEqual(configuration.statics.staticConfig1.testConfigFile, 'specificStaticConfig1.json');
				assert.strictEqual(configuration.statics.staticConfig2.testConfigFile, 'specificStaticConfig2.json');
				assert.strictEqual(configuration.envs.envConfig1.testConfigFile, 'specificEnvConfig1.json');
				assert.strictEqual(configuration.envs.envConfig2.testConfigFile, 'specificEnvConfig2.json');

				cb();
			});
		});

		async.series(tasks, done);
	});
});
