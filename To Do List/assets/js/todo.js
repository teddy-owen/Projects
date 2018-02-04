// JS for Todo list

//global var for items in list
var listNum = 0;

//Plus sign listener - hide input on click
$("h1 span").on('click',function(){
    $("input[type='text']").fadeToggle();
});

//Set listener to all li
//Cross out when clicked
$('ul').on('click', 'li', function() {
    $(this).toggleClass("cross");
});

//Show delete button when hover
$("ul").on({
    mouseenter: function () {
        $(this).children("span").show();//stuff to do on mouse enter
    },
    mouseleave: function () {
        $(this).children("span").hide();//stuff to do on mouse leave
    }
},'li');

//Delete listener - delete li when clicked
$("ul").on('click', 'span',

function(event){
	$(this).parent().fadeOut(500,function(){
		//remove from DOM
		$(this).remove();
		//add curve to new bottom
		$("li").last().css("borderRadius", "0px 0px 25px 25px");
		//increment list num and check if empty
		listNum--;
		if(listNum ==0){
			$("input[type='text']").css("borderRadius", "0px 0px 25px 25px");
		}

	});
	event.stopPropagation();
}

);

//Text field listener - add new item to list
$("input[type='text']").keypress(function(e){
	//when click enter button, add to list
	if(e.keyCode == 13){
		var s = $(this).val();
		//remove curve from bottom item
		$("li").last().css("borderRadius", "0px 0px 0px 0px");
		$("ul").append("<li><span hidden><i class='fas fa-minus-square'></i></span>"+s+"</li>");
		$(this).val("");
		//add curve to new bottom item in list
		$("li").last().css("borderRadius", "0px 0px 25px 25px");
		//increment list counter
		listNum++;
		//remove curve from input
		$("input[type='text']").css("borderRadius", "0px 0px 0px 0px");
	}
});



