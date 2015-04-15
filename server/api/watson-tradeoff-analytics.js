var url                 = require("url"),
    https               = require('https'),
    extend              = require('util')._extend,
    TradeoffAnalytics   = require('./tradeoff-analytics'),
    watsonUtility       = require("../utility/watsonUtility");

var getCredentials = function(req, res) {
    var service_name = 'tradeoff_analytics';

    if (process.env.VCAP_SERVICES) {
        var vcapObj = watsonUtility.getVCAPObject();

        if (vcapObj[service_name]) {
            var svc = vcapObj[service_name][0].credentials;

            req.service.url = svc.url;
            req.service.username = svc.username;
            req.service.password = svc.password;

            req.logger.info("Loading VCAP_SERVICES-" + service_name + " from PROCESS.ENV: " + JSON.stringify(req.service));
        } 
        else {
            req.logger.info("The service " + service_name + " is not in the VCAP_SERVICES, did you forget to bind it?");
        }
    } 
    else {
        req.logger.info("No VCAP_SERVICES-" + service_name + " found in ENV, using defaults for local development");

        //**** Parse Watson Service Credentials ****/
        var watson_svc_credentials = watsonUtility.getCredentials("tradeoff_analytics");
        req.service.url = watson_svc_credentials.url;
        req.service.username = watson_svc_credentials.username;
        req.service.password = watson_svc_credentials.password;

        req.logger.info("Loading VCAP_SERVICES-" + service_name + " from LOCAL: " + JSON.stringify(req.service));
    }

    req.logger.info('SERVICE_URL = ' + req.service.url);
    req.logger.info('SERVICE_USERNAME = ' + req.service.username);
    req.logger.info('SERVICE_PASSWORD = ' + new Array(req.service.password.length).join("X"));

    return req.service;
}

