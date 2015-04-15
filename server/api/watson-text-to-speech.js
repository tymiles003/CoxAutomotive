var url                 = require("url"),
    https               = require('https'),
    extend              = require('util')._extend,
    server              = require('http'),
    io                  = require('socket.io')(server),
    fs                  = require('fs'),
    watsonDevCloud      = require('watson-developer-cloud'),
    watsonUtility       = require("../utility/watsonUtility");

 
var getCredentials = function() {
    var service_name = "text_to_speech";

    var service = {
        'url': '<service_url>',
        'username': '<service_username>',
        'password': '<service_password>'
    };

    if (process.env.VCAP_SERVICES) {
        var vcapObj = JSON.parse(process.env.VCAP_SERVICES);
        
        if (vcapObj[service_name]) {
            var svc = vcapObj[service_name][0].credentials;

            service.url = svc.url;
            service.username = svc.username;
            service.password = svc.password;

            console.log("Loading VCAP_SERVICES-" + service_name + " from PROCESS.ENV: " + JSON.stringify(service));
        }
    }
    else {
        //**** Parse Watson Service Credentials ****/
        var watson_svc_credentials = watsonUtility.getCredentials(service_name);

        service.url = watson_svc_credentials.url;
        service.username = watson_svc_credentials.username;
        service.password = watson_svc_credentials.password;

        console.log("Loading VCAP_SERVICES-" + service_name + " from LOCAL: " + JSON.stringify(service));
    }

    return service;
}; 

var inquiry = function(req, res) {
    var credentials = getCredentials();
    credentials.version = "v1";
    credentials.headers = {'Accept':'audio/ogg; codecs=opus'};

    req.logger.info("CREDENTIALS = " + JSON.stringify(credentials));
    req.logger.info("REQ-BODY: " + req.body);
    
    // Create the service wrapper
    var textToSpeech = new watsonDevCloud.text_to_speech(credentials);
    var transcript = textToSpeech.synthesize(req.query);

    transcript.on('response', function(response) {
        console.log(response.headers);
        if (req.query.download) {
            response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
        }
    });
    
    transcript.pipe(res);
};

module.exports = {
    inquiry: inquiry
}