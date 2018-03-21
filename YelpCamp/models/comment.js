var mongoose = require("mongoose");

//initiate comments model
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var CommentSchema = new Schema({
    author: String,
    text: String,
  	date: { type: Date, default: Date.now }
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;