var extractInventory_INCLUDED = function(data) {
    var watsonAnalysis = {};

    var reports = {};
    reports.excluded = [];
    reports.included = [];

    
    //Find which inventory data is being suggested by Watson (not EXCLUDED)
    var solutions = data.resolution.solutions;

    for(var x=0; x < solutions.length; x++) {
        if(solutions[x].status === "EXCLUDED") {
            console.log("solutions[x].solution_ref.trim() -excluded = |" + solutions[x].solution_ref.trim() +"|");
            reports.excluded.push(solutions[x].solution_ref.trim());
        }
        else {
            console.log("solutions[x].solution_ref.trim()-included = |" + solutions[x].solution_ref.trim() +"|");
            reports.included.push(solutions[x].solution_ref.trim());  
        }
    }

    reports.excluded = watsonUtility.sortArray(reports.excluded);
    reports.included = watsonUtility.sortArray(reports.included);

    //TODO: store inventory in database and do query to find this information
    //Get the value of determining factor for each INCLUDED inventory (ie price=999, fuel_eff=15)
    var inventory = data.problem.options;
    var temp = ""; 
    var range = {};
    range.price = [];
    range.fuel_eff = [];
    range.performance = [];
    range.comfort = [];
    range.condition = [];
    range.safety = [];
    range.winter = [];
    
    var cars = {};
    cars.excluded = [];
    cars.included = [];

    var hasSelected = false;
    for(var z=0; z < inventory.length; z++) {
        temp = {};
       
        temp.id = inventory[z].key.trim();
        temp.name = inventory[z].name;
        temp.values = inventory[z].values;    
        temp.description_html = inventory[z].description_html;

        temp.selected = "";

        if(reports.included.search(inventory[z].key.trim()) != -1) {
            range.price.push(parseInt(inventory[z].values.price));
            range.fuel_eff.push(parseInt(inventory[z].values.fuel_eff));
            range.performance.push(parseInt(inventory[z].values.performance));
            range.comfort.push(parseInt(inventory[z].values.comfort));
            range.condition.push(parseInt(inventory[z].values.condition));
            range.safety.push(parseInt(inventory[z].values.safety));
            
            temp.INCLUDED = true;
            
            if(!hasSelected)    {
                temp.selected = "checked";
                hasSelected = true;
            }
            cars.included.push(temp);
        }
        else {
            temp.INCLUDED = false;
            cars.excluded.push(temp)
        }
    }

    //Find determining factors selected by users (is_objective = true)
    //var selectedFactors = [];
    var columns = data.problem.columns;
    var opt = {};
    opt.optIn = [];
    opt.optOut = [];

    for(var y=0; y < columns.length; y++) {
        temp = {};

        switch(columns[y].key) {
            case "price":
                temp.name = "price";
                temp.range = [watsonUtility.sortArray(range.price).array[0], watsonUtility.sortArray(range.price).array[range.price.length-1]];
                
                if(columns[y].is_objective === true)
                    opt.optIn.push(temp);
                else
                    opt.optOut.push(temp);

                break;

            case "fuel_eff":
                temp.name = "fuel_eff";
                temp.range = [watsonUtility.sortArray(range.fuel_eff).array[0], watsonUtility.sortArray(range.fuel_eff).array[range.fuel_eff.length-1]];
                
                if(columns[y].is_objective === true)
                    opt.optIn.push(temp);
                else
                    opt.optOut.push(temp);

                break;

            case "performance":
                temp.name = "performance";
                temp.range = [watsonUtility.sortArray(range.performance).array[0], watsonUtility.sortArray(range.performance).array[range.performance.length-1]];
                
                if(columns[y].is_objective === true)
                    opt.optIn.push(temp);
                else
                    opt.optOut.push(temp);

                break;

            case "comfort":
                temp.name = "comfort";
                temp.range = [watsonUtility.sortArray(range.comfort).array[0], watsonUtility.sortArray(range.comfort).array[range.comfort.length-1]];
                
                if(columns[y].is_objective === true)
                    opt.optIn.push(temp);
                else
                    opt.optOut.push(temp);

                break;

            case "condition":
                temp.name = "condition";
                temp.range = [watsonUtility.sortArray(range.condition).array[0], watsonUtility.sortArray(range.condition).array[range.condition.length-1]];
                
                if(columns[y].is_objective === true)
                    opt.optIn.push(temp);
                else
                    opt.optOut.push(temp);

                break;

            case "safety":
                temp.name = "safety";
                temp.range = [watsonUtility.sortArray(range.safety).array[0], watsonUtility.sortArray(range.safety).array[range.safety.length-1]];
                
                if(columns[y].is_objective === true)
                    opt.optIn.push(temp);
                else
                    opt.optOut.push(temp);

                break;
        }
    }

    watsonAnalysis.inventory = reports;
    watsonAnalysis.factorOptions = opt;
    watsonAnalysis.cars = cars;

    return watsonAnalysis;
}

var inquiry = function(req, res) {
    req.service = getCredentials(req, res);
    //req.logger.info("REQ-BODY: ====|" + JSON.stringify(req.body) + "|====");
    
    var tradeoffAnalytics = new TradeoffAnalytics(req.service); 
    tradeoffAnalytics.dilemmas(req.body, function(err, dilemmas) {
        if (err)
            return res.status(500).json({ error: 'Error processing the request.' });
        else {
            //req.logger.info("DILEMMA ********|" + JSON.stringify(dilemmas) + "|*********");
            var watsonAnalysis = extractInventory_INCLUDED(dilemmas);
            return res.json(watsonAnalysis);
        }
    });
};

var inquiry_graph = function(req, res) {
    req.service = getCredentials(req, res);
    //req.logger.info("REQ-BODY: " + req.body);
    
    var tradeoffAnalytics = new TradeoffAnalytics(req.service); 
    tradeoffAnalytics.dilemmas(req.body, function(err, dilemmas) {
        if (err)
            return res.status(500).json({ error: 'Error processing the request.' });
        else {
            return res.json(dilemmas);
        }
    });
};

module.exports = {
    inquiry: inquiry,
    inquiry_graph: inquiry_graph
}
