


//set listener on comment text box
$("#comment").click(function(){
    $.get("/checklogin", function(data, status){
        //if logged in, enable comment button
        //else not logged in -> present login
        if(data === "yes"){
        	$("form button").removeAttr("disabled");
        }else{
        	$("#login").trigger("click");
        }

    });
});




