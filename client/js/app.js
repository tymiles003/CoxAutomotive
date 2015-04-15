 /****************************************************************************************
 *
 *  @version (.1)
 *  @date (2015)
 *
 *****************************************************************************************/
 'use strict';

 var BmWatsonApp = angular.module('BmWatsonApp', ['ui.router','ui.bootstrap','ngResource','userController','navigationController','helpController','vehicleController','interactiveController','userService','vehicleService','bmWatsonController','bmWatsonService']);

 BmWatsonApp.config(['$stateProvider','$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('/', {
        url: '/',
        views: {
            'content': {
                templateUrl: '../templates/login.html',
                controller: 'UserController'
            }
        }
    })
    .state('createAccount', {
        url: '/createAccount',
        views: {
            'content': {
                templateUrl: '../templates/createAccount.html',
                controller: 'UserController'
            }
        }
    })
    .state('verifyUser', {
        url: '/verifyUser',
        views: {
            'content': {
                templateUrl: '../templates/login.html',
                controller: 'UserController'
            }
        }
    })
    .state('settings', {
        url: '/settings',
        abstract: true,
        views: {
            'content': {
                templateUrl: '../templates/settings.html',
                controller: 'VehicleController'
            },
            'navigation': {
                templateUrl: '../templates/navigation.html',
                controller: 'NavigationController'
            }
        }
    })
    .state('settings.vehiclePreferences', {
        url: '',
        views: {
            'content': {
                templateUrl: '../templates/user-preferences/vehiclePreferences.html',
                controller: 'VehicleController'
            }
        }
    })
    .state('settings.vehicleSelect', {
        url: '/vehicleSelect',
        views: {
            'content': {
                templateUrl: '../templates/settings/vehicleSelect.html',
                controller: 'VehicleController'
            }
        }
    })
    /*.state('userProfile.vehicleFilters', {
        url: '/vehicleFilters',
        views: {
            'content': {
                templateUrl: '../templates/user-preferences/vehicleFilters.html',
                controller: 'UserController'
            }
        }
    })*/
    .state('userProfile.userProfileAnalysis', {
        url: '/userProfileAnalysis',
        views: {
            'content': {
                templateUrl: '../templates/userProfileAnalysis.html',
                controller: 'UserController'
            },
            'navigation': {
                templateUrl: '../templates/navigation.html',
                controller: 'NavigationController'
            }
        }
    })
    .state('help', {
        url: '/help',
        views: {
            'content': {
                templateUrl: '../templates/help.html',
                controller: 'HelpController'
            },
            'navigation': {
                templateUrl: '../templates/navigation.html',
                controller: 'NavigationController'
            }
        }
    })


    // **** VEHICLE SECTION **** //
    .state('vehicle', {
        url: '/vehicle',
        abstract: true,
        views: {
            'content': {
                templateUrl: '../templates/vehicle/vehicle.html',
                controller: 'VehicleController'
            },
            'navigation': {
                templateUrl: '../templates/navigation.html',
                controller: 'NavigationController'
            }
        }
    })
    .state('vehicle.vehicleFilters', {
        url: '/vehicleFilters',
        views: {
            'content': {
                templateUrl: '../templates/vehicle/vehicleFilters.html',
                controller: 'VehicleController'
            },
            'navigation': {
                templateUrl: '../templates/navigation.html',
                controller: 'NavigationController'
            }
        }
    })
    .state('vehicle.vehicleReport', {
        url: '/vehicleReport',
        views: {
            'content': {
                templateUrl: '../templates/vehicle/vehicleReport.html',
                controller: 'VehicleController'
            },
            'navigation': {
                templateUrl: '../templates/navigation.html',
                controller: 'NavigationController'
            }
        }
    })
    .state('vehicle.vehicleEntry', {
        url: '/vehicleEntry',
        views: {
            'content': {
                templateUrl: '../templates/vehicle/vehicleEntry.html',
                controller: 'VehicleController'
            },
            'navigation': {
                templateUrl: '../templates/navigation.html',
                controller: 'NavigationController'
            }
        }
    })
    .state('vehicle.vehicleTypeSearch', {
        url: '/vehicleTypeSearch',
        views: {
            'content': {
                templateUrl: '../templates/vehicle/vehicleTypeSearch.html',
                controller: 'VehicleController'
            },
            'navigation': {
                templateUrl: '../templates/navigation.html',
                controller: 'NavigationController'
            }
        }
    })


    // **** INTERACTIVE MODE ****//
    .state('interactive', {
        url: '/interactive',
        abstract: true,
        views: {
            'content': {
                templateUrl: '../templates/interactive/interactive.html',
                controller: 'InteractiveController'
            },
            'navigation': {
                templateUrl: '../templates/navigation.html',
                controller: 'NavigationController'
            }
        }
    })
    .state('interactive.welcome', {
        url: '/welcome',
        views: {
            'content': {
                templateUrl: '../templates/interactive/welcome.html',
                controller: 'InteractiveController'
            },
            'navigation': {
                templateUrl: '../templates/navigation.html',
                controller: 'NavigationController'
            }
        }
    })


    // **** CLIENT TEST - NOT USED in Actual App **** //
    // **** DO NOT REMOVE ****//
    .state('list', {
        url: '/list',
        views: {
            'content': {
                templateUrl: '../templates/list.html'
            }
        }
    }) 
    .state('watson-qa', {
        url: '/watson-qa',
        views: {
            'content': {
                templateUrl: '../templates/watson-question-answer.html',
                controller: 'WatsonController'
            }
        }
    })
    .state('watson-ta', {
        url: '/watson-ta',
        views: {
            'content': {
                templateUrl: '../templates/watson-tradeoff-analytics.html',
                controller: 'WatsonController'
            }
        }
    })
    .state('watson-stt', {
        url:'/watson-stt',
        views: {
            'content': {
                templateUrl: '../templates/watson-speech-to-text.html',
                controller: 'WatsonController'
            }
        }
    })
    .state('watson-tts', {
        url:'/watson-tts',
        views: {
            'content': {
                templateUrl: '../templates/watson-text-to-speech.html',
                controller: 'WatsonController'
            }
        }
    })
    /*.state('createItem', {
        url: '/createItem',
        views: {
            'content': {
                templateUrl: '../templates/createItem.html'
                controller: 'ItemController'
            }
        }
    })
    .state('listItem', {
        url: '/listItem',
        views: {
            'content': {
                templateUrl: '../templates/listItem.html',
                controller: 'ItemController'
            }
        }
    })*/
    .state('getCarCriteria', {
        url: '/getCarCriteria',
        views: {
            'content': {
                templateUrl: '../templates/test/carCriteria.html',
                controller: 'VehicleController'
            }
        }
    })
    .state('fallback', {
        url: '/fallback',
        views: {
            'content': {
                templateUrl: '../templates/fallback.html'
            }
        }
    });
}]);

