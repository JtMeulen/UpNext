/* global $ */

// Login and authentication bars show up
$("#signup-btn").click(function(){
    $("#login-box").slideUp();
    $("#signup-box").slideDown();
});

$("#login-btn").click(function(){
    $("#signup-box").slideUp();
    $("#login-box").slideDown();
});

// Hide elements if they are not clicked on
$(document).mouseup(function(e){
    var container = $(".user-input-box");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0 && !$("#signup-btn").is(e.target) && !$("#login-btn").is(e.target) ) {
        container.slideUp();
    }
});