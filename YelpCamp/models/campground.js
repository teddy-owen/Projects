var mongoose = require("mongoose");

//initiate campground model
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var CampgroundSchema = new Schema({
    author    : ObjectId,
    name: { type: String, default: 'Campground' },
    image:  String,
  	date: { type: Date, default: Date.now },
  	description: String,
  	comments:[
  		{
  			type: mongoose.Schema.Types.ObjectId,
  			ref:"Comment"
  		}
  	]
});

var Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;