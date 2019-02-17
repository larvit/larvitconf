# larvitconf

larvitconf is configuration loading library that take options and load json files in to a json object.

## Usage

```
let options = {
	'required_files': [
		'configFile1.json',
		'/subFolder/configFile2.json',
		'/subFolder/subFolder2/configFile3.json'
	],
	'config_folder': '/srv/application/config/' // Optional
};

configLib.loadConfigs(options, function (err, config) {
	console.log(config);
});
```

Code above returns a json object that look like this.

```
{
	configs: {
		configFile1: {},
		subFolder: {
			configFile2: {},
			subFolder2: {
				configFile3: {}
			}
		}
	},
	config_folder: '/srv/application/config/'
}
```

"config_folder" is optional and if not specified the lib will look in the folder where the process is run and in it's subfolder "config/"