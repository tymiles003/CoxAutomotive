 /****************************************************************************************
 *
 *  @description ____ N/A
 *  @version ________ (.1)
 *  @date ___________ (2015)
 *
 *****************************************************************************************/
 var bmWatsonController = angular.module('bmWatsonController', [])

 /*********************************************
 *  CONTROLLER                            
 **********************************************/
 bmWatsonController.controller('WatsonController', ['$scope','$log','$http','WatsonService', function ($scope,$log,$http,WatsonService) {

	$scope.mytest = "Inside WatsonController";
	$scope.watson_answer = "";
  	$scope.watson_question = "";
  	$scope.watson_dataset = "";
    $scope.sampleQuestion = "";


    // **** Watson: Question and Answer ****//
    //======================================//
  	$scope.askWatson_QuestionAnswer = function()	{
  		$log.info($scope.watson_question + " " + new Date());
  		var data = {
  			'dataset': $scope.watson_dataset,
  			'questionText': $scope.watson_question
  		}
  		var response = WatsonService.getWatsonResponse_question_answer(
  			$scope.askWatson_QuestionAnswer_SuccessHandler,
  			$scope.askWatson_QuestionAnswer_ErrorHandler,
  			data
  		);
  	};

    $scope.askWatson_QuestionAnswer_SuccessHandler = function(response) {
        $scope.watson_answer = [];
        $log.info("array length: " + response.length + " " + new Date());
        if(angular.isArray(response) && response.length > 0)    {
            $scope.watson_answer = response;
        }
        else    {
            var temp = {};
            temp.text = "No answers returned.  Try a more specific question";
            temp.confidence = 0;
            $scope.watson_answer.push(temp);
        }

  		$log.info("WatsonController - RESPONSE: " + JSON.stringify($scope.watson_answer) + " " + new Date());
  	};

  	$scope.askWatson_QuestionAnswer_ErrorHandler = function(error) {
  		$log.info("WatsonController - ERROR: " + error + " " + new Date());
  	};

    $scope.resetAnswer = function() {
        $scope.watson_question = "";
        $scope.watson_answer = "";

        $log.info("$scope.watson_dataset: " + $scope.watson_dataset + " " + new Date());
        
        if($scope.watson_dataset === 'travel') {
          $scope.sampleQuestion = "Where to visit in Seattle?";
        }
        else if($scope.watson_dataset === 'healthcare') {
          $scope.sampleQuestion = "How to avoid getting sick?";
        }
    };

    // **** Watson: Tradeoff Analytics ****//
    //=====================================//
    $scope.askWatson_TradeoffAnalytics = function()    {
        $http.get("../../../assets/cars.json").then(function(res) {
            $scope.phones = res.data;
            //console.log("PHONES: " + JSON.stringify($scope.phones));

            var data = {
                'columns': $scope.phones.columns,
                'options': $scope.phones.options,
                'subject': $scope.watson_dataset
            };
            log.info("DATA: " + JSON.stringify(data) + " " + new Date());
            /*var response = WatsonService.getWatsonResponse_tradeoff_analytics(
                $scope.askWatson_TradeoffAnalytics_SuccessHandler,
                $scope.askWatson_TradeoffAnalytics_ErrorHandler,
                data
            );*/
        });
    };

    $scope.askWatson_TradeoffAnalytics_SuccessHandler = function(response) {
        $scope.watson_answer = response;

        $log.info("WatsonController-askWatson_TradeoffAnalytics - RESPONSE: " + JSON.stringify($scope.watson_answer) + " " + new Date());
    };

    $scope.askWatson_TradeoffAnalytics_ErrorHandler = function(error) {
        $log.info("WatsonController-askWatson_TradeoffAnalytics - ERROR: " + error + " " + new Date());
    };
    
    
    // *** Watson: Speech to Text *** //
    $scope.askWatson_speechToText = function()	{
  		$log.info($scope.mytest + " Speech-To-Text " + new Date());
  		var data = {
  			'textData': $scope.watson_dataset
  		}
  		var response = WatsonService.getWatsonResponse_SpeechToText(
  			$scope.askWatson_SpeechToText_SuccessHandler,
  			$scope.askWatson_SpeechToText_ErrorHandler,
  			data
  		);
  	};

    $scope.askWatson_SpeechToText_SuccessHandler = function(response) {
  	};

  	$scope.askWatson_SpeechToText_ErrorHandler = function(error) {
  		$log.info("WatsonController - ERROR: " + error + " " + new Date());
  	};
  	
  	// *** Watson: Text to Speech *** //
    $scope.askWatson_TextToSpeech = function()	{
  		$log.info($scope.mytest + " Speech-To-Text " + new Date());
  		var data = {
  			'textData': $scope.watson_dataset
  		}
  		var response = WatsonService.getWatsonResponse_TextToSpeech(
  			$scope.askWatson_TextToSpeech_SuccessHandler,
  			$scope.askWatson_TextToSpeech_ErrorHandler,
  			data
  		);
  	};

    $scope.askWatson_TextToSpeech_SuccessHandler = function(response) {
  	};

  	$scope.askWatson_TextToSpeech_ErrorHandler = function(error) {
  		$log.info("WatsonController - ERROR: " + error + " " + new Date());
  	};
    

}]);