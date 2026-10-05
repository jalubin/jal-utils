'use strict';

var helpers = new Helpers();
if (typeof module != 'undefined') module.exports = helpers;

function Helpers() {
	var debounceTimer;
	var reader;

	return {

		isset: function(obj) {
			return is.not.undefined(obj);
		},

		isEmptyString: function(input) {
			return input === '';
		},

		// make a "deep" copy of an array or object
		extend: function(original) {
			if (is.array(original)) {
				return $.extend(true, [], original);
			} else if (is.object(original)) {
				return $.extend(true, {}, original);
			}
			return original;
		},

		// recursively merge or replace source object into destination object
		merge: function(destination, source) {
			return $.extend(true, destination, source);
		},

		debounce: function(func, wait) {
			if (is.not.function(func)) {
				console.warn('Debounce expects first parameter to be a function');
				return;
			}
			if (is.undefined(wait)) var wait = 500;
			if (debounceTimer) clearTimeout(debounceTimer);
			debounceTimer = setTimeout(func, wait);
			return debounceTimer;
		},

		containsSubstring: function(str, substr) {
			if (!str) return false;
			return str.indexOf(substr) > -1;
		},

		inList: function(obj, list) {
			for (var i in list) {
				if (list[i] === obj) return true;
			}
			return false;
		},

		removeFromList: function(target, list) {
			for (var i in list) {
				if (list[i] === target) {
					if (is.array(list)) list.splice(i, 1);
					else delete list[i];
					break;
				}
			}
		},

		removeIndex: function(i, list) {
			if (is.array(list)) list.splice(i, 1);
			else delete list[i];
		},

		filterAssociativeArray: function(input, test) {
			var result = this.extend(input);
			if (is.object(result) && !is.array(result) && is.function(test)) {
				for (var i in result) {
					if (!test(result[i])) {
						delete result[i];
					}
				}
			}
			return result;
		},

		arrayToObjects: function(list, id) {
			if (!id) id = '_id';
			var obj = {};
			for (var i in list) {
				obj[list[i][id]] = list[i];
			}
			return obj;
		},

		listFields: function(obj) {
			return Object.keys(obj);
		},

		sortObjectByField: function(object, field) {
			if (is.object(object) && is.string(field)) {
				var array = this.extend(object);
				if (is.not.array(array)) array = _.toArray(array);
				array = _.sortBy(array, field);
				return this.arrayToObjects(array, field);
			}
			return object;
		},

		sortArrayOfArraysAscending: function(array, field) {
			if (is.array(array) && is.not.undefined(field)) {
				return _.sortBy(array, field);
			}
			return array;
		},

		objectsToArrays: function(objects, headers) {
			var result = Object.values(objects);
			for (var i in result) {
				var arr = [];
				for (var j in headers) arr.push(result[i][headers[j]]);
				result[i] = arr;
			}
			result.unshift(headers);
			return result;
		},

		insertToArray: function(array, index, item) {
			array.splice(index, 0, item);
		},

		insertChar: function(str, position, char) {
			return str.slice(0, position) + char + str.slice(position);
		},

		collapseRow: function(data) {
			var row = [];
			for (var i in data) {
				for (var field in data[i]) {
					row.push(data[i][field] ? data[i][field] : '');
				}
			}
			return row;
		},

		fillRow: function(headers, data) {
			var row = [];
			for (var i in headers) {
				for (var field in headers[i]) {
					row.push(data[field] ? data[field] : '');
				}
			}
			return row;
		},

		getJSON: function(input) {
			try {
				var result = $.parseJSON(input);
				if (is.object(result)) return result;
			}
			catch(e) {
				console.error('helpers.getJSON() : an error occured while parsing JSON');
			}
			return {};
		},

		// validates whether email has the correct format of a valid email address
		validateEmailFormat: function(email) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},

		// Validate multiple email inputs separated by ';' or ','
		validateMultipleEmailInputs: function(emails) {

			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var success = false, email;

			if (is.not.undefined(emails)) {

				var emailList = emails.split(/\s*,|;\s*/);

				// Removing spaces
				emailList = _.map(emailList, function(e) {
					return e.trim();
				});

				for(var i = 0; i< emailList.length; i++) {
					email = emailList[i]

					if(email === "") continue;
					if(re.test(email)) success = true;
					if (!re.test(email)) return false;

				}
			}

			return success;
		},

		// validates whether password has at least one lower case letter, upper case letter and number
		validatePasswordFormat: function(password) {
			var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S\s]{8,}$/;
			return re.test(password);
		},

		// validates whether num is a positive floating point number
		validateNumberFormat: function(num) {
			var re = /^[0-9]+(\.[0-9]+)?$/;
			return re.test(num);
		},

		// validates whether num is an integer
		validateIntegerFormat: function(num) {
			var re = /^[0-9]+$/;
			return re.test(num);
		},

		// checks that start is before end
		orderedDates: function(start, end) {
			return moment(start) < moment(end);
		},

		orderedOrEqualDates: function(start, end) {
			return moment(start) <= moment(end);
		},

		permute: function(list) {
			var ret = "";
			var swap = function(a, b) {
				var temp = list[a];
				list[a] = list[b];
				list[b] = temp;
			}
			var output = function() {
				for (var i in list) ret += list[i];
			}
			var permutate = function(n) {
				if (n == 1) output();
				else {
					for (var i=0; i < n; i++) {
						permutate(n-1);
						if (n % 2 == 1) swap(0, n-1); // odd
						else swap(i, n-1); // even
					}
				}
			}
			permutate(list.length);
			return ret;
		},

		capitalize: function(word) {
			if (typeof word == 'string') {
				var ret = "";
				word = word.split(" ")
				for (var i=0; i < word.length; ++i) {
					var add = word[i].replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
					ret += add;
					if (i+1 != word.length && add.length > 0) ret += " ";
				}
				return ret;
			}
			else return word;
		},

		plural: function(word) {
			if (is.string(word)) {
				return word + 's';
			}
			else return word;
		},

		possessive: function(word) {
			if (is.string(word)) {
				return word + '\'s';
			}
			else return word;
		},

		// get params from url in the form ?a=1&b=2&c=3 and save them in an object
		urlParams: function(url) {
			var start = url.indexOf('?');
			if (start < 0) return;

			var result = {};
			var query = url.substring(start+1);
			var vars = query.split('&');

			for (var i=0; i < vars.length; ++i) {
				var pair = vars[i].split('=');

				// If first entry with this name
				if (is.undefined(result[pair[0]])) {
					result[pair[0]] = decodeURIComponent(pair[1]);

				// If second entry with this name
				} else if (is.string(result[pair[0]])) {
					var arr = [result[pair[0]], decodeURIComponent(pair[1])];
					result[pair[0]] = arr;

				// If third or later entry with this name
				} else {
					result[pair[0]].push(decodeURIComponent(pair[1]));
				}
			}

			return result;
		},

		downloadFile: function(href, payload) {
			console.log(href);
			// console.log(payload);

			// POST form method
			if (is.object(payload)) {
				var form = document.createElement('form');
				form.setAttribute('method', 'POST');
				form.setAttribute('action', href);
				form.setAttribute('target', 'file-download-frame');
				form.setAttribute('style', 'display: none');

				for (var key in payload) {
					if (payload.hasOwnProperty(key)) {
						var hiddenField = document.createElement('input');
						hiddenField.setAttribute('name', key);
						hiddenField.setAttribute('value', payload[key]);
						form.appendChild(hiddenField);
					}
				}

				$('body').append(form);
				form.submit();
				$(form).remove();

			// GET anchor method
			} else {
				var anchor = document.createElement('a');
				anchor.download = '';
				anchor.href = href;
				anchor.click();
			}
		},

		createDateAsUTC: function(date) {
			if (is.not.date(date)) date = new Date(date);
			return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
		},

		convertDateToUTC: function(date) {
			if (is.not.date(date)) date = new Date(date);
			return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		},

		convertDateToUnixTimestamp: function(date) {
			var result;
			if (is.string(date)) date = helpers.createDateAsUTC(new Date(date));
			if (is.date(date)) result = date.valueOf();
			return result;
		},

		convertTimestampToDateString: function(input, options) {
			if (!input) return '';
			if (!options) options = {};

			var format = options.format ? options.format : 'YYYY-MM-DD HH:mm:ss';
			var date = helpers.convertDateToUTC(new Date(input));
			return moment(date).format(format);
		},

		formatDateStringAsUTC: function(date, options) {
			var result = moment(helpers.createDateAsUTC(date));
			if (options && options.timezoneOffset) result.subtract('hours', options.timezoneOffset);
			return helpers.convertTimestampToDateString(result, options);
		},

		createNewFormattedTimestampAsUTC: function(date) {
			return helpers.formatDateStringAsUTC(helpers.convertDateToUTC(date));
		},

		getCurrentTimestampAsUTC: function() {
			var now = new Date();
			now = helpers.convertDateToUTC(now);
			now = helpers.formatDateStringAsUTC(now);
			return now;
		},

		getPresentLocalTimezoneOffset: function() {
			var offset = new Date().getTimezoneOffset();
			return -1 * offset / 60;
		},

		getLocalTimezoneOffset: function(date) {
			if (!date) date = new Date();
			else if (!is.date(date)) date = new Date(date);
			var offset = date.getTimezoneOffset();
			return -1 * offset / 60;
		},

		standardizeTimestamp: function(timestamp) {
			timestamp = helpers.createDateAsUTC(timestamp);
			timestamp = helpers.convertTimestampToDateString(timestamp)
			return timestamp;
		},

		timestampAdd: function(timestamp, num, units) {
			return helpers.standardizeTimestamp(moment(timestamp).add(num, units).toISOString());
		},

		timestampAbsoluteDifference: function(a, b) {
			if (is.not.date(a)) a = new Date(a);
			if (is.not.date(b)) b = new Date(b);
			return Math.abs(a - b);
		},

		diffInDays: function(a, b) {
			var date1 = new Date(a);
			var date2 = new Date(b);
			var diffTime = Math.abs(date2 - date1);
			var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
			return diffDays;
		},

		csvToArray: function(csv) {
			var data = Papa.parse(csv);

			var headers;
			var result = [];
			var rowLengthWarning = [];

			for (var i=0; i < data.data.length; i++) {
				var row = data.data[i];
				var resultRow = {};

				if (i === 0) {
					headers = row;
					for (var j in headers) {
						if (helpers.isEmptyString(headers[j])) {
							// console.warn('helpers.csvToArray() : WARNING! Found empty header');
							break;
						}
					}
					continue;

				} else if (row.length !== headers.length) {
					if (row.length === 0) continue;
					else if (row.length === 1 && row[0] === '') continue;
					else rowLengthWarning.push(i+1);
				}

				for (var j=0; j < headers.length; j++) {
					var header = helpers.trimWhitespace(headers[j]);
					if (header !== '') resultRow[header] = row[j];
				}

				result.push(resultRow);
			}

			if (rowLengthWarning.length > 0 && rowLengthWarning.length < data.data.length-2) {
				console.warn('helpers.csvToArray() : WARNING! Found rows with unmatched headers:');
				console.warn(rowLengthWarning);
			}

			return {
				headers: headers,
				rows: result,
			};
		},

		arrayToCsv: function(array) {
			return Papa.unparse(array);
		},

		partiallyPrettifyJSON: function(json) {
			json = json.replaceAll('{', '{\n');
			json = json.replaceAll('",', '",\n');
			json = json.replaceAll('}', '\n}');
			return json;
		},

		trimWhitespace: function(str) {
			return str.trim();
		},

		insertDecimalPoint: function(input, factor) {
			if (is.undefined(factor)) return 'error';

			if (is.not.string(input)) input = input.toString();

			if (input.length <= factor) {
				for (var zeroes = input.length - factor; zeroes < 0; zeroes++) input = '0' + input;
				input = '0.' + input;

			} else {
				input = input.substring(0, input.length - factor) + '.' + input.substring(input.length - factor);
			}

			return helpers.removeTrailingZeroes(input);
		},

		removeTrailingZeroes: function(input) {
			var inputCopy = input;

			for (var k=1; k < inputCopy.length; k++) {
				var char = inputCopy[inputCopy.length - k];

				if (char === '0') {
					input = input.substring(0, input.length - 1);
					continue;

				} else if (char === '.') {
					input = input.substring(0, input.length - 1);
				}

				break;
			}

			return input;
		},

		formatPrice: function(input) {
			if (is.number(input)) {
				return Math.round((input + Number.EPSILON) * 100) / 100;
			}

			var result = input;
			if (helpers.isBigDecimal(input)) result = input.getValue();
			if (is.string(result)) result = bigDecimal.round(result, 2);
			return result;
		},

		// helpers for bigDecimal library
		getRoundedValue: function(input, precision) {
			var _input = input;
			if (helpers.isBigDecimal(_input)) _input = input.getValue();
			if (is.undefined(precision)) precision = 18;
			var result = bigDecimal.round(_input, precision, bigDecimal.RoundingModes.HALF_UP);
			return helpers.removeTrailingZeroes(result);
		},

		calculateHalf: function(amount) {
			amount = helpers.divide(amount, '2');
			return helpers.getRoundedValue(amount);
		},

		greaterThan: function(a, b) {
			// true if a > b
			if (!helpers.isBigDecimal(a)) a = new bigDecimal(a);
			if (!helpers.isBigDecimal(b)) b = new bigDecimal(b);
			return a.compareTo(b) === 1;
		},

		lessThan: function(a, b) {
			// true if a < b
			if (!helpers.isBigDecimal(a)) a = new bigDecimal(a);
			if (!helpers.isBigDecimal(b)) b = new bigDecimal(b);
			return a.compareTo(b) === -1;
		},

		equalTo: function(a, b) {
			// true if a == b
			if (!helpers.isBigDecimal(a)) a = new bigDecimal(a);
			if (!helpers.isBigDecimal(b)) b = new bigDecimal(b);
			return a.compareTo(b) === 0;
		},

		add: function(a, b, precision) {
			if (is.string(a) && is.undefined(b)) {
				var split = a.split('+');
				a = split[0];
				b = split[1];
			}
			if (helpers.isBigDecimal(a)) a = a.getValue();
			if (helpers.isBigDecimal(b)) b = b.getValue();
			if (is.undefined(precision)) precision = 18;
			var result = bigDecimal.add(a, b);
			result = helpers.getRoundedValue(result);
			return new bigDecimal(result);
		},

		subtract: function(a, b, precision) {
			if (is.string(a) && is.undefined(b)) {
				var split = a.split('-');
				a = split[0];
				b = split[1];
			}
			if (helpers.isBigDecimal(a)) a = a.getValue();
			if (helpers.isBigDecimal(b)) b = b.getValue();
			if (is.undefined(precision)) precision = 18;
			var result = bigDecimal.subtract(a, b);
			result = helpers.getRoundedValue(result);
			return new bigDecimal(result);
		},

		multiply: function(a, b, precision) {
			if (is.string(a) && is.undefined(b)) {
				var split = a.split('*');
				a = split[0];
				b = split[1];
			}
			if (helpers.isBigDecimal(a)) a = a.getValue();
			if (helpers.isBigDecimal(b)) b = b.getValue();
			if (is.undefined(precision)) precision = 18;
			var result = bigDecimal.multiply(a, b);
			result = helpers.getRoundedValue(result);
			return new bigDecimal(result);
		},

		divide: function(a, b, precision) {
			if (is.string(a) && is.undefined(b)) {
				var split = a.split('/');
				a = split[0];
				b = split[1];
			}
			if (helpers.isBigDecimal(a)) a = a.getValue();
			if (helpers.isBigDecimal(b)) b = b.getValue();
			if (is.undefined(precision)) precision = 18;
			var result = bigDecimal.divide(a, b, precision);
			result = helpers.removeTrailingZeroes(result);
			return new bigDecimal(result);
		},

		absoluteValue: function(n) {
			if (!helpers.isBigDecimal(n)) n = new bigDecimal(n);
			n = n.getValue();
			if (helpers.lessThan(n, '0')) n = bigDecimal.negate(n);
			return n;
		},

		isBigDecimal: function(input) {
			return input instanceof bigDecimal;
		},

		sumList: function(list) {
			var sum = '0';
			for (var i in list) {
				sum = helpers.add(sum, list[i]);
			}
			return sum;
		},

		shuffle: function(array) {
			for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
			return array;
		},

		roll: function(num1, num2) {
			var ret;
			if (is.undefined(num1)) {
				ret = Math.random();

			} else if (is.undefined(num2)) {
				ret = Math.random() * num1;

			} else {
				 if (num1 > num2) {
					var temp = num1;
					num1 = num2;
					num2 = temp;
				}
				ret = num1 + Math.random() * (num2 - num1);
			}
			return ret;
		},

	}; // end
}
