'use strict';

angular.module('ngApp.components')

.directive('mainFooter', [function() {
	return {
		restrict: 'A',
		replace: false,
		templateUrl: 'app/angular/components/footer/footer.html',
		controller: ['$scope', '$element', '$state', function($scope, $element, $state) {

			$scope.domain = config.domain;

			$scope.socialMediaButtons = [
				{
					url: 'https://twitter.com/',
					icon: 'twitter',
				},
				{
					url: 'https://facebook.com/',
					icon: 'facebook-square',
				},
				{
					url: 'https://linkedin.com/',
					icon: 'linkedin-square',
				},
				{
					url: 'https://instagram.com/',
					icon: 'instagram',
				},
				{
					url: 'https://youtube.com/',
					icon: 'youtube-square',
				},
			];

		}]
	}
}]);
