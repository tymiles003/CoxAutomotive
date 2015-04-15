var url             = require("url"),
    https           = require('https'),
    extend          = require('util')._extend,
    watsonUtility   = require("../utility/watsonUtility");

module.exports.inquiry = function(req, res) {

    // VCAP_SERVICES contains all the credentials of services bound to
    // this application. For details of its content, please refer to
    // the document or sample of each service.
    var service_name = 'question_and_answer';
    var authenticationCode = watsonUtility.getStoredAuthCode(req.storedAuth, service_name);

    if(authenticationCode == "") {
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
            var watson_svc_credentials = watsonUtility.getCredentials("question_and_answer");

            req.service.url = watson_svc_credentials.url;
            req.service.username = watson_svc_credentials.username;
            req.service.password = watson_svc_credentials.password;

            req.logger.info("Loading VCAP_SERVICES-" + service_name + " from LOCAL: " + JSON.stringify(req.service));
        }

        req.logger.info('SERVICE_URL = ' + req.service.url);
        req.logger.info('SERVICE_USERNAME = ' + req.service.username);
        req.logger.info('SERVICE_PASSWORD = ' + new Array(req.service.password.length).join("X"));

        var authenticationCode = "Basic " + new Buffer(req.service.username + ":" + req.service.password).toString("base64");

        req.storedAuth = watsonUtility.setStoredAuthCode(req.storedAuth, service_name, authenticationCode);
    }
    

    //DEBUGGING
    /*for(x=0; x<req.storedAuth.length; x++) {
        req.logger.info("WatsonQA - DEBUG-REQ.STOREDAUTH: SERVICE = " + req.storedAuth[x]["name"] + " | AUTHENTICATION CODE = " + req.storedAuth[x]["authCode"]);
    }*/

    var parts = url.parse(req.service.url +'/v1/question/' +  req.body.dataset);

    req.logger.info("DATASET: " + req.body.dataset + " | QUESTION: " + req.body.questionText);
    req.logger.info("PARTS: " + JSON.stringify(parts));

    var options = {
        host: parts.hostname,
        port: parts.port,
        path: parts.pathname,
        method: 'POST',
        headers: {
          'Content-Type'  :'application/json',
          'Accept':'application/json',
          'X-synctimeout' : '30',
          'Authorization' :  authenticationCode
        }
    };

    req.logger.info("OPTIONS: " + JSON.stringify(options));

    // Create a request to POST to Watson
    var watson_req = https.request(options, function(result) {
        result.setEncoding('utf-8');
        var response_string = '';

        result.on('data', function(chunk) {
            response_string += chunk;
        });

        result.on('end', function() {
            var answers = JSON.parse(response_string)[0];
            var response = extend({ 'answers': answers },req.body);

            req.logger.info("RESPONSE.ANSWERS = " + JSON.stringify(response.answers));

            if(response.answers != undefined) {
                res.send(response.answers.question.answers);    
            }
            else {
                res.send("");
            }
            
        });
    });

    watson_req.on('error', function(e) {
        res.send(e.message)
    });

    // create the question to Watson
    var questionData = {
        'question': {
            'evidenceRequest': {
                'items': 5 // the number of anwers
            },
            'questionText': req.body.questionText // the question
        }
    };
    
    req.logger.info("JSON.stringify(questionData): " + JSON.stringify(questionData));
    // Set the POST body and send to Watson
    watson_req.write(JSON.stringify(questionData));
    watson_req.end();
};