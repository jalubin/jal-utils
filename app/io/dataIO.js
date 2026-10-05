'use strict';

var nodeJS;
var dataIO = new DataIO();
if (typeof module != 'undefined') {
	nodeJS = true;
	module.exports = dataIO;
}

function DataIO() {
	var reader = new FileReader();

	reader.onload = function() {
		reader.fileContents = reader.result;
	}

	var _public = {
		getFileReader: function() {
			return reader;
		},

		fileChangedHandler: function(event) {
			reader.fileContents = null;
			if (event && event.target && event.target.files && event.target.files[0]) {
				var file = event.target.files[0];
				reader.fileName = file.name;
				reader.readAsText(file); // calls reader.onload()
			}
		},

		printFileContents: function() {
			if (reader.fileContents) {
				var file = reader.fileContents;
				var fileName = reader.fileName; 

				var split = fileName.split('.');
				var fileExtension = split.pop();
				fileName = split.join('.');

				var result;
				if (fileExtension === 'csv') result = helpers.csvToArray(file);
				else if (fileExtension === 'json') result = helpers.getJSON(file);

				console.log(fileName + '.' + fileExtension);
				console.log(result);
			}
		},
	};

	var _private = {

	};

	return _public;
}
