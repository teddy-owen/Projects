var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = 3000;
var mongoose = require("mongoose");


//setup DB
mongoose.connect('mongodb://localhost/yelp_camp');

//initiate campground model
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var CampgroundSchema = new Schema({
    author    : ObjectId,
    name: { type: String, default: 'Campground' },
    image:  String,
  	date: { type: Date, default: Date.now },
});

var Campground = mongoose.model('Campground', CampgroundSchema);





// Campground.create({
// 	name:"Nob Hill",
// 	image:"https://images.theoutbound.com/uploads/1438705339755/w7dsd27c7km/ca23b30ad605fba2b34434aa33ae3e2b?w=900&h=600&fit=crop"
// 	},

// 	function(err,doc){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log("New entry created...");
// 			console.log(doc);
// 		}
// });


//initiate bodyparser
app.use(bodyParser.urlencoded({extended:true}));


// var campgrounds = [
// 	{name:"Nob Hill",image:"https://images.theoutbound.com/uploads/1438705339755/w7dsd27c7km/ca23b30ad605fba2b34434aa33ae3e2b?w=900&h=600&fit=crop"},
// 	{name:"Goshen Ocean",image:"https://images.theoutbound.com/uploads/1427753025567/d3gg1ns22x9io1or/c78b80dbd560122b50fa5caa61336e56?w=900&h=600&fit=crop"},
// 	{name:"Pine Nob",image:"https://images.theoutbound.com/uploads/1437140402255/wumsmrfw78e/ca76c0961beec40ee34c0e8b7997e543?w=900&h=600&fit=crop"},
// 	{name:"Pacific Heights",image:"http://www.campersview.com/assets/campers.jpg"},
// ];



// for (var i =  campgrounds.length - 1; i >= 0; i--) {
//  	var initDB = new Campground(campgrounds[i]);
//  	initDB.save(function (err, doc) {
//     	if (err) {
//     		return console.error(err);
//     	} else{
//     		console.log("New entry created...");
// 			console.log(doc);
//     	}
//   	});
//  }

// Campground.find(function (err, docs) {
// 	if (err) {
// 		return console.error(err);
// 	}else{
// 		console.log("DB Below:");
// 		console.log(docs);
// 	}
// });



app.get("/",function(req,res){
	res.render("landingPage.ejs");
});

app.get("/campgrounds",function(req,res){
	// var db = [];
	Campground.find(function (err, docs) {
		if (err) {
			return console.error(err);
		}else{
			// db = docs;
			res.render("campgrounds.ejs",{campgrounds:docs});
		}
	});

	// console.log(db);

	
});

app.post("/campgrounds",function(req,res){
	//get data from form and add to campgrounds array
	// console.log(req);
	var data = req.body;
	// console.log(data);
	// campgrounds.push({name:data.name,image:data.image});
	var newCampground = new Campground({name:data.name,image:data.image});
 	newCampground.save(function (err, doc) {
		if (err) {
			return console.error(err);
		} else{
			console.log("New entry created...");
			console.log(doc);
		}
	});

	// res.redirect(req.body);
	//redirect back to campgrounds page
	// console.log(campgrounds);
	res.redirect("/campgrounds");
	// next();
	// res.render("campgrounds.ejs",{campgrounds:campgrounds});
});

app.get("/campgrounds/new",function(req,res){
	//send form
	res.render("newCampground.ejs");
});

app.get("*",function(req,res){
	res.send("404: Not Found");
});

app.listen(port,function(){
	console.log("The Yelp Camp server has started on port "+port);
});