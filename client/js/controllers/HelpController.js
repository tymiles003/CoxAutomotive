 /****************************************************************************************
 *
 *  @description ____ N/A
 *  @version ________ (.1)
 *  @date ___________ (2015)
 *
 *****************************************************************************************/
 var helpController = angular.module('helpController', []);

 /*********************************************
 *  CONTROLLER                            
 **********************************************/
 helpController.controller('HelpController', ['$scope','$log', function ($scope,$log) {

 	$log.info('Help controller started running at: ' + new Date());
    $scope.message = "This message is coming from the help controller!";
    
 }]);