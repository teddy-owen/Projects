var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = 3000;
var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");
var pagenate = require("./lib/pagenate.js");
const path = require('path');
var methodOverride = require('method-override');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var flash = require("connect-flash");


//setup DB
mongoose.connect('mongodb://localhost/yelp_camp');

//Use flash messages
app.use(flash());

//Passport Config
app.use(require("express-session")({
	secret:"Superfluous",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//initiate bodyparser
app.use(bodyParser.urlencoded({extended:true}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//serve public directory
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req,res,next){

	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");

	next();
});

app.get("/",getAuth,function(req,res){
	res.render("landingPage.ejs",{page:"landing",login:req.auth,user:req.user});
});


//INDEX
app.get("/campgrounds",getAuth,function(req,res){
	
	//Get n/page and page # request from query string
	var n = Number(req.query.n) ? Number(req.query.n):10;
	var page = Number(req.query.page) ? Number(req.query.page):1;
	
	// req.flash("error","You must be logged in first");
	//return campgrounds to pass to index.ejs
	pagenate(Campground,n,page,function(campgrounds,pages){
		res.render("index.ejs",{campgrounds:campgrounds,pages:pages,n:n,currPage:page,page:"index",login:req.auth,user:req.user});
	});

});

//NEW
app.get("/campgrounds/new",isLoggedIn,getAuth,function(req,res){
	//send form
	res.render("newCampground.ejs",{page:"new",login:req.auth,user:req.user});
});

//CREATE
app.post("/campgrounds",isLoggedIn,function(req,res){
	//get data from form and add to database
	var data = req.body;
	var newCampground = new Campground({name:data.name,image:data.image,description:data.description,author:req.user});
 	newCampground.save(function (err, doc) {
		if (err) {
			return console.error(err);
		} else{
			res.redirect("/campgrounds/"+doc._id);
		}
	});
});

//SHOW
app.get("/campgrounds/:id",getAuth,function(req,res){
	var id = req.params.id;
	var user_id = req.user ? req.user._id:null;

	Campground.find({_id:id}).populate({
			path: "comments",
			populate: {
				path:"user"
			}
		}
		).populate("author").exec(function (err, doc){
		if (err) {
			req.flash("error","Campground not found");
			res.redirect(req.headers.referer);
			return console.error(err);
		} else{
			var edit = false;
			//Check for authorization
			var author = doc[0].author ? doc[0].author._id : 00000;
			if(String(author) === String(user_id)){
				edit = true;
			}
			res.render("show.ejs",{aCampground:doc[0],page:"show",logged:true,login:req.auth,user:req.user,edit:edit});
		}
	});
});

//POST (Comment)
app.post("/campgrounds/:id/comment",isLoggedIn,function(req,res){
	var id = req.params.id;
	//get data from form and add to database
	var data = req.body;
	var newComment = new Comment({author:req.user.username,user:req.user,text:data.comment});
 	newComment.save(function (err, doc) {
		if (err) {
			return console.error(err);
		} else{
			//Query DB to update
			Campground.findById(id, function (err, campground) {
			  if (err) return handleError(err);
			  
			  campground.comments.push(doc._id);
			  campground.save(function (err, updatedCampground) {
			    if (err) return handleError(err);
			    res.redirect("/campgrounds/"+id);
			  });
			});
		}
	});
});

//EDIT
app.get("/campgrounds/:id/edit",isLoggedIn,getAuth,function(req,res){
		//get ID
		var id = req.params.id;
		//Query DB for post
		Campground.find({_id:id},function (err, doc){
		if (err) {
			return console.error(err);
		} else{
			//Check for authorization
			var author = doc[0].author ? doc[0].author : 00000;
			if(String(author) === String(req.user._id)){
				//prefill new campground clone and render
				res.render("editCampground.ejs",{aCampground:doc[0],page:"edit",login:req.auth,user:req.user});
			}else{
				res.redirect("/campgrounds/"+id);
			}
		}
	});
});

//UPDATE
app.put("/campgrounds/:id",isLoggedIn,function(req,res){
	//get ID
	var id = req.params.id;

	//get data from form and add to database
	var data = req.body;
	
	//Query DB to update
	Campground.findById(id, function (err, campground) {
	  if (err) {
	  	req.flash("error","Campground not found");
		res.redirect(req.headers.referer);
	  	// return handleError(err);
	  }

		//Check for authorization
		var author = campground.author ? campground.author : 00000;
		if(String(author) === String(req.user._id)){
			  campground.name = data.name;
			  campground.image = data.image;
			  campground.description = data.description;

			  campground.save(function (err, updatedCampground) {
			    if (err) return handleError(err);
			    res.redirect("/campgrounds/"+id);
			  });
		}else{
			res.redirect("/campgrounds/"+id);
		}


	});
});

//DESTROY (Campground)
app.delete("/campgrounds/:id",isLoggedIn,function(req,res){
	//get ID
	var id = req.params.id;


	Campground.findById(id, function (err, campground){
		//Check for authorization
		var author = campground.author ? campground.author : 00000;
		if(String(author) === String(req.user._id)){
			Campground.remove({ _id: id }, function (err) {
			  if (err) return handleError(err);
			  // removed!
			  req.flash("error","Campground deleted");
			  res.redirect("/campgrounds");
			});
		}else{
			res.redirect("/campgrounds/"+id);
		}
	});	
});

//DESTROY (Comment)
app.delete("/campgrounds/:id/comment/:comment",isLoggedIn,function(req,res){
	//get ID
	var id = req.params.id;
	var commentId = req.params.comment;

	// console.log("Made it delete comment route");

	Comment.findById(commentId, function (err, comment){
		//Check for authorization
		var author = comment.user ? comment.user : 00000;
		if(String(author) === String(req.user._id)){
			Comment.remove({ _id: commentId }, function (err) {
			  if (err) return handleError(err);
			  // removed!
			  req.flash("error","Comment deleted");
			  res.redirect("/campgrounds/"+id);
			});
		}else{
			res.redirect("/campgrounds/"+id);
		}
	});	
});


////////////////////////////////////////
//Auth Routes
////////////////////////////////////////

//Register
app.post("/register",function(req,res){

	User.register(new User({username: req.body.username}), req.body.password, function(err,user){
		if(err){
			req.flash("error",err.message);
			res.redirect(req.headers.referer);
		}else{

			passport.authenticate("local")(req,res,function(){
				//if landing page, send to campsite page
				if(req.headers.referer[req.headers.referer.length-1] === "\\" || req.headers.referer[req.headers.referer.length-1] === "/"){
					res.redirect("/campgrounds");	
				}else{
					res.redirect(req.headers.referer);
				}
			});
		}

	});
});


//Login
app.post("/login",passport.authenticate("local",{
	failureRedirect: "/"
}),function(req,res){

	req.flash("success","Succesfully logged in!");
	//if landing page, send to campsite page
	if(req.headers.referer[req.headers.referer.length-1] === "\\" || req.headers.referer[req.headers.referer.length-1] === "/"){
		res.redirect("/campgrounds");	
	}else{
		res.redirect(req.headers.referer);
	}
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error","You must be logged in first");
		res.redirect(req.headers.referer);
	}
}

//check login
app.get("/checklogin",function(req,res){
	if(req.isAuthenticated()){
		res.send("yes");
	}else{
		res.send("no");
	}
});


//Logout
app.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged out");
	res.redirect(req.headers.referer);
	// res.redirect("/");
});


//Default
app.get("*",function(req,res){
	res.render("missing.ejs");
});



//Middleware
 function getAuth(req,res,next){
 	if(req.isAuthenticated()){
		req.auth = 1;
		return next();
	}else{
		req.auth = 0;
		return next();
	}
 }
 


app.listen(port,function(){
	console.log("The Yelp Camp server has started on port "+port);
});