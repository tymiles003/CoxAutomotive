/*var items = [
	{
		"item": "Oranges",
		"category": "Fruit"
	}
]*/

module.exports.create = function(req, res) {

};

module.exports.list = function(req, res) {
	//request.logger.info("Getting list of items: " + JSON.stringify(items));
	//response.json(items);

	req.logger.info("GETTING ALL ITEMS ... ");
	var query = req.data.Query.ofType("Item");
	query.find().then(function(items) {
		res.send(items);
	},
	function(error) {
		req.logger.info("ERROR RETRIEVING ITEMS: " + error);
		res.sendStatus(500, error);
	});
};

// Create a new Item using the payload passed 
module.exports.saveItem = function(req, res) {
	console.log("POSTING AN ITEM: " + JSON.stringify(req.body));
	// Create a new Item instance and then save it to the cloud
	var item = req.data.Object.ofType("Item", req.body);
	item.save().then(function(saved) {
		res.send(saved);
	},function(err) {
		res.status(500);
		res.send(err);
	});
};

module.exports.listItem = function(req, res) {
	console.log("GETTING ALL ITEMS");
	// Retrieve a Query instance of type "Item" and issue a find() action on it 
	// to retrieve all the items (NO PAGING)
	var query = req.data.Query.ofType("Item");
	query.find().done(function(items) {
		console.log("API-LISTITEMS: " + JSON.stringify(items));
		res.send(items);
	},function(err){
		res.status(500);
		res.send(err);
	});
};