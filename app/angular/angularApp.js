'use strict';

// Declare app level module
angular.module('ngApp', [
	'ngSanitize',
	'ui.router',
	'ngApp.controllers',
	'ngApp.components',
])

.config(['$stateProvider', '$urlRouterProvider', '$compileProvider', function($stateProvider, $urlRouterProvider, $compileProvider) {

	// enter this in console to enable debugging:
	// angular.reloadWithDebugInfo();
	$compileProvider.debugInfoEnabled(false);

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'app/angular/pages/home/home.html',
			controller: 'HomeCtrl'
		})

	$stateProvider
		.state('D3', {
			url: '/D3',
			templateUrl: 'app/angular/pages/D3/D3.html',
			controller: 'D3Ctrl'
		})

	$urlRouterProvider.otherwise('/home');

}])

.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {

	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;

	$rootScope.scrollTop = function() {
		setTimeout(function() {$('#mainContainer').animate({scrollTop: '0px'}, 'fast');}, 0);
	}

	$rootScope.stateEquals = function(state) {
		return $state.current.name === state;
	}

	$rootScope.isMobileDevice = function() {
		return isMobileDevice;
	}

	$rootScope.homepage = config.domain;
	
}]);

angular.module('ngApp.controllers', []);
angular.module('ngApp.components', []);
