/* global $ */
$(document).ready(function(){
    var username = $(".current_username").attr("id");
    if(username){                                               // ONLY IF USER IS LOGGED IN
        $.get("/api/alllists")                                      // LOADS AUTOMATICALLY
        .done(showLists)
        .fail(function(){
            console.log("COULDNT FIND API")
        })
    }
})

$("#create-list-btn").click(function(){
    var name = $("#list-name").val();
    $.post("/api/userlist", {name: name})
    .then(function(newlist){
        $("#list-name").val("");
        appendList(newlist);
        appendPopup(newlist)
    })
    .catch(function(err){
        console.log(err)
    });
});


function showLists(data){
    var username = $(".current_username").attr("id");
    data.forEach(function(list){
        if(list.author_id == username){
            appendList(list);
            appendPopup(list);
        }
    })
}

function appendList(list){
    var newList = $('<div id="'+list._id+'"><p>'+list.name+'</p></div>')
    $("#found-lists").prepend(newList);
}

function appendPopup(list){
    var newList = $('<div id="'+list._id+'"><p>'+list.name+'</p></div>')
    $("#found-lists-popup").prepend(newList);
}