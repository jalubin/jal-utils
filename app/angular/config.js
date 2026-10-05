'use strict';

var isMobileDevice = false;
var config = new Config();

function Config() {
	var checkMobileDevice = {
		android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		ios: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		blackberry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		any: function() {
			return (checkMobileDevice.android() || checkMobileDevice.ios() || checkMobileDevice.blackberry() || checkMobileDevice.windows() || checkMobileDevice.opera());
		}
	};

	var browserCheck = function() {
		if (typeof $ != 'undefined') {
			if (bowser.chrome) {
				$('html').addClass('chrome');

			} else if (bowser.firefox) {
				$('html').addClass('firefox');

			} else if (bowser.safari) {
				$('html').addClass('safari');

			} else if (bowser.opera) {
				$('html').addClass('opera');

			} else if (bowser.msie) {
				$('html').addClass('msie');
			}
		}
	}

	if (document.location.protocol === "local:" || document.location.protocol === "file:" || checkMobileDevice.any()) {
		isMobileDevice = true;
		$('html').addClass('mobile-device');
	}

	browserCheck();

	return {
		domain: 'http://mysite.com/', // todo: set http address when ready
	};
}
