

// Create a new User using the payload passed 
module.exports.create = function(req, res) {
	console.log("STORING USER DATA: " + JSON.stringify(req.body));
	// Create a new Item instance and then save it to the cloud
	
	var query = req.data.Query.ofType("Account");
	query.find({'username':req.body.username}).done(function(user) {
		console.log("USER EXISTENCE: |" + user + "|");

		if(user == '') {
			var account = req.data.Object.ofType("Account", req.body);
			account.save().then(function(saved) {
				res.send(saved);
			},function(err) {
				res.status(500);
				res.send(err);
			});
		}
		else {

			res.send("User already exists");
		}
	});

	

	
};

module.exports.verify = function(req, res) {
	console.log("VERIFY USER CREDENTIAL");
	// Retrieve a Query instance of type "Item" and issue a find() action on it 
	// to retrieve all the items (NO PAGING)
	var query = req.data.Query.ofType("Account");
	query.find({'username':req.body.username, 'password':req.body.password}).done(function(user) {
		console.log("API-USER: " + JSON.stringify(user));
		res.send(user);
		
	},function(err){
		res.status(500);
		res.send(err);
	});
};