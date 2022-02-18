# larvitconf

larvitconf is configuration loading library that take options and load json files in to a json object.

## Usage

```
let options = {
	'requiredFiles': [
		'configFile1.json',
		'/subFolder/configFile2.json',
		'/subFolder/subFolder2/configFile3.json'
	],
	'configFolder': '/srv/application/config/' // Optional
};

const config = await configLib.loadConfigs(options); // throws on error
console.log(config);
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
	configFolder: '/srv/application/config/'
}
```

"configFolder" is optional and if not specified the lib will look in the folder where the process is run and in it's subfolder "config/"

# Changelog
## 0.1.0
- required_files => requiredFiles
- config_folder => configFolder
- Upped lib versions
- Return promise instead of taking callback
