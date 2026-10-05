'use strict';

angular.module('ngApp.controllers')

.controller('D3Ctrl', ['$scope', '$state', function($scope, $state) {
	var debug = false;

	$scope.distance = 0;
	$scope.distanceUnit = 'm';
	$scope.amps = 0;
	$scope.volts = 120;
	$scope.drop = 5;
	$scope.conductor = 'cu';
	$scope.insulationTemp = 90;
	$scope.ambientTemp = 30;
	$scope.conductorCount = 1;
	$scope.answer = 'Click Submit';

	var TD3 = TABLES.TD3;
	var TD3_AL_TO_CU_MAP = TABLES.TD3_AL_TO_CU_MAP;
	var TD3DCF = TABLES.TD3DCF;
	var T2 = TABLES.T2;
	var T4 = TABLES.T4;
	var T5A = TABLES.T5A;
	var T5C = TABLES.T5C;

	$scope.submit = function() {
		calc();
		return;

		// dataIO.printFileContents();
	}

	// Bm * %drop * DCF * volts/120 >= distance
	// Bm guess = distance / (%drop * volts/120)
	var calc = function() {
		if ($scope.distance <= 0) {
			$scope.answer = 'Error: Distance must be > 0';
			return;
		} else if ($scope.amps <= 0) {
			$scope.answer = 'Error: Ampacity must be > 0';
			return;
		} else if ($scope.volts <= 0) {
			$scope.answer = 'Error: System Voltage must be > 0';
			return;
		} else if ($scope.drop <= 0) {
			$scope.answer = 'Error: % Voltage Drop must be > 0';
			return;
		} else if ($scope.insulationTemp <= 0) {
			$scope.answer = 'Error: Rated Insulation Temp must be > 0';
			return;
		} else if ($scope.ambientTemp <= 0) {
			$scope.answer = 'Error: Ambient Temp must be > 0';
			return;
		} else if ($scope.conductorCount <= 0) {
			$scope.answer = 'Error: # of Conductors must be > 0';
			return;
		}

		$scope.distance = Number($scope.distance);
		$scope.amps = Number($scope.amps);
		$scope.volts = Number($scope.volts);
		$scope.drop = Number($scope.drop);
		$scope.insulationTemp = Number($scope.insulationTemp);
		$scope.ambientTemp = Number($scope.ambientTemp);
		$scope.conductorCount = Number($scope.conductorCount);

		var distance = $scope.distance;
		if ($scope.distanceUnit == 'ft') distance *= 0.3048; // 1 ft = 0.3048 m
		if (debug) console.log(distance)
		var bmGuess = distance / ($scope.drop * $scope.volts/120);
		if (debug) console.log(bmGuess)
		var bm1;
		var bm2;
		var awg1;
		var awg2;

		var row;
		for (var i=0; i < TD3.table.length; i++) {
			row = TD3.table[i];
			if (row.current >= $scope.amps) break;
		}
		if (debug) console.log(row)
		for (var i=1; i < TD3.headers.length; i++) {
			var awg = TD3.headers[i];
			if ($scope.conductor == 'al') awg = TD3_AL_TO_CU_MAP[awg];
			if (is.not.undefined(row[awg]) && row[awg] > bmGuess) {
				// todo: #18 underflow error catch?
				awg1 = TD3.headers[i];
				bm1 = row[awg1];
				if ($scope.conductor == 'al') bm1 = row[TD3_AL_TO_CU_MAP[awg1]];
				if (i > 1) {
					awg2 = TD3.headers[i-1];
					bm2 = row[awg2];
					if ($scope.conductor == 'al') bm2 = row[TD3_AL_TO_CU_MAP[awg2]];
				}
				break;
			}
		}
		if (!awg1) {
			$scope.answer = 'Error: Basic meters lookup not found';
			return;
		}
		if (!awg2) {
			awg2 = awg1;
			bm2 = bm1;
		}
		if (debug) console.log(awg1, awg2)
		if (debug) console.log(bm1, bm2)

		var allowableAmps1;
		var allowableAmps2;
		var table = T2.table;
		if ($scope.conductor == 'al') table = T4.table;
		for (var i=0; i < table.length; i++) {
			var row = table[i];
			if (row.awg == awg1) allowableAmps1 = row[$scope.insulationTemp];
			else if (row.awg == awg2) allowableAmps2 = row[$scope.insulationTemp];
		}
		if (!allowableAmps1) {
			$scope.answer = 'Error: Allowable amps lookup not found';
			return;
		}
		if (debug) console.log(allowableAmps1, allowableAmps2)

		var factorT5A = 1;
		var factorT5C = 1;
		if ($scope.ambientTemp > 30) {
			factorT5A = undefined;
			for (var i=0; i < T5A.table.length; i++) {
				var row = T5A.table[i];
				if (row.temp >= $scope.ambientTemp) {
					factorT5A = row[$scope.insulationTemp];
					break;
				}
			}
			if (is.undefined(factorT5A)) {
				$scope.answer = 'Error: Ambient temperature factor lookup not found';
				return;
			}
		}
		if ($scope.conductorCount > 3) {
			for (var i=0; i < T5C.table.length; i++) {
				var row = T5C.table[i];
				if (row[0] >= $scope.conductorCount) {
					factorT5C = row[1];
					break;
				}
			}
		}
		if (debug) console.log(factorT5A, factorT5C)
		allowableAmps1 *= factorT5A * factorT5C;
		allowableAmps2 *= factorT5A * factorT5C;
		if (debug) console.log(allowableAmps1, allowableAmps2)

		var dcf1;
		var dcf2;
		allowableAmps1 = $scope.amps / allowableAmps1;
		allowableAmps2 = $scope.amps / allowableAmps2;
		if (debug) console.log(allowableAmps1, allowableAmps2)
		var percent1 = Math.round(Math.ceil(allowableAmps1*10))*10;
		var percent2 = Math.round(Math.ceil(allowableAmps2*10))*10;
		if (percent1 < 40) percent1 = 40;
		if (percent2 < 40) percent2 = 40;
		if (debug) console.log(percent1, percent2)
		for (var i=1; i < TD3DCF.table.length; i++) {
			var row = TD3DCF.table[i];
			if (row.temp == $scope.insulationTemp) {
				dcf1 = row[percent1];
				dcf2 = row[percent2];
				break;
			}
		}
		if (!dcf1) {
			$scope.answer = 'Error: DCF lookup not found';
			return;
		}
		if (debug) console.log(dcf1, dcf2)

		// Bm * %drop * DCF * volts/120 >= distance
		var answer1 = bm1 * $scope.drop * dcf1 * $scope.volts/120;
		var answer2 = bm2 * $scope.drop * dcf2 * $scope.volts/120;
		if (awg2 && answer2 >= distance) {
			$scope.answer = '#' + awg2;
		} else if (answer1 >= distance) {
			$scope.answer = '#' + awg1;
		} else {
			$scope.answer = 'Error: AWG size not found';
		}
		if (debug) console.log(answer1, answer2)
		if (debug) console.log('~~~~~~~~~~~~~~')
	}

}]);
