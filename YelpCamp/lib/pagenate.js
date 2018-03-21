//require mongoose
var mongoose = require("mongoose");

/*
Main:
Take the #per page (n) and page #, and return the campgrounds to serve
(obj model, int n, int page) -> obj campgrounds
*/
var main = function(model,n,page,callback){

	//setup DB
	mongoose.connect('mongodb://localhost/yelp_camp');

	//query db for all
	var allCampgrounds = [];
	model.find(function (err, docs) {
		if (err) {
			return console.error(err);
		}else{
			allCampgrounds = docs;

			//break into array (L) of arrays of length n
			var L = breakArrays(allCampgrounds,n);
			callback(L[page-1],L.length);
		}
	});
};

/*
breakArrays:
break array of objects (objs) into array of arrays of n objects
(array objs, int n) -> array of arrays of objs
*/
function breakArrays(objs,n) {
	objs = reverseArray(objs);
	var grouped = [];
	var group = [];
	var currN = 1;
	//loop through each and push to grouped each n
	for (var i = objs.length - 1; i >= 0; i--) {
		var currObj = objs[i];
		group.push(currObj);

		// if nth, push to grouped and reset
		if ( (currN === n) || (i === 0) ) {
			grouped.push(group);
			currN = 0;
			group = [];
		}

		currN++;
	}

	return grouped;
}

/*
reverseArray:
reverses direction of array
(array objs) -> array of objs
*/
function reverseArray(array){
	var newArray = [];
	//reverse the array
	for (var i = array.length - 1; i >= 0; i--) {
		newArray.push(array[i]);
	}
	return newArray;
}

//export
module.exports = main; 