var mongodb = require("mongodb");
var monk = require("monk");

var monkdb = monk("mongodb://coxauto:coxauto@ds049570.mongolab.com:49570/IbmCloud_lqiun5ia_5q3bbjue");

var watson_criteria = function(req, res) {
	var MongoClient = mongodb.MongoClient;
	MongoClient.connect("mongodb://coxauto:coxauto@ds049570.mongolab.com:49570/IbmCloud_lqiun5ia_5q3bbjue", function(err, db) {

		db.collection("criteria", function(err, criteria) {
			//console.log("db.collection - err = " + err);
			criteria.findOne(function(err, data) {
				console.log("CRITERIA COLLECTION - err = " + err);
				console.log("CRITERIA COLLECTION - data: " + JSON.stringify(data));
				res.send(data);
			});
		});
	});
};

var createCarData = function(req, res) {

	var carDetails = monkdb.get("carDetails");
	carDetails.insert(req.body.detail, function(err, data) {
		if(err)
			res.send("ERROR");
	});

	var cars = monkdb.get("cars");
	cars.insert(req.body.main, function(err, data) {
		if(err)
			res.send("ERROR");
		else
			res.send(JSON.stringify({result: data}));
	});
};

var getCarsByType = function(req, res) {
	//console.log("getCarsByType-req.body.type: " + JSON.stringify(req.body.type));
	var collection = monkdb.get("cars");

	collection.find({'type': {$in:req.body.type}},{fields:{_id:0}}, function(err, data) {
		if(err)
			res.send(err);
			
		res.send(data);
	});
}

var getCarDetails = function(req, res) {
	console.log("get details for carid: |" + req.params.id + "|");
	var carDetailInfo = {
		main: "",
		specs: ""
	}

	var cars = monkdb.get("cars");
	cars.find({'key': req.params.id}, function(err, data) {
		if(err)
			res.send(err);

		carDetailInfo.main = data[0];

		var carDetails = monkdb.get("carDetails");
		carDetails.find({'key': req.params.id}, function(err, details) {
			if(err)
				res.send(err);
			
			//Limit exterior photos to 15 images (1 main + 14 details)
			var arrExteriorImg = details[0].images.exterior;
			while(arrExteriorImg.length > 14) {
				arrExteriorImg.pop();
			}

			//Limit interior photos to 15 images
			var arrInteriorImg = details[0].images.interior;
			while(arrInteriorImg.length > 15) {
				arrInteriorImg.pop();
			}

			details[0].images.exterior = arrExteriorImg;
			details[0].images.interior = arrInteriorImg;

			carDetailInfo.specs = details[0];

			res.send(carDetailInfo);
		});
	});
}

module.exports = {
	watson_criteria: watson_criteria,
	createCarData: createCarData,
	getCarsByType: getCarsByType,
	getCarDetails: getCarDetails
}