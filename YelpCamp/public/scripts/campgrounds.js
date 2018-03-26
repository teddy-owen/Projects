
//set listener on comment text box
$("#newCampground").click(function(){
    $.get("/checklogin", function(data, status){
        //if not logged in -> present login
        if(data === "no"){
        	$("#login").trigger("click");
        }
    });
});
