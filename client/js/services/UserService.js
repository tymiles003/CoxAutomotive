var userService = angular.module("userService", ["ngResource"]);

userService.factory('UserService', ['$http', function($http) {
	//console.log("Inside WatsonService");

	return {
		createUser: function(successHandler, errorHandler, criteria) {
			console.log("In CREATE USER block: " + JSON.stringify(criteria));

			var xhrRequest = {
				headers: {'Content-Type': 'application/json'},
				method: 'post',
				url: '/api/createUser',
				data: criteria
			};

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data)
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			})
		},

		verifyUser: function(successHandler, errorHandler, criteria) {
			console.log("In VERIFY USER block: " + JSON.stringify(criteria));

			var xhrRequest = {
				headers: {'Content-Type': 'application/json'},
				method: 'post',
				url: '/api/verifyUser',
				data: criteria
			};

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data)
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			})
		}
	}
}]);