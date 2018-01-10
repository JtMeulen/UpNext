/* global $ */
$("#show-list-btn").click(callListsApi);
$("#found-movies").on("click", "span", callListsApi);

$("#back-to-lists").click(function(){
    callListsApi();
    $("#inside-list").hide();
    $("#movies-in-list").empty();
    $("#your-lists").show();
})

$("#create-list-btn").click(function(){
    var name = $("#list-name-input").val();
    $("#list-name-input").val("");
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
    // Create progression bar
    var seen_total = 0;
    list.movies.forEach(function(movie){
        if(movie.seen == "seen"){
            seen_total++; 
        }
    });
    var seen_progress = (seen_total/list.movies.length) * 100;
    
    // Check if the progress is 100%, if it is add completed class. Or if there is no movie in the list, make the progbar empty
    if(seen_total == 0){
        var newList = $('<div class="found-lists" id="'+list._id+'">' +
                            '<div>' +
                                '<p class="list-name">'+list.name+'</p>'+
                                '<p class="list-total">Total movies: <span>'+list.movies.length+'</span> - Seen: <span>'+seen_total+'</span></p>'+
                                '<div class="progress-bar"><div class="current_progress" style="width: 0px;"></div></div>'+
                            '</div>' +
                            '<span class="delete-list-btn">x</span>'+
                        '</div>')
    } else if(seen_progress == 100){
        var newList = $('<div class="found-lists" id="'+list._id+'">' +
                            '<div>' +
                                '<p class="list-name">'+list.name+'</p>'+
                                '<p class="list-total">Total movies: <span>'+list.movies.length+'</span> - Seen: <span>'+seen_total+'</span></p>'+
                                '<div class="progress-bar"><div class="current_progress complete" style="width: '+seen_progress+'%;"></div></div>'+
                            '</div>' +
                            '<span class="delete-list-btn">x</span>'+
                        '</div>')
    } else {
        var newList = $('<div class="found-lists" id="'+list._id+'">' +
                            '<div>' +
                                '<p class="list-name">'+list.name+'</p>'+
                                '<p class="list-total">Total movies: <span>'+list.movies.length+'</span> - Seen: <span>'+seen_total+'</span></p>'+
                                '<div class="progress-bar"><div class="current_progress" style="width: '+seen_progress+'%;"></div></div>'+
                            '</div>' +
                            '<span class="delete-list-btn">x</span>'+
                        '</div>')
    }
    
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