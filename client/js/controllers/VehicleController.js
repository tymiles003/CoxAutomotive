 /****************************************************************************************
 *
 *  @description ____ N/A
 *  @version ________ (.1)
 *  @date ___________ (2015)
 *
 *****************************************************************************************/
 var vehicleController = angular.module('vehicleController', []);

 /*********************************************
 *  CONTROLLER                            
 **********************************************/
 vehicleController.controller('VehicleController', ['$scope','$log','$http','$state','$modal','VehicleService', 
    function ($scope,$log,$http,$state,$modal,VehicleService) {


    $scope.limit = 30;

    // **** VEHICLE RESULT LIST **** //
    //===============================//
    $scope.curPage = 0;
    $scope.pageSize = 5;
    $scope.numberOfPages = function() {
        return Math.ceil($scope.inventory.cars.included.length / $scope.pageSize);
    };

    // **** SLIDER CONFIG & MODAL **** //
    //=================================//
    /* slider modal toggle function */
    $scope.openSliderModal = function(name,min,max) {
        $scope.inventoryMaster = JSON.parse(sessionStorage.inventoryMaster);

        var name,min,max;
        $scope.slideConfig = [];
        $scope.slideConfig.push(name,0, $scope.initialFactorsValue[name][1]);
        var modalInstance = $modal.open({
            templateUrl: '../../templates/sliderModal.html',
            controller: 'SliderModalController',
            resolve: {
                slider: function () {
                    return $scope.slideConfig;
                },
                initialFactorsValue: function() {
                    return $scope.initialFactorsValue;
                },
                filteredFactorsValue: function() {
                    return $scope.filteredFactorsValue;
                }
            }
        });
        modalInstance.result.then(function() {
            $log.info('Modal closed at: ' + new Date());
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.showCarDetailsModal = function(car) {
        var modalInstance = $modal.open({
            templateUrl: '../../templates/carDetailsModal.html',
            controller: 'CarDetailsModalController',
            size: 'lg',
            resolve: {
                selectedCar: function() {
                    return car;
                }
            }
        });
    };
    
    // **** ANALYZE VEHICLE FACTORS ****//
    //===================================//
    $scope.factors = {
        price: false,
        fuel_eff: false,
        safety: false,
        comfort: false,
        condition: false,
        performance: false,
        selected: 0
    };

    $scope.filteredFactorsValue = {
        price: [0,1000000],
        fuel_eff: [0,100],
        safety: [0,10],
        comfort: [0,10],
        condition: [0,10],
        performance: [0,10]
    };

    $scope.initialFactorsValue = {
        price: [0,1000000],
        fuel_eff: [0,100],
        safety: [0,10],
        comfort: [0,10],
        condition: [0,10],
        performance: [0,10]
    };
    
    $scope.jsondata = "";
    $scope.inventory  = "";
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
    $scope.isLocalUpdate = false;

    
    $scope.cardata = {
        main: {
            key: "",
            make: "",
            model: "",
            submodel: "",
            year: "2014",
            name: "",
            type: "",
            values: {
                price: '',
                fuel_eff: 100,
                performance: 10,
                comfort: 10,
                condition: 1,
                safety: 10
            },
            image: ""
        },
        detail: {
            key: "",
            images: {
                main: "",
                exterior: "",
                interior: ""
            },
            details: "",
            ratings: "" 
        }
    }

    $scope.interactiveResponse = {
        ttsAnswer: '',
        ttsQuestionIndex: 1
    };


    $scope.carCriteria = "";
    $scope.carMakesModels = "";
    $scope.carModelsByMake = "";
    $scope.carEntryStatus = "";
    $scope.carsList = "";
    $scope.needDetailInfo = false;


    // =========================================================== //
    // ****** START - THIS BLOCK IS USED TO CREATE CAR DATA ****** //
    // =========================================================== //

    $scope.createCarData = function() {
        $(".loading").show();
        $scope.carEntryStatus = "";
        $scope.selectedCar.img = "";

        //console.log("createCarData - cardata: " + JSON.stringify($scope.cardata));

        var response = VehicleService.getThirdPartyCarDetails(
            $scope.createCarData_successHandler, 
            $scope.createCarData_errorHandler,
            $scope.cardata.main);
    };
    $scope.createCarData_successHandler = function(response) {
        if(angular.isArray(response.styles) && response.styles.length > 0) {
            //console.log("createCarData_successHandler - response: " + JSON.stringify(response.styles[0]));

            var carInfo = response.styles[0];
            $scope.cardata.main.name = $scope.cardata.main.make + " " + $scope.cardata.main.model;
            $scope.cardata.main.submodel = carInfo.submodel.body.toLowerCase();
            $scope.cardata.main.key = carInfo.id.toString() + "-" + new Date().getTime().toString();
            $scope.cardata.main.values.price = parseInt($scope.cardata.main.values.price);
            $scope.cardata.main.values.fuel_eff = parseInt(carInfo.MPG.city);
            $scope.cardata.main.values.condition = parseInt($scope.cardata.main.values.condition);

            if(carInfo.engine.type === "hybrid")
                $scope.cardata.main.type = "hybrid";    
            else 
                $scope.cardata.main.type = carInfo.submodel.body.toLowerCase();

            $scope.cardata.detail.key = $scope.cardata.main.key;
            $scope.cardata.detail.details = carInfo;

            var response = VehicleService.getThirdPartyCarRatings(
                $scope.getThirdPartyCarRatings_successHandler, 
                $scope.getThirdPartyCarRatings_errorHandler,
                $scope.cardata.main);
        }
        else {
            $(".loading").hide();
            $scope.carEntryStatus = "There is not enough information to generate the selected car. Try update your input criteria.";
        }
    };

    $scope.createCarData_errorHandler = function(err) {
        $(".loading").hide();
        console.log("createCarData_errorHandler - err: " + err);
    };

    $scope.getThirdPartyCarRatings_successHandler = function(response) {
        if(angular.isArray(response.ratings)) {
            var ratingInfo = response.ratings;

            $scope.cardata.detail.ratings = ratingInfo;
            var scoreBraking = 0;
            var scoreHandling = 0;
            var scoreBuild = 0;

            for(var x=0; x < ratingInfo.length; x++) {
                switch(ratingInfo[x].title) {
                    case "Performance":
                        $scope.cardata.main.values.performance = ratingInfo[x].score;

                        //Get the Braking and Handling scores
                        for(var z=0; z < ratingInfo[x].subRatings.length; z++) {
                            switch(ratingInfo[x].subRatings[z].title) {
                                case "Braking":
                                    scoreBraking = ratingInfo[x].subRatings[z].score;
                                    break;

                                case "Handling":
                                    scoreHandling = ratingInfo[x].subRatings[z].score;
                                    break;                                    
                            }
                        }
                        break;

                    case "Comfort":
                        $scope.cardata.main.values.comfort = ratingInfo[x].score;
                        break;

                    case "Value":
                        //$scope.cardata.main.values.safety = ratingInfo[x].score;
                        for(var y=0; y < ratingInfo[x].subRatings.length; y++) {
                            switch(ratingInfo[x].subRatings[y].title) {
                                case "Build Quality (vs. $)":
                                    scoreBuild = ratingInfo[x].subRatings[y].score;
                                    break;
                            }
                        }

                        break;
                }
            }

            //console.log("braking="+scoreBraking+"|handling="+scoreHandling+"|build="+scoreBuild);
            $scope.cardata.main.values.safety = (scoreBraking+scoreBuild+scoreHandling)/3;

            var response = VehicleService.getThirdPartyCarPhotos(
                $scope.getThirdPartyCarPhotos_successHandler, 
                $scope.getThirdPartyCarPhotos_errorHandler,
                $scope.cardata.main)
        }
        else {
            $(".loading").hide();
            $scope.carEntryStatus = "There is not enough information to generate the selected car. Try update your input criteria.";
        }
    };

    $scope.getThirdPartyCarRatings_errorHandler = function(err) {
        $(".loading").hide();
        $scope.carEntryStatus = "There is no car ratings information for the selected car. Try update your input criteria.";
    };

    $scope.getThirdPartyCarPhotos_successHandler = function(response) {
        var photoId = "";
        var posId = 0;
        var interior = [];
        var exterior = [];
        var isMainAcquired = false;

        if(angular.isArray(response) && response.length > 0) {
            for(var x=0; x < response.length; x++) {
                posId = response[x].id.search($scope.cardata.main.make.toLowerCase());
                photoId = response[x].id.substring(posId);

                switch(response[x].subType) {
                    case "exterior":
                        exterior.push("http://media.ed.edmunds-media.com/"+photoId+"_600.jpg");

                        if(response[x].shotTypeAbbreviation === "FQ" && isMainAcquired === false)   {
                            isMainAcquired = true;
                            $scope.cardata.detail.images.main = "http://media.ed.edmunds-media.com/"+photoId+"_600.jpg";
                            $scope.cardata.main.image = "http://media.ed.edmunds-media.com/"+photoId+"_600.jpg";
                        }
                        break;

                    case "interior":
                        interior.push("http://media.ed.edmunds-media.com/"+photoId+"_600.jpg");
                        break;
                }
            }

            $scope.cardata.detail.images.exterior = exterior;
            $scope.cardata.detail.images.interior = interior;

            var response = VehicleService.saveCarData(
                $scope.saveCarData_successHandler, 
                $scope.saveCarData_errorHandler,
                $scope.cardata)
        }
        else {
            $(".loading").hide();
            $scope.carEntryStatus = "There is not enough information to generate the selected car. Try update your input criteria.";
        }
    };

    $scope.getThirdPartyCarPhotos_errorHandler = function(err) {
        $(".loading").hide();
        $scope.carEntryStatus = "There is no photos available for the selected car. Try update your input criteria.";
    };

    $scope.saveCarData_successHandler = function(response) {
        $(".loading").hide();
        if(response.result != undefined) {
            $scope.selectedCar.id = response.result.key;
            $scope.selectedCar.img = response.result.image;
            $scope.carEntryStatus = "Car data is stored successfully";
        }
        else
            $scope.carEntryStatus = "There is not enough information to generate the selected car. Try update your input criteria.";
    };

    $scope.saveCarData_errorHandler = function(err) {
        $(".loading").hide();
        console.log("saveCarData_errorHandler - err: " + err);
        $scope.carEntryStatus = "There is not enough information to generate the selected car. Try update your input criteria.";
    };

    // ========================================================= //
    // ****** END - THIS BLOCK IS USED TO CREATE CAR DATA ****** //
    // ========================================================= //



    $scope.getCarMakesModels = function() {
        $http.get('../assets/car-makes-models-list.json').success(function(data) {
            $scope.carMakesModels = data;
        });
    };

    $scope.getCarModelsByMake = function() {
        $scope.carEntryStatus = "";
        $scope.cardata.main.values.price = "";
        $scope.selectedCar.img = "";

        var result = $.grep($scope.carMakesModels, function(data) { 
            return data.title == $scope.cardata.main.make; 
        });

        $scope.carModelsByMake = result;
    }

    $scope.setPrefences = function() {

        $http.get('../assets/cars_criteria.json').success(function(data) {
            
            sessionStorage.factors = JSON.stringify($scope.factors);
            $scope.setSessionPreference(data);    
            
        });
    };

    $scope.setSessionPreference = function(data) {
        $scope.factors.selected = 0;

        for(var x=0; x < data.columns.length; x++) {
            if(data.columns[x].key === "price") {
                data.columns[x]["is_objective"] = $scope.factors.price;
                $scope.factors.selected = $scope.factors.price === true ? $scope.factors.selected+=1 : $scope.factors.selected;
            }
            else if(data.columns[x].key === "fuel_eff") {
                data.columns[x]["is_objective"] = $scope.factors.fuel_eff;
                $scope.factors.selected = ($scope.factors.fuel_eff === true) ? $scope.factors.selected+=1 : $scope.factors.selected;
            }
            else if(data.columns[x].key === "safety") {
                data.columns[x]["is_objective"] = $scope.factors.safety;
                $scope.factors.selected = ($scope.factors.safety === true) ? $scope.factors.selected+=1 : $scope.factors.selected;
            }
            else if(data.columns[x].key === "comfort") {
                data.columns[x]["is_objective"] = $scope.factors.comfort;
                $scope.factors.selected = ($scope.factors.comfort === true) ? $scope.factors.selected+=1 : $scope.factors.selected;
            }
            else if(data.columns[x].key === "condition") {
                data.columns[x]["is_objective"] = $scope.factors.condition;
                $scope.factors.selected = ($scope.factors.condition === true) ? $scope.factors.selected+=1 : $scope.factors.selected;
            }
            else if(data.columns[x].key === "performance") {
                data.columns[x]["is_objective"] = $scope.factors.performance;
                $scope.factors.selected = ($scope.factors.performance === true) ? $scope.factors.selected+=1 : $scope.factors.selected;
            } 
        }

        if($scope.factors.selected < 2) {
            alert("Please select at least two preferences")
             $(".loading").hide();
            return false;
        }
        else    {
            $(".loading").show();
            sessionStorage.carsList = JSON.stringify(data);
            sessionStorage.carPreference = JSON.stringify($scope.factors);

            if(sessionStorage.inventory == undefined)
                $state.go('settings.vehicleSelect');    
            else
                $scope.getInventoryAnalysis();
        }
    }    

    $scope.updateFactors = function(factorName, value) {
        $scope.curPage = 0;
        $scope.isLocalUpdate = true;
        $log.info("Set " + factorName + ": " + value);

        $scope.factors = JSON.parse(sessionStorage.carPreference);
        $scope.factors[factorName] = value;

        $scope.setSessionPreference($scope.carsList);

        //console.log("updateFactors-$scope.carsList ==|"+JSON.stringify($scope.carsList)+"|==");
        
    };

    $scope.updateSessionInventory = function() {
        $scope.getCarBasicInfo();

        $scope.noInventoryMsg = "";
        
        if(sessionStorage.factors != undefined) {
            $scope.factors = JSON.parse(sessionStorage.factors);
        }

        if(sessionStorage.carsList != undefined && sessionStorage.carsList != "") {
            $scope.carsList = JSON.parse(sessionStorage.carsList);

            //This is to handle interactive mode
            $scope.interactiveResponse.ttsQuestionIndex = 7;
        }

        if(sessionStorage.inventory != undefined)
            $scope.inventory = JSON.parse(sessionStorage.inventory);

        if($scope.inventory.cars != undefined && $scope.inventory.cars.included.length > 0) {
            $scope.selectedCar.id = $scope.inventory.cars.included[0].id;
            $scope.getSelectedCar($scope.selectedCar.id);
        }
        else
            $scope.noInventoryMsg = "There is no car in our inventory matches your criteria";

        if(sessionStorage.initialFactorsValue != undefined && sessionStorage.initialFactorsValue != "") 
            $scope.initialFactorsValue = JSON.parse(sessionStorage.initialFactorsValue);
        
        if(sessionStorage.filteredFactorsValue != undefined && sessionStorage.filteredFactorsValue != "") 
            $scope.filteredFactorsValue = JSON.parse(sessionStorage.filteredFactorsValue);
    };


    $scope.filterByPreferenceValue = function(preferenceType, valueMin, valueMax) {
        $scope.filteredFactorsValue[preferenceType] = [valueMin, valueMax];
        var json = JSON.parse(sessionStorage.inventoryMaster);

        var queryStatement = "select * from json.cars.included where " +
            "(values.price>="+$scope.filteredFactorsValue.price[0]+" && values.price<="+$scope.filteredFactorsValue.price[1]+" && " +
            "values.fuel_eff>="+$scope.filteredFactorsValue.fuel_eff[0]+" && values.fuel_eff<="+$scope.filteredFactorsValue.fuel_eff[1]+" && " +
            "values.safety>="+$scope.filteredFactorsValue.safety[0]+" && values.safety<="+$scope.filteredFactorsValue.safety[1]+" && " +
            "values.comfort>="+$scope.filteredFactorsValue.comfort[0]+" && values.comfort<="+$scope.filteredFactorsValue.comfort[1]+" && " +
            "values.condition>="+$scope.filteredFactorsValue.condition[0]+" && values.condition<="+$scope.filteredFactorsValue.condition[1]+" && " +
            "values.performance>="+$scope.filteredFactorsValue.performance[0]+" && values.performance<="+$scope.filteredFactorsValue.performance[1]+")";

        var carsIncludedList = jsonsql.query(queryStatement, json);

        $scope.inventory.cars.included = carsIncludedList;
        sessionStorage.inventory = JSON.stringify($scope.inventory);
        sessionStorage.filteredFactorsValue = JSON.stringify($scope.filteredFactorsValue);

        $scope.updateSessionInventory();
    }

    $scope.setSelectedCarTypes = function() {
        if($scope.selectedCar.options.coupe)
            $scope.selectedCar.type.push('coupe');

        if($scope.selectedCar.options.truck)
            $scope.selectedCar.type.push('truck');

        if($scope.selectedCar.options.sedan)
            $scope.selectedCar.type.push('sedan');

        if($scope.selectedCar.options.suv)
            $scope.selectedCar.type.push('suv');

        if($scope.selectedCar.options.minivan)
            $scope.selectedCar.type.push('minivan');
        
        if($scope.selectedCar.options.wagon)
            $scope.selectedCar.type.push('wagon');

        if($scope.selectedCar.options.sports)
            $scope.selectedCar.type.push('sports');

        if($scope.selectedCar.options.convertible)
            $scope.selectedCar.type.push('convertible');

        if($scope.selectedCar.options.hybrid)
            $scope.selectedCar.type.push('hybrid');

        if($scope.selectedCar.options.luxury)
            $scope.selectedCar.type.push('luxury');

        if($scope.selectedCar.options.crossover)
            $scope.selectedCar.type.push('crossover');

        if($scope.selectedCar.options.electric)
            $scope.selectedCar.type.push('electric');
    }

    $scope.showCarDetail = function() {
        $scope.getSelectedCar();
        $scope.needDetailInfo = true;
    }

    
    // **** Get Car General Info **** //
    // =================================
    $scope.getCarBasicInfo = function(){
        if(sessionStorage.carsList != undefined && sessionStorage.inventory != undefined) {
            var json = JSON.parse(sessionStorage.carsList);
            var inventory = JSON.parse(sessionStorage.inventory);
            //console.log("json.options ===|" + JSON.stringify(json.options) + "|==");
            for(var x = 0; x < inventory.cars.included.length; x++) {
                var queryStatement = "select * from json.options where (key=='" + inventory.cars.included[x].id +"')";
                var carBasicInfo = jsonsql.query(queryStatement, json);  

                inventory.cars.included[x].year = carBasicInfo[0].year;
                inventory.cars.included[x].image = carBasicInfo[0].image;
            };

            sessionStorage.inventory = JSON.stringify(inventory);    
        }
    };

    
    // **** Get Car Details by ID **** //
    // =============================== //
    $scope.getSelectedCar = function(){

        var response = VehicleService.getCarDetails(
            $scope.getCarDetails_successHandler, 
            $scope.getCarDetails_errorHandler,
            $scope.selectedCar.id);
    };

    $scope.getCarDetails_successHandler = function(response) {
        $scope.selectedCar.carInfo = response;
        //console.log("getCarDetails_successHandler - response: " + JSON.stringify($scope.selectedCar.carInfo));
        if($scope.needDetailInfo) {
            $scope.showCarDetailsModal($scope.selectedCar.carInfo);
            $scope.needDetailInfo = false;    
        }
        
    };

    $scope.getCarDetails_errorHandler = function(err) {
        console.log("getCarDetails_errorHandler - err: " + err);
    };


    // **** Get Car by Type **** //
    // ========================= //
    $scope.getCarsByType = function() {
        $scope.setSelectedCarTypes()
        
        $(".loading").show();

        var response = VehicleService.getCarsByType(
            $scope.getCarsByType_SuccessHandler,
            $scope.getCarsByType_ErrorHandler,
            $scope.selectedCar
        );
    };

    $scope.getCarsByType_SuccessHandler = function(response) {
        // This step is only needed if we are running test page.  
        // sessionStorage should have been set when users select the preferences
        if(sessionStorage.carsList === undefined || sessionStorage.carsList.trim().length == 0) {
            $http.get('../assets/cars_criteria.json').success(function(data) {
                sessionStorage.carsList = JSON.stringify(data);
            });
        }
        
        $scope.carsList = JSON.parse(sessionStorage.carsList);
        $scope.carsList.options = response;

        sessionStorage.carsList = JSON.stringify($scope.carsList);
        $scope.getInventoryAnalysis();

    };
    $scope.getCarsByType_ErrorHandler = function(error) {
        $log.warn("getCarsByType_ErrorHandler - err: " + error + " " + new Date());
    };


    $scope.getInventoryAnalysis = function() {
        var response = VehicleService.getInventoryAnalysis(
            $scope.getInventoryAnalysis_SuccessHandler,
            $scope.getInventoryAnalysis_ErrorHandler,
            $scope.carsList
        );
    }

    $scope.getInventoryAnalysis_SuccessHandler = function(response) {
         if(JSON.stringify(response).trim().length > 0) {
 
            //inventory_master will hold original data from Watson.
            //At first execution, inventory and inventory_master contain same data.
            //As users filter the preference by values, inventory_master will be the source data and inventory will have a filtered data
            sessionStorage.inventoryMaster = JSON.stringify(response);
            sessionStorage.inventory = JSON.stringify(response);

            $scope.inventory = response;

            for(var x = 0; x < $scope.inventory.factorOptions.optIn.length; x++) {
                switch($scope.inventory.factorOptions.optIn[x].name) {
                    case "price":
                        $scope.initialFactorsValue.price = $scope.inventory.factorOptions.optIn[x].range;
                        $scope.filteredFactorsValue.price = $scope.inventory.factorOptions.optIn[x].range;
                        break;

                    case "fuel_eff":
                        $scope.initialFactorsValue.fuel_eff = $scope.inventory.factorOptions.optIn[x].range;
                        $scope.filteredFactorsValue.fuel_eff = $scope.inventory.factorOptions.optIn[x].range;
                        break;

                    case "safety":
                        $scope.initialFactorsValue.safety = $scope.inventory.factorOptions.optIn[x].range;
                        $scope.filteredFactorsValue.safety = $scope.inventory.factorOptions.optIn[x].range;
                        break;

                    case "comfort":
                        $scope.initialFactorsValue.comfort = $scope.inventory.factorOptions.optIn[x].range;
                        $scope.filteredFactorsValue.comfort = $scope.inventory.factorOptions.optIn[x].range;
                        break;

                    case "condition":
                        $scope.initialFactorsValue.condition = $scope.inventory.factorOptions.optIn[x].range;
                        $scope.filteredFactorsValue.condition = $scope.inventory.factorOptions.optIn[x].range;
                        break;

                    case "performance":
                        $scope.initialFactorsValue.performance = $scope.inventory.factorOptions.optIn[x].range;
                        $scope.filteredFactorsValue.performance = $scope.inventory.factorOptions.optIn[x].range;
                        break;
                }
            }
            
            // InitialFactorsValue = initial preference value set by Watson TA            
            sessionStorage.initialFactorsValue = JSON.stringify($scope.initialFactorsValue);

            // Preference values that are changed as users move the sliders in the report
            sessionStorage.filteredFactorsValue = JSON.stringify($scope.filteredFactorsValue);


            $(".loading").hide();
            //$log.info("GET INVENTORY-RESPONSE: " + sessionStorage.inventory + " " + new Date());
            if($scope.isLocalUpdate)    {
                $scope.updateSessionInventory();
                $scope.isLocalUpdate = false;
            }
            else    
                $state.go('vehicle.vehicleReport');
        }
        else {
            $(".loading").hide();
            $log.error("NO CAR IN INVENTORY");
            return;
        }
    };
    $scope.getInventoryAnalysis_ErrorHandler = function(error) {
        $(".loading").hide();
        $log.warn("ERROR INVOKING TRADEOFF ANALYTICS: " + JSON.stringify(error) + " " + new Date());
    };


    // *********** INTERACTIVE MODE *********** //
    // ======================================== //
    $scope.captureResponse = function() {
        var regex = /[yY]e?ea?[shp]?|[sS](?:ure|h[ea](re|er))|[oO]k|[aA]bsolute(ly)?|([oO]f\s)?[cC]ourse|[cC]ertain|[fF]ine|[dD]efinite|[pP]ositive/
        var response = $scope.interactiveResponse.ttsAnswer;
        
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
                    var reCancel = /[cC](a|ou)n\s?[cs][oe]l?|[kK][ie]n[dz]o?|[pP]encil/
                    var reSUV = /[sS]\s?[yY]?o?[uU]\s?([vVbB]i?|fee)|[sS]port[s]?\s[Uu]tility\s[Vv]ehicle[s]?|[yY]es\s[yY]ou\s(?:[bB]e|[vV])|[yY]es\s[uU][vV]|[aA]s\s[yY]ou*\s[bB]e/
                    var reVan = /([mM](in[ia]|e?ai?n(?:ing|y)))?\s?e?[vVbB][ae]n[tn]?|[fF](?:rien|[ia]ne?)d?/
                    var reHybrid = /[hH]\s?[iy](gh)?\s?be?r?([ia]|ea|[eu]e?)([dt][th]?e?|ck)?\s?(it)?/
                    var reSedan = /[sS]([aeo]i?|ome|it|houl)\s?[td]\s?t?[hd]?([oae]|ow)[mn]e?/
                    var reNext = /[nNlLmM][aei]([kcxg][etk]?s?|x)/

                    //console.log("ttsQuestionIndex 7 - answer = " + response);
                    if(reSUV.test(response)) 
                        $scope.selectedCar.options.suv = (reCancel.test(response)) ? false : true;
                    
                    if(reSedan.test(response))
                        $scope.selectedCar.options.sedan = (reCancel.test(response)) ? false : true;

                    if(reHybrid.test(response))
                        $scope.selectedCar.options.hybrid = (reCancel.test(response)) ? false : true;

                    if(reVan.test(response))
                        $scope.selectedCar.options.minivan = (reCancel.test(response)) ? false : true;

                    if(reNext.test(response))   {
                        $('.micButton').trigger("click");
                        $scope.getCarsByType();
                    }

                    break;
            }

            if($scope.interactiveResponse.ttsQuestionIndex < 6) {
                $("#txtTtsQuestionIndex").val(parseInt($scope.interactiveResponse.ttsQuestionIndex) + 1);
                $("#txtTtsQuestionIndex").trigger("input");
                $("#btnNext").trigger("click");
                $("#ttsSpeak").trigger("click");
            }
            else if($scope.interactiveResponse.ttsQuestionIndex == 6) {
                sessionStorage.factors = JSON.stringify($scope.factors);
                $scope.setPrefences();
            }
        }
    }

    $scope.$on('filterByPreferenceEvent', function(event, preferenceType, range) {
        console.log("receiving event - pref="+preferenceType+"|min="+range[0]+"|max="+range[1]);
        $scope.filterByPreferenceValue(preferenceType, range[0], range[1]);
    });

    $scope.updateSessionInventory();
    $scope.getCarMakesModels();
}])

.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
            for (var i=0; i<total; i++)
                input.push(i);
    
        return input;
    };
})

