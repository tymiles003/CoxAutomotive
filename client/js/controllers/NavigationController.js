 /****************************************************************************************
 *
 *  @description ____ this controller handles the navigation menu
 *  @version ________ (.1)
 *  @date ___________ (2015)
 *
 *****************************************************************************************/
 var navigationController = angular.module('navigationController', []);

 /*********************************************
 *  CONTROLLER                            
 **********************************************/
 navigationController.controller('NavigationController', ['$scope','$state','$log', function ($scope,$state,$log) {
 	$scope.isInteractive = "";

 	if(sessionStorage.isInteractive != undefined)
 		$scope.isInteractive = (sessionStorage.isInteractive == "false") ? false : true;

 	$scope.toggleInteractive = function() {
 		if(sessionStorage.isInteractive != undefined)
 			sessionStorage.isInteractive = (sessionStorage.isInteractive === "true") ? false : true;
 		else
 			sessionStorage.isInteractive = "false";

 		$scope.isInteractive = (sessionStorage.isInteractive == "false") ? false : true;
 		
 		if($('.audio')[0] != undefined) {
 			if(sessionStorage.isInteractive == "false") 
			    $('.audio')[0].pause();
	 		else 
	 			$('.audio')[0].play();
 		}
 	}

 	$scope.resetPreference = function() {
 		var x = sessionStorage.length;

        while(x--) {
            var key = sessionStorage.key(x);

            if(key !== "isInteractive") {
            	sessionStorage.removeItem(key);	
            }
        }

        $state.go("settings.vehiclePreferences");
 	}

 }]);