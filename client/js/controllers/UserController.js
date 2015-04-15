 /****************************************************************************************
 *
 *  @description ____ N/A
 *  @version ________ (.1)
 *  @date ___________ (2015)
 *
 *****************************************************************************************/
 var userController = angular.module('userController', []);

 /*********************************************
 *  CONTROLLER                            
 **********************************************/
 userController.controller('UserController', ['$scope','$state','$log','$location','$http','UserService', function ($scope,$state,$log,$location,$http,UserService) {
  	
    $log.info('User controller started running at: ' + new Date());
    $scope.message = "This message is coming from the user controller!";

    // customer type select options
    $scope.customerType = [
        'Consumer',
        'Dealership'
    ];

    // state select options
    $scope.stateList = [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming'
    ];

    // user information
    $scope.userInfo = {
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        userType: '',
        email: ''
    }


    $scope.userExists = false;
    $scope.missingData = false;
    $scope.incorrectAuth = false;
    $scope.$state = $state;

    $scope.selectVehicle = function() {
        $state.go('settings.vehicleSelect');
    };


    // **** NEW ACCOUNT CREATION ****//
    //===============================//
	$scope.createUser = function() {
        $scope.userExists = false;
        $scope.userCreated = false;
        $scope.missingData = false;

        if( $scope.userInfo.username.trim() === "" ||
            $scope.userInfo.password.trim() === "" ||
            $scope.userInfo.firstname.trim() === "" ||
            $scope.userInfo.lastname.trim() === "" ||
            $scope.userInfo.email.trim() === "") 
        {
            $scope.missingData = true;
            return;
        }

        var data = {
            'username': $scope.userInfo.username,
            'password': $scope.userInfo.password,
            'firstname': $scope.userInfo.firstname,
            'lastname': $scope.userInfo.lastname,
            'type': $scope.userInfo.userType,
            'email': $scope.userInfo.email
        };

  		var response = UserService.createUser(
  			$scope.createUser_SuccessHandler,
  			$scope.createUser_ErrorHandler,
  			data
  		);
  	};

    $scope.createUser_SuccessHandler = function(response) {
    	$log.info("CREATE USER-RESPONSE: " + JSON.stringify(response) + " " + new Date());

        if(response === "User already exists") {
            $scope.userExists = true;
        }
        else {
            window.location = "#/settings";
        }
  	};

  	$scope.createUser_ErrorHandler = function(error) {
  		$log.warn("ERROR: " + error + " " + new Date());
  	};


    // **** LOGIN VERIFICATION **** //
    //==============================//
    $scope.verifyUser = function() {
        /*** By passing login for this time ****
        $scope.incorrectAuth = false;
        
        if($scope.userInfo.username.trim() === "" || $scope.userInfo.password.trim() === "") {
            $scope.incorrectAuth = true;
            return;
        }

        var data = {
            'username': $scope.userInfo.username,
            'password': $scope.userInfo.password,
        };

        var response = UserService.verifyUser(
            $scope.verifyUser_SuccessHandler,
            $scope.verifyUser_ErrorHandler,
            data
        );
        *****************************************/
        var x = sessionStorage.length;
        while(x--) {
            var key = sessionStorage.key(x);
            sessionStorage.removeItem(key);
        }

        sessionStorage.isInteractive = "true";
    
        window.location = "#/settings";
        
    };

    $scope.verifyUser_SuccessHandler = function(response) {
        $log.info("VERIFY USER-RESPONSE: " + JSON.stringify(response) + " " + new Date());
        if(angular.isArray(response) && response.length > 0) {
            window.location = "#/settings";    
        }
        else {
            $scope.incorrectAuth = true;
            return;
        }
    };
    $scope.verifyUser_ErrorHandler = function(error) {
        $log.warn("ERROR: " + error + " " + new Date());
    };

}]);

 /*********************************************
 *  DIRECTIVES                            
 **********************************************/
 userController.directive('backButton', ['$location','$log', function ($location,$log) {
    return {
        restrict: 'E',
        template: '<button class="automotiveBtn">{{back}}</button>',
        scope: {
            back: '@back'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                $log.info("RETURN TO: " + attrs["return"] + " " + new Date());
                //$location.path("/settings");
                window.location = "#/" + attrs["return"];
            });
        }
    };
 }]);
 
 userController.directive('loading', ['$http','$log', function ($http,$log) {
    return {
        restrict: 'A',
        link: function (scope,element,attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (v) {
                if(v) {
                    element.show();
                } else {
                    element.hide();
                }
            });
        }
    };
 }]);
