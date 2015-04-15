var url                 = require("url"),
    https               = require('https'),
    extend              = require('util')._extend,
    server              = require('http'),
    io                  = require('socket.io')(server),
    fs                  = require('fs'),
    SpeechToText        = require('./speech-to-text'),
    watsonUtility       = require("../utility/watsonUtility");

 
module.exports.getCredentials = function() {
    var service_name = "speech_to_text";

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

module.exports.inquiry = function(req, res) {
    req.logger.info("REQ-BODY: " + req.body);
    
    var speechToText = new SpeechToText(req.service); 

    if (!req.body.url || req.body.url.indexOf('audio/') !==0)
        return res.status(500).json({ error: 'Malformed URL' });
    console.log("__dirname = " + __dirname + " | url = " + req.body.url);
    var audio = fs.createReadStream('../../../client/' + req.body.url);

    speechToText.recognize({audio: audio}, function(err, transcript){
        console.log("SpeechToText - RECOGNIZING AUDIO");
        if (err)
            return res.status(500).json({ error: err });
        else {
            //console.log("SpeechToText - TRANSCRIPT: " + transcript.results[0].alternatives.transcript); 
            if(transcript.results[0].final) {
                console.log("SpeechToText - TRANSCRIPT: " + transcript.results[0].alternatives.transcript);    
            }
            
            return res.json(transcript);
        }
    });

    require('./socket')(io, speechToText);
};