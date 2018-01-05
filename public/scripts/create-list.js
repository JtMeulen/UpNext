/* global $ */
$("#show-list-btn").click(callListsApi);
$("#found-movies").on("click", "span", callListsApi);

$("#back-to-lists").click(function(){
    $("#inside-list").hide();
    $("#movies-in-list").empty();
    $("#your-lists").show();
})

$("#create-list-btn").click(function(){
    var name = $("#list-name-input").val();
    $.post("/api/userlist", {name: name})
    .then(function(newlist){
        $("#list-name").val("");
        appendList(newlist);
        appendPopup(newlist)
    })
    .catch(function(){
        console.log("Couldnt find lists")
    });
});

function callListsApi(){
    $("#inside-list").hide();
    $("#movies-in-list").empty();
    $("#your-lists").show();
    $("#found-lists").empty();
    $("#found-lists-popup").empty();
    var username = $(".current_username").attr("id");
    if(username){                                               // ONLY IF USER IS LOGGED IN
        $.get("/api/alllists")                                      // LOADS AUTOMATICALLY
        .done(showLists)
        .fail(function(){
            console.log("COULDNT FIND API")
        })
    }
}


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
    var newList = $('<div class="found-lists" id="'+list._id+'">' +
                        '<div>' +
                            '<p class="list-name">'+list.name+'</p>'+
                            '<p class="list-total">Total movies: <span>'+list.movies.length+'</span></p>'+
                        '</div>' +
                        '<span class="delete-list-btn">x</span>'+
                    '</div>')
    $("#found-lists").prepend(newList);
}

function appendPopup(list){
    var newList = $('<div class="found-lists-popup" id="'+list._id+'"><p class="list-name-popup">'+list.name+'</p><p class="list-total-popup">Total movies: <span>'+list.movies.length+'</span></div>')
    $("#found-lists-popup").prepend(newList);
}


// DELETING THE LIST
$("#found-lists").on("click", ".delete-list-btn", function(event){
    event.stopImmediatePropagation();
    var id = $(this).parent().attr("id");
    $(this).parent().fadeOut();
    $.ajax({
          method: "DELETE", 
            url: "/api/list/" + id
        })
      .then(function(data){
          console.log("deleted")
      })
})