/*bmwatson.config(["$stateProvider", "$urlRouterProvider", 
      function($stateProvider, $urlRouteProvider) {
        $stateProvider
        .state("list", {
          url: "/list",
          templateUrl: "templates/list.html"
        })
        
        .state("fallback", {
          url: "/fallback",
          templateUrl: "templates/fallback.html"
        });

        $urlRouteProvider.otherwise("/fallback");
      }
    ]);*/
/*
CarApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {controller: ListCtrl, templateUrl: '/partials/list.html'}) 
    .when('/edit/:id', {controller: EditCtrl, templateUrl: '/partials/details.html'})
    .when('/new', {controller: CreateCtrl, templateUrl: '/partials/details.html'})
    .otherwise({redirectTo: '/'})
    $locationProvider.html5Mode(true)
})

CarApp.factory('CarsService', function($resource) {
  return $resource('/api/cars/:id', {id: '@id'}, {update: {method: 'PUT'}})
})

CarApp.filter('mileage', function() {
  return function(input) {
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
})

//http://stackoverflow.com/questions/11873570/angularjs-for-loop-with-numbers-ranges
CarApp.filter('range', function() {
  return function(input) {
      var lowBound, highBound;
      switch (input.length) {
      case 1:
          lowBound = 0;
          highBound = parseInt(input[0]) - 1;
          break;
      case 2:
          lowBound = parseInt(input[0]);
          highBound = parseInt(input[1]);
          break;
      default:
          return input;
      }
      var result = [];
      for (var i = lowBound; i <= highBound; i++)
          result.push(i);
      return result;
  };
})

CarApp.directive('formfield', function() {
  return {
    restrict: 'E', //could be E, A, C (class), M (comment)
    scope: {
      prop: '@',
      data: '=ngModel'
    },
    templateUrl: '/partials/formfield.html'
  }
})

CarApp.directive('formfield2', function() {
  return {
    restrict: 'E', //could be E, A, C (class), M (comment)
    scope: {
      prop: '@'
    },
    transclude: true,
    templateUrl: 'formfield2.html',
    replace: true
  }
})
*/

