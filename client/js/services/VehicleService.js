var vehicleService = angular.module("vehicleService", ["ngResource"]);

vehicleService.factory('VehicleService', ['$http','$rootScope', function($http, $rootScope) {

	return {
		getInventoryAnalysis: function(successHandler, errorHandler, data) {

			var xhrRequest = {
				headers: {"Content-Type" : "application/json; charset=utf-8"},
				method: 'post',
				url: '/api/watson-ta',
				data: data
			};

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data)
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			})
		},

		getWatsonCarCriteria: function(successHandler, errorHandler) {
			var xhrRequest = {
				method: 'get',
				url: '/api/getWatsonCarCriteria'
			}

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data);
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			});
		},

		getThirdPartyCarDetails: function(successHandler, errorHandler, cardata) {
			var xhrRequest = {
				method: 'get',
				url: 'https://api.edmunds.com/api/vehicle/v2/'+cardata.make.toLowerCase()+'/'+cardata.model.toLowerCase()+'/'+cardata.year+'/styles?view=full&fmt=json&api_key=6hpb5wfpnzecnubrar58w5tv'
			}

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data);
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			});
		},

		getThirdPartyCarRatings: function(successHandler, errorHandler, cardata) {
			var xhrRequest = {
				method: 'get',
				url: 'https://api.edmunds.com/api/vehicle/v2/grade/'+cardata.make.toLowerCase()+'/'+cardata.model.toLowerCase()+'/'+cardata.year+'?submodel='+cardata.submodel.toLowerCase()+'&fmt=json&api_key=6hpb5wfpnzecnubrar58w5tv'
			}

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data);
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			});
		},

		getThirdPartyCarPhotos: function(successHandler, errorHandler, cardata) {
			var vehicleStyleId = cardata.key.substring(0, cardata.key.indexOf("-"));

			var xhrRequest = {
				method: 'get',
				url: 'https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid?styleId='+vehicleStyleId+'&fmt=json&api_key=6hpb5wfpnzecnubrar58w5tv'
			}

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data);
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			});
		},

		saveCarData: function(successHandler, errorHandler, cardata) {
			var xhrRequest = {
				headers: {"Content-Type" : "application/json; charset=utf-8"},
				method: 'post',
				url: '/api/createCarData',
				data: cardata
			}

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data);
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			});
		},

		getCarsByType: function(successHandler, errorHandler, cardata) {
			var xhrRequest = {
				headers: {"Content-Type" : "application/json; charset=utf-8"},
				method: 'post',
				url: '/api/getCarsByType',
				data: cardata
			}

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data);
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			});
		},

		getCarDetails: function(successHandler, errorHandler, carId) {
			console.log("VehicleService-getCarDetails-carId = " + carId);
			var xhrRequest = {
				method: 'get',
				url: '/api/getCarDetails/'+carId
			}

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data);
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			});
		},

		sendFilterByPreferenceRequest: function(preferenceType, range) {
			$rootScope.$broadcast('filterByPreferenceEvent', preferenceType, range);
		}
	}
}]);