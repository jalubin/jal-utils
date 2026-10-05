'use strict';

angular.module('ngApp.components')

.directive('mainHeader', [function() {
	return {
		restrict: 'A',
		replace: false,
		templateUrl: 'app/angular/components/header/header.html',
		controller: ['$scope', '$element', '$state', function($scope, $element, $state) {

			$scope.domain = config.domain;

			$scope.pagesLeft = [
				{
					state: 'games',
					label: 'Games',
				},
				{
					state: 'about',
					label: 'About',
				},
			];

			$scope.pagesRight = [
				{
					state: 'careers',
					label: 'Careers',
				},
				{
					state: 'contact',
					label: 'Contact',
				},
			];

			window.onresize = function() {
				var viewportWidth = $(window).width();

				var contentWidth = $('#mainHeader .header-content').width();
				var diff = viewportWidth - contentWidth;
				if (diff < 0) diff = 0;
				$('#mainHeader .header-repeat-js').width(Math.ceil(diff/2));

				var trimMiddleWidth = $('#headerTrim .trim-middle').width();
				diff = viewportWidth - trimMiddleWidth;
				if (diff < 0) diff = 0;
				$('#headerTrim .trim-repeat-left').width(Math.ceil(diff/2));
				$('#headerTrim .trim-repeat-right').width(Math.ceil(diff/2) + 1);
			}
			
			setTimeout(function() { $(window).trigger('resize'); }, 100);

		}]
	}
}]);
