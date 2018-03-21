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
		// populateComments(docs);
		//query db for all comments
		Comment.find(function (err, comments) {
			if (err) {
				return console.error(err);
			}else{
				var comments = comments;
				console.log("Got Comments!");
				for (var i = docs.length - 1; i >= 0; i--) {
					var curr = docs[i];
					// console.log(curr);
					//pick rand num of comments
					var randNum = Math.floor(Math.random() * 10) +1;
					

					var add = [];
					for (var j = randNum; j > 0; j--) {
						//pick rand comment to add
						var randComment = comments[Math.floor(Math.random() * comments.length)];
						add.push(randComment._id);
						// console.log(curr, randNum);
					}

						
					curr.comments = add;

					curr.save(function (err, updatedCampground) {
						if (err) return handleError(err);
						console.log("Comments added to " + updatedCampground.name + ". Comments: "+updatedCampground.comments);
						// next();
					});
				
				}
			}
		});
	}
});


//loop through campgrounds and populate w/comments
function populateComments(campgrounds){
	for (var i = campgrounds.length - 1; i >= 0; i--) {
		var curr = campgrounds[i];
		// console.log(curr);
		//query db for all comments
		Comment.find(function (err, docs) {
			if (err) {
				return console.error(err);
			}else{
				// console.log("Got Comments!");

				//pick rand num of comments
				var randNum = Math.floor(Math.random() * 10) +1;
				console.log(curr, randNum);
				// for (var i = randNum; i > 0; i--) {
				// 	//pick rand comment to add
				// 	var randComment = docs[Math.floor(Math.random() * docs.length)];
					
				// 	curr.comments.push(randComment._id);

				// 	curr.save(function (err, updatedCampground) {
				// 		if (err) return handleError(err);
				// 		console.log("Comments added to " + updatedCampground.name + ". Comments: "+updatedCampground.comments);
				// 	});
				// }
			}
		});
	}
}
