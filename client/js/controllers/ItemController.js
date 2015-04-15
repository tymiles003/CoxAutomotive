 /****************************************************************************************
 *
 *  @description ____ N/A
 *  @version ________ (.1)
 *  @date ___________ (2015)
 *
 *****************************************************************************************/
 var bmItemController = angular.module('bmItemController', []);

 /*********************************************
 *  CONTROLLER                            
 **********************************************/
 bmItemController.controller('ItemController', ['$scope','$http','$log','ItemService', function ($scope,$http,$log,ItemService) {
    
    /*
    $http.get('/items').success(function(body) {
    	console.log(body[0].attributes.name);
    	$scope.items = body;
  	});
    */

  $log.info('Item controller started running at: ' + new Date());
  $scope.myitem = "";
  $scope.itemList = "";
  $scope.testMyItem = "Otong";

  $scope.saveItem = function () {
  		var data = {
  			'item': $scope.myitem
  		};
  		var response = ItemService.saveItem(
  			$scope.saveItem_SuccessHandler,
  			$scope.saveItem_ErrorHandler,
  			data
  		);
  	};

    $scope.saveItem_SuccessHandler = function (response) {
    	$log.info("saveItem-RESPONSE: " + response + " " + new Date());
        $log.info("array length: " + response.length + " " + new Date());
        $scope.myitem = "";
        $scope.listItem();
  	};

  	$scope.saveItem_ErrorHandler = function (error) {
  		$log.warn("ERROR: " + error + " " + new Date());
  	};

  	$scope.listItem = function () {
  		$log.info("GETTING LIST of ITEMS ... " + new Date());
  		var response = ItemService.listItem($scope.listItem_SuccessHandler,	$scope.listItem_ErrorHandler);
  	};

    $scope.listItem_SuccessHandler = function (response) {
    	$scope.itemList = [];
    	if (angular.isArray(response) && response.length > 0) {
    		$log.info("COPY RESPONSE ARRAY TO ITEMLIST - " + new Date());
    		$scope.itemList = response;
    		$log.info(JSON.stringify($scope.itemList[0].attributes.item) + " " + new Date());
    	}
    	$scope.testMyItem = "Sapi";
    	$log.info("$scope.itemList-RESPONSE: " + JSON.stringify($scope.itemList) + " " + new Date());
        $log.info("array length: " + $scope.itemList.length + " " + new Date());
  	};

  	$scope.listItem_ErrorHandler = function (error) {
  		$log.warn("ERROR: " + error + " " + new Date());
  	};
  	$scope.listItem();
    
}]);