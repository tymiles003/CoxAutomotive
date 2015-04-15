if (!process.env.NODE_ENV) process.env.NODE_ENV='development'

var express     = require('express'),
    http        = require('http'),
    path        = require('path'),
    reload      = require('reload'),
    colors      = require('colors'),
    fs          = require('fs'),
    ibmbluemix  = require('ibmbluemix'),
    ibmdata     = require('ibmdata'),
    bodyParser  = require('body-parser'),
    items       = require('./server/api/items'),
    user        = require('./server/api/user'),
    watson_qa   = require('./server/api/watson-question-answer'),
    watson_ta   = require('./server/api/watson-tradeoff-analytics'),
    watson_stt  = require('./server/api/watson-speech-to-text'),
    watson_tts  = require('./server/api/watson-text-to-speech'),
    cars        = require('./server/api/cars'),
    SpeechToText  = require('./server/api/speech-to-text'),
    watsonUtility = require("./server/utility/watsonUtility");;

var url = require("url");
var https = require('https');
var extend = require('util')._extend;

var app = express();
var appConfig = JSON.parse(fs.readFileSync("./server/resources/bluemix.json","utf8"));
var clientDir = path.join(__dirname, 'client')

app.set('port', process.env.PORT || 8000)
app.use(express.static(clientDir)) 
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(express.bodyParser());

var service = {
    'url': '<service_url>',
    'username': '<service_username>',
    'password': '<service_password>'
};

var storedAuth = [];


// **** BLUEMIX SDK INITIALIZATION ****
// STEP 1: init core sdk
ibmbluemix.initialize(appConfig);
var logger = ibmbluemix.getLogger();
logger.info("bluemix initialization complete");

// STEP 2: init service sdks 
app.use(function(req, res, next) {
    logger.info("INITIALIZE IBM DATA");
    req.data = ibmdata.initializeService(req);
    //req.ibmpush = ibmpush.initializeService(req);
    req.logger = logger;
    req.service = service;
    req.storedAuth = storedAuth;

    next();
});
var ibmconfig = ibmbluemix.getConfig();


// **** Default API ROUTING **** //
app.get('/', function(req, res) {
  res.sendfile(path.join(clientDir, 'index.html'))
})


// **** WATSON - Question & Answer ****//
//=====================================//
app.post('/api/watson-qa', watson_qa.inquiry);


// **** WATSON - Tradeoff Analytics ****//
//======================================//
app.post('/api/watson-ta', watson_ta.inquiry);
app.post('/api/watson-ta-graph', watson_ta.inquiry_graph);


// **** WATSON - Speech To Text **** //
//===================================//
var credentials = watson_stt.getCredentials(); // VCAP_SERVICES
var speechToText = new SpeechToText(credentials);
app.post('/api/watson-stt', watson_stt.inquiry);


// **** WATSON - Text To Speech **** //
//===================================//
//var credentials = watson_tts.getCredentials(); // VCAP_SERVICES
//var textToSpeech = new SpeechToText(credentials);
app.get('/api/watson-tts', watson_tts.inquiry);


// **** MOBILE DATA ****//
//======================//
app.post('/api/createUser', user.create);
app.post('/api/verifyUser', user.verify);
//app.post('/api/saveItem', items.saveItem);
//app.get('/api/listItem', items.listItem);


// **** MONGODB ****//
//==================//
app.get('/api/getWatsonCarCriteria', cars.watson_criteria);
app.post('/api/createCarData', cars.createCarData);
app.post('/api/getCarsByType', cars.getCarsByType);
app.get('/api/getCarDetails/:id', cars.getCarDetails);



// **** SERVER CONFIG ****
var server = http.createServer(app)
//reload(server, app)

server.listen(app.get('port'), function(){
  console.log("Web server listening in %s on port %d", colors.red(process.env.NODE_ENV), app.get('port'));
});

var io = require('socket.io').listen(server);
require('./server/api/socket')(io, speechToText);