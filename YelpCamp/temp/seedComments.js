var mongoose = require("mongoose");
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

var comments = [
	{author:"Avila Renée",text:"I feel sorry for people who don't drink. When they wake up in the morning, that's as good as they're going to feel all day."},
	{author:"Grey Ruben",text:"Oppan Gangnam Style Gangnam Style Op op op op oppan Gangnam Style Gangnam Style Op op op op oppan Gangnam Style."},
	{author:"Cornelio Klavdiya",text:"I see you have something to talk about. Well, I have something to shout about. Infact something to sing about. But I'll just keep quiet and let you carry on."},
	{author:"Filip Jaquan",text:"I told my wife the truth. I told her I was seeing a psychiatrist. Then she told me the truth: that she was seeing a psychiatrist, two plumbers, and a bartender."},
	{author:"Mikala Branislava",text:"Don't steal, don't lie, don't cheat, don't sell drugs. The government hates competition!"},
	{author:"Marcellin Govinda",text:"In my life there's been heartache and pain I don't know if I can face it again Can't stop now, I've traveled so far To change this lonely life."},
	{author:"Su Ara",text:"Please allow me to introduce myself I'm a man of wealth and taste I've been around for a long, long year Stole many a mans soul and faith And I was round when jesus christ Had his moment of doubt and pain."},
	{author:"Feivel Radana",text:"Sometimes I wonder if I really can. But then I think to myself, maybe I can't. But if I could, that would be good. Maybe it's all a lie?"},
	{author:"Ioan Serafina",text:"Yo wa gwan blud you rudeboy bludclart."},
	{author:"Angelica Madhavi",text:"If you really wanted to do that, then why wouldn't you do that? Instead you do this. It makes no sense."},
	{author:"Viktor Shiphrah",text:"If I could I would. Wether or not I should, I still would."},
	{author:"Christer Aziz",text:"Loving you Isn't the right thing to do How can I Ever change things that I feel? If I could Maybe I'd give you my world How can I When you won't take it from me?"},
	{author:"Isador Carsten",text:"I never meant to cause you any sorrow. I never meant to cause you any pain. I only wanted to one time see you laughing. I only wanted to see you laughing in the purple rain."},
	{author:"Frank Tess",text:"A good lawyer knows the law; a clever one takes the judge to lunch."},
	{author:"Gwalchmei Batya",text:"From this day on I shall be known as Bob. For Bob is a good name and I am good. But if you want you can just call me Sally."},
	{author:"Gopinath Finnén",text:"If you really wanted to do that, then why wouldn't you do that? Instead you do this. It makes no sense."},
	{author:"Laila Miloš",text:"If I could I would. Wether or not I should, I still would."},
	{author:"Metrophanes Nicolò",text:"If I roll once and you roll twice. What does that mean?"},
	{author:"Baldo Isobel",text:"Now this is the story all about how My life got flipped, turned upside down And I'd like to take a minute just sit right there I'll tell you how I became the prince of a town called Bel-air."},
	{author:"Kerensa Leoncio",text:"Loving you Isn't the right thing to do How can I Ever change things that I feel? If I could Maybe I'd give you my world How can I When you won't take it from me?"},
	{author:"Tobias Nguyệt",text:"Great Site!"},
	{author:"Gwandoya Munashe",text:"So Pretty!"},
	{author:"Gwladys Emmaline",text:"Looks fun!"}
];

//connect to DB
mongoose.connect('mongodb://localhost/yelp_camp');

//loop through comments
for (var i = comments.length - 1; i >= 0; i--) {
	var curr = comments[i];
	//Seed comments to DB
	var newComment = new Comment({author:curr.author,text:curr.text});
		newComment.save(function (err, doc) {
		if (err) {
			return console.error(err);
		} else{
			console.log("New comment by "+doc.author);
		}
	});
}
