var fs 			= require("fs"),
	SortedArray = require("sorted-array");


module.exports.getCredentials = function (serviceName) {
	var watsonServices = JSON.parse(fs.readFileSync("./server/resources/watson.json"));

	return watsonServices[serviceName][0].credentials;
}

module.exports.getVCAPObject = function() {
	var services = {};

	if (process.env.VCAP_SERVICES) {
		services = JSON.parse(process.env.VCAP_SERVICES);
	}

	return services;
}

module.exports.setStoredAuthCode = function(storedAuth, serviceName, authenticationCode) {
	var temp = {};
	
	temp.name = serviceName;
	temp.authCode = authenticationCode;

	storedAuth.push(temp);
	return storedAuth;
}

module.exports.getStoredAuthCode = function(storedAuth, serviceName) {
	var x = 0;

	for(x=0; x<storedAuth.length; x++) {
	    if(storedAuth[x]["name"] === serviceName) {
	        console.log("GET AUTH FROM AUTH ARRAY: SERVICE = " + serviceName + " | AUTHENTICATION CODE = " + storedAuth[x]["authCode"]);
	        return storedAuth[x]["authCode"];
	    }
	}

	return "";
}

module.exports.sortArray = function(arrData) {
    return new SortedArray(arrData);
}