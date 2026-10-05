'use strict';

var curl = new Curl();
if (typeof module != 'undefined') module.exports = curl;

function Curl() {

	var LOG_SUCCESS_RESULTS = false;
	var LOG_ERROR_RESULTS = false;

	var _public = {

		get: function(params) {
			// console.log(params);

			if (is.undefined(params) || is.undefined(params.url)) {
				console.error('curl.get() : no \'url\' parameter provided');
				return false;
			}

			console.time('GET: ' + params.url);

			$.ajax({
				type: 'GET',
				url: params.url,
				headers: params.headers,

				success: function(data, textStatus, jqXHR) {
					console.timeEnd('GET: ' + params.url);
					if (LOG_SUCCESS_RESULTS) console.log(data);
					if (is.function(params.success)) params.success(data, textStatus, jqXHR);
				},

				error: function(jqXHR, textStatus, errorThrown) {
					console.timeEnd('GET: ' + params.url);
					_private.logErrors(jqXHR, textStatus, errorThrown);
					if (is.function(params.error)) params.error(jqXHR, textStatus, errorThrown);
				},
			});

			return true;
		},
	};

	var _private = {

		logErrors: function(jqXHR, textStatus, errorThrown) {
			if (is.undefined(jqXHR)) {
				console.error('***** ajax INVALID callback *****');
				return;
			}

			if (jqXHR.statusText === 'timeout') {
				console.warn('***** ajax WARNING callback: timeout *****');
				console.warn('Request has timed out... Please check your internet connection and try again.');
			} else {
				console.error('***** ajax ERROR callback *****');
			}
			
			if (LOG_ERROR_RESULTS) console.warn(jqXHR);

			var error;
			if (is.not.undefined(jqXHR.responseJSON)) {
				error = jqXHR.responseJSON;
				if (LOG_ERROR_RESULTS) console.warn(error);
			}

			if (is.not.undefined(error)) {
				var text = '';
				for (var i in error.errors) {
					if (is.not.undefined(error.errors[i].code)) text += error.errors[i].code + ' ';
					if (is.not.undefined(error.errors[i].message) || is.not.undefined(error.errors[i].field)) text += '-> ';
					if (is.not.undefined(error.errors[i].message)) text += error.errors[i].message;
					if (is.not.undefined(error.errors[i].message) && is.not.undefined(error.errors[i].field)) text += '; ';
					if (is.not.undefined(error.errors[i].field)) text += error.errors[i].field;
					if (is.not.undefined(error.errors[i].message) || is.not.undefined(error.errors[i].field)) text += '\n';
				}
				if (LOG_ERROR_RESULTS) console.error(text);
			} else {
				if (LOG_ERROR_RESULTS) console.error('Error '+jqXHR.status);
			}
		},
	};

	return _public;
}
