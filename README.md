[![Build Status](https://github.com/larvit/larvitconf/actions/workflows/ci.yml/badge.svg)](https://github.com/larvit/larvitconf/actions)

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
	'configFolder': '/srv/application/config/', // Optional
	'envOverride': true // Optional, defaults to false
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

### Override with environmental variables
Values in configuration files can be overridden by using environmental variables. The value should be valid json.
The following format is expected (note the double underscore separator): <config-file>__<key1>__<key1.2>=<json>
For instance, a config file `example.json` like:
```json
{
	"key1": "value",
	"nested": {
		"object": [12, 13]
	}
}
```

can be overridden by the following environmental variables:
- `example__key1="new value"`
- `example__nested__object=[23,24]`

# Changelog
## 0.2.0
- config can now be overrided with environmental variables

## 0.1.0
- required_files => requiredFiles
- config_folder => configFolder
- Upped lib versions
- Return promise instead of taking callback
