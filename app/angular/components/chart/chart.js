'use strict';

angular.module('ngApp.components')

.directive('cg.chart', [function() {
	return {
		restrict: 'A',
		replace: true,
		scope: {
			model: '=',
			type: '=',
			callback: '=',
		},
		template:
			'<canvas width="{{width}}" height="{{height}}"></canvas>',

		controller: ['$scope', '$element', '$rootScope', '$state', function($scope, $element, $rootScope, $state) {

			switch ($scope.type) {
				case 'fiat':
					$scope.options = currencyMap.fiat;
					return;

				case 'crypto':
					$scope.options = currencyMap.crypto.coinGecko;
					return;

				default:
					$scope.options = {};
			}

		}],
		
		link: function($scope, $element, $attributes) {

			for (var i in $scope.options) {
				var option = $scope.options[i];
				option.symbol = option.symbol.toUpperCase();
			}

			$scope.options = helpers.sortObjectByField($scope.options, 'symbol');

			$element[0].onchange = function(event) {
				var value = $(event.target).val();
				$scope.model = helpers.getJSON(value);
				if (is.function($scope.callback)) {
					$scope.callback($scope.model);
				}
			}

		},
	};
}]);
