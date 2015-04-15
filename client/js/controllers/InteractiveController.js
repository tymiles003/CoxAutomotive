 /****************************************************************************************
 *
 *  @description ____ N/A
 *  @version ________ (.1)
 *  @date ___________ (2015)
 *
 *****************************************************************************************/
 var interactiveController = angular.module('interactiveController', [])

 /*********************************************
 *  CONTROLLER                            
 **********************************************/
 interactiveController.controller('InteractiveController', ['$scope','$log', function ($scope,$log) {

	$scope.mytest = "Inside InteractiveController";

	//$scope.ttsQuestionIndex = 1;
	//$scope.ttsAnswer = "";

	$scope.interactiveResponse = {
		ttsAnswer: 'dummy',
		ttsQuestionIndex: 1
	};

	$scope.factors = {
		price: false,
		fuel_eff: false,
		safety: false,
		performance: false,
		condition: false,
		comfort: false
	}

	$scope.selectedCar = {
    	id: "",
        type: [],
        options: {
            coupe: false,
            truck: false,
            sedan: false,
            suv: false,
            minivan: false,
            wagon: false,
            sports: false,
            convertible: false,
            hybrid: false,
            luxury: false,
            crossover: false,
            electric: false
        },
    	img: "",
        carInfo: ""
    };

	$scope.captureResponse = function() {
		var regex = /[yY]e?ea?[shp]/
		var response = $scope.interactiveResponse.ttsAnswer;
		console.log("captureResponse - question = |" + $scope.interactiveResponse.ttsQuestionIndex + "|");
		console.log("captureResponse - answer = |" + response + "|");

		if(sessionStorage.isInteractive === "true") {
			switch(parseInt($scope.interactiveResponse.ttsQuestionIndex)) {
				case 1:
					$scope.factors.price = regex.test(response) ? true : false;
					break;	

				case 2:
					$scope.factors.fuel_eff = regex.test(response) ? true : false;
					break;

				case 3:
					$scope.factors.safety = regex.test(response) ? true : false;
					break;

				case 4:
					$scope.factors.performance = regex.test(response) ? true : false;
					break;

				case 5:
					$scope.factors.condition = regex.test(response) ? true : false;
					break;

				case 6:
					$scope.factors.comfort = regex.test(response) ? true : false;
					break;

				case 7:
					reSUV = /[sS][uU][vV]|[sS]port[s]?\s[Uu]tility\s[Vv]ehicle[s]?|[yY]es\s[yY]ou\s(?:[bB]e|[vV])|[yY]es\s[uU][vV]|[aA]s\s[yY]ou*\s[bB]e/
					$scope.selectedCar.options.suv = reSUV.test(response) ? true : false;
					$scope.selectedCar.options.sedan = /[sS]edan/.test(response) ? true : false;
					$scope.selectedCar.options.hybrid = /[hH]ybrid/.test(response) ? true : false;
					$scope.selectedCar.options.minivan = /[mM]ini?[vV]an|[vV]an/.test(response) ? true : false;
					break;
			}

			if($scope.interactiveResponse.ttsQuestionIndex < 7) {
				$("#txtTtsQuestionIndex").val(parseInt($scope.interactiveResponse.ttsQuestionIndex) + 1);
				$("#txtTtsQuestionIndex").trigger("input");
				$("#btnNext").trigger("click");
				$("#ttsSpeak").trigger("click");
			}
			else {
				sessionStorage.carPreference = JSON.stringify($scope.factors);
				sessionStorage.selectedCar = JSON.stringify($scope.selectedCar);
			}
		}
			


		console.log("captureResponse - ttsQuestionIndex = " + $("#txtTtsQuestionIndex").val());
		console.log("captureResponse - factors: " + JSON.stringify($scope.factors));
		console.log("captureResponse - selectedCar.options: " + JSON.stringify($scope.selectedCar.options));
		
	}

	
}]);