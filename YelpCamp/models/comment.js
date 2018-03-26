var mongoose = require("mongoose");

//initiate comments model
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var CommentSchema = new Schema({
    user:{
  			type: mongoose.Schema.Types.ObjectId,
  			ref:"User"
  			},
    author:String,
    text: String,
  	date: { type: Date, default: Date.now }
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;