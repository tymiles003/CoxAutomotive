var bmWatsonService = angular.module("bmWatsonService", ["ngResource"]);

bmWatsonService.factory('WatsonService', ['$http', function($http) {
	//console.log("Inside WatsonService");

	return {
		getWatsonResponse_question_answer: function(successHandler, errorHandler, criteria) {
			console.log("In getWatsonResponse_question_answer block: " + JSON.stringify(criteria));

			var xhrRequest = {
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				method: 'post',
				url: '/api/watson-qa',
				data: "dataset="+criteria.dataset+"&questionText="+criteria.questionText
			};

			$http(xhrRequest)
			.success(function(data, status, headers, config) {
				successHandler(data)
			})
			.error(function(data, status, headers, config) {
				errorHandler(data);
			})
		},

		getWatsonResponse_tradeoff_analytics: function(successHandler, errorHandler, criteria) {
			console.log("In getWatsonResponse_tradeoff_analytics block: " + JSON.stringify(criteria));

			var xhrRequest = {
				headers: {'Content-Type': 'application/json'},
				method: 'post',
				url: '/api/watson-ta',
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
		
		getWatsonResponse_SpeechToText: function(successHandler, errorHandler, criteria) {
			console.log("In getWatsonResponse_SpeechToText block: " + JSON.stringify(criteria));

			var xhrRequest = {
				headers: {'Content-Type': 'application/json'},
				method: 'post',
				url: '/api/watson-stt',
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
		
		getWatsonResponse_TextToSpeech: function(successHandler, errorHandler, criteria) {
			console.log("In getWatsonResponse_TextToSpeech block: " + JSON.stringify(criteria));

			var xhrRequest = {
				headers: {'Content-Type': 'application/json'},
				method: 'post',
				url: '/api/watson-tts',
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