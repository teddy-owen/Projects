var mongoose = require("mongoose");
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

//connect to DB
mongoose.connect('mongodb://localhost/yelp_camp');

//query db for all
Campground.find(function (err, docs) {
	if (err) {
		return console.error(err);
	}else{
		for (var i = docs.length - 1; i >= 0; i--) {

			docs[i].comments=[];

			docs[i].save(function (err, updatedCampground) {
				if (err) return handleError(err);
				console.log("Comments deleted from " + updatedCampground.name + ". Comments: "+updatedCampground.comments);
			});
		}
	}
});

return;