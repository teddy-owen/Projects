var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = 3000;
var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var pagenate = require("./lib/pagenate.js");
const path = require('path');
var methodOverride = require('method-override');


//setup DB
mongoose.connect('mongodb://localhost/yelp_camp');

//initiate bodyparser
app.use(bodyParser.urlencoded({extended:true}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//serve public directory
app.use(express.static(path.join(__dirname, 'public')));


app.get("/",function(req,res){
	res.render("landingPage.ejs",{page:"landing"});
});


//INDEX
app.get("/campgrounds",function(req,res){
	
	//Get n/page and page # request from query string
	var n = Number(req.query.n) ? Number(req.query.n):10;
	var page = Number(req.query.page) ? Number(req.query.page):1;
	
	//return campgrounds to pass to index.ejs
	pagenate(Campground,n,page,function(campgrounds,pages){
		res.render("index.ejs",{campgrounds:campgrounds,pages:pages,n:n,currPage:page,page:"index"});
	});

});

//NEW
app.get("/campgrounds/new",function(req,res){
	//send form
	res.render("newCampground.ejs",{page:"new"});
});

//CREATE
app.post("/campgrounds",function(req,res){
	//get data from form and add to database
	var data = req.body;
	var newCampground = new Campground({name:data.name,image:data.image,description:data.description});
 	newCampground.save(function (err, doc) {
		if (err) {
			return console.error(err);
		} else{
			res.redirect("/campgrounds");
		}
	});
});

//SHOW
app.get("/campgrounds/:id",function(req,res){
	var id = req.params.id;
	Campground.find({_id:id}).populate("comments").exec(function (err, doc){
		if (err) {
			return console.error(err);
		} else{
			res.render("show.ejs",{aCampground:doc[0],page:"show"});
		}
	});
});

//EDIT
app.get("/campgrounds/:id/edit",function(req,res){
		//get ID
		var id = req.params.id;
		//Query DB for post
		Campground.find({_id:id},function (err, doc){
		if (err) {
			return console.error(err);
		} else{
			//prefill new campground clone and render
			res.render("editCampground.ejs",{aCampground:doc[0],page:"edit"});
		}
	});
});

//UPDATE
app.put("/campgrounds/:id",function(req,res){
	//get ID
	var id = req.params.id;

	//get data from form and add to database
	var data = req.body;
	
	//Query DB to update
	Campground.findById(id, function (err, campground) {
	  if (err) return handleError(err);

	  campground.name = data.name;
	  campground.image = data.image;
	  campground.description = data.description;

	  campground.save(function (err, updatedCampground) {
	    if (err) return handleError(err);
	    res.redirect("/campgrounds/"+id);
	  });
	});
});

//DESTROY
app.delete("/campgrounds/:id",function(req,res){
	//get ID
	var id = req.params.id;
	
	Campground.remove({ _id: id }, function (err) {
	  if (err) return handleError(err);
	  // removed!
	  res.redirect("/campgrounds");
	});
});

//Default
app.get("*",function(req,res){
	res.render("missing.ejs");
});

app.listen(port,function(){
	console.log("The Yelp Camp server has started on port "+port);
});