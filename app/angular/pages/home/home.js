'use strict';

angular.module('ngApp.controllers')

.controller('HomeCtrl', ['$scope', '$state', function($scope, $state) {

	$scope.updateSearchDateToNow = function() {
		var now = helpers.getCurrentTimestampAsUTC();
		$scope.searchDate = new Date(now);
	}

	$scope.updateSearchDateToNow();
	
}]);