.filter('pagination', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    };
});

/*********************************************
*  SLIDER MODAL CONTROLLER                          
**********************************************/
vehicleController.controller('SliderModalController', ['$scope','$log','$modalInstance','slider','initialFactorsValue','filteredFactorsValue','VehicleService',
    function ($scope,$log,$modalInstance,slider,initialFactorsValue,filteredFactorsValue,VehicleService) {
        $scope.slider = slider;
        $scope.selected = {
            name: $scope.slider[0],
            min: filteredFactorsValue[$scope.slider[0]][0],
            max: initialFactorsValue[$scope.slider[0]][1]
        };
        /* slider configuration */
        //MIN and MAX of possible sliders value
        $scope.sliderConfig = {
            min: initialFactorsValue[$scope.slider[0]][0],
            max: initialFactorsValue[$scope.slider[0]][1],
            step: 1
        };
        $scope.currentRange = [filteredFactorsValue[$scope.selected.name][0], filteredFactorsValue[$scope.selected.name][1]];
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.updateValues = function (preferenceType, range) {
            VehicleService.sendFilterByPreferenceRequest(preferenceType, range);
        }
    
 }]);

 /*********************************************
 *  CAR DETAILS MODAL CONTROLLER                         
 **********************************************/
 vehicleController.controller('CarDetailsModalController', ['$scope','$modalInstance','selectedCar', 
    function ($scope,$modalInstance,selectedCar) {
    $scope.selectedCar = selectedCar;
    $scope.specs = $scope.selectedCar.specs; 
    $scope.mainImg = $scope.specs.images.main;
    $scope.intImg = $scope.specs.images.interior;
    $scope.extImg = $scope.specs.images.exterior;
    $scope.photos = [];
    $scope.photos.push($scope.mainImg);
    angular.forEach($scope.intImg, function (value,key) {
        $scope.photos.push(value);
    });
    angular.forEach($scope.extImg, function (value,key) {
        $scope.photos.push(value);
    });
    $scope._Index = 0;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };
    $scope.previous = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
    };
    $scope.next = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
    };
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };
 }]);

/*********************************************
*  DIRECTIVES                          
**********************************************/
vehicleController.directive('slider', ['$log', function ($log) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            config: "=config",
            currentRange: "=model"
        },
        link: function(scope, elem, attrs) {
            var setModel = function(value) {
                scope.model = value;   
            }
            
            $(elem).slider({
                range: true,
                values: [scope.currentRange[0],scope.currentRange[1]],
                min: scope.config.min,
                max: scope.config.max,
                step: 1,
                slide: function(event, ui) { 
                    var delay = function() {
                        var min = angular.element('#min');
                        var max = angular.element('#max');
                        var handle = angular.element('index.uiSliderHandle');
                        var handleIndex = $(ui.handle).data(handle);
                        var label = handleIndex == 0 ? min : max;
                        $(label).html(ui.value).position({
                            my: 'center top',
                            at: 'center bottom',
                            of: ui.handle,
                            offset: "0, 10"
                        });
                    };

                    // wait for the ui.handle to set its position
                    setTimeout(delay, 5);
                    scope.$apply(function() {
                        scope.currentRange = [ui.values[0],ui.values[1]];
                    });
                }
            });
        }
    };
 }]);

