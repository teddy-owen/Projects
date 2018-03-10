var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var port = 3000;
var mongoose = require("mongoose");
var path = require('path');


//setup DB
mongoose.connect('mongodb://localhost/restful_blog');

//initiate blog model
var Schema = mongoose.Schema;
 
var BlogSchema = new Schema({
	title: { type: String, default: 'Post' },
	image: String,
	body: String,
	date: { type: Date, default: Date.now }
});

var Blog = mongoose.model('Blog', BlogSchema);

//initiate bodyparser
app.use(bodyParser.urlencoded({extended:true}));

//initiate Method override
app.use(methodOverride("_method"));

//Sanitize input
app.use(expressSanitizer());

//serve public directory
app.use(express.static("public"));

app.get("/",function(req,res){
	res.redirect("/blogs");
});

//INDEX
app.get("/blogs",function(req,res){
	Blog.find({},function(err,docs){
		if(err){
			console.log(err);
		}else{
			res.render("index.ejs",{blogs:docs});
		}
	});
	
});

//NEW
app.get("/blogs/new",function(req,res){
	res.render("newBlog.ejs");
});

//CREATE
app.post("/blogs",function(req,res){
	req.body.Blog.body = req.sanitize(req.body.Blog.body);
	var post = new Blog(req.body.Blog);
	post.save(function (err, post) {
	    if (err) return console.error(err);
	   	console.log(post);
	   	res.redirect("/blogs");
  	});
});

//SHOW
app.get("/blogs/:id",function(req,res){
	var id = req.params.id;
	console.log("THE ID: "+id);
	Blog.find({_id:id},function(err,post){
		if(err){
			console.error(err);
		} else{
			console.log(post);
			res.render("showBlog.ejs",{post:post[0]});
		}
	});
});

//EDIT
app.get("/blogs/:id/edit",function(req,res){
	var id = req.params.id;
	Blog.find({_id:id},function(err,post){
		if(err){
			console.error(err);
		} else{
			res.render("editBlog.ejs",{post:post[0]});
		}
	});
});

//UPDATE
app.put("/blogs/:id",function(req,res){
	console.log("Made it to PUT ROUTE!");
	req.body.Blog.body = req.sanitize(req.body.Blog.body);
	var id = String(req.params.id);
	Blog.find({_id:id}, function (err, post) {
	  	if(err){
			console.error(err);
		}else{

			//update post
			post = post[0];
			post.title = req.body.Blog.title;
			post.image = req.body.Blog.image;
			post.body = req.body.Blog.body;

			console.log(post);

			// res.redirect("/blogs/"+id);

	 		post.save(function (err, updatedPost) {
	 			if(err){
					console.error(err);
				}else{
					console.log("made it to redirect!");
					res.redirect("/blogs/"+id);
					// res.redirect("/blogs");
				}
		  	});
		}
	});
});

//DESTROY
app.delete("/blogs/:id",function(req,res){
	console.log("Made it to delete!");
	var id = String(req.params.id);
	Blog.remove({_id:id}, function (err) {
		if(err){
			console.error(err);
		}else{
			res.redirect("/blogs");
		}
  	});
});

//OTHER
app.get("*",function(req,res){
	res.send("404: Not Found");
});

//Init Server
app.listen(port,function(){
	console.log("The RESTful Blog server has started on port "+port);
});
