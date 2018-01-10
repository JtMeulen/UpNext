/* global $ */

// Open share field
$("#show-share-input").click(function(){
    $(this).toggleClass("button-active");
    $("#share-input").slideToggle()
})


// Share your list woth another user
$("#share-with-user").click(function(){
    var username = $("#share-username").val();
    var listId = $("#movies-in-list").attr("name");
    var url = "/api/list/" + listId + "/adduser"
    $("#share-username").val("");
    var current_username = $(".current_username").attr("name");
    // Check if the user is not using its own name
    if(username !== current_username){
        $.ajax({
            method: "PUT",
            data: {username: username},
            url: url
        })
        .then(function(newUser){
            console.log("Added " + newUser);
        })
        .catch(function(){
            console.log("Could not add user");
        });  
    } else {
        alert("Can't use your own username");
    }
    
});

// Creating the lists
$("#show-shared-btn").click(callSharedApi);

$("#back-to-shared").click(function(){
    callSharedApi();
    $("#inside-shared").hide();
    $("#movies-in-shared").empty();
    $("#shared-lists").show();
});

function callSharedApi(){
    $("#inside-shared").hide();
    $("#movies-in-shared").empty();
    $("#shared-lists").show();
    $("#found-shared-lists").empty();
    // $("#found-lists-popup").empty();  Saved this for if user can append to shared lists
    var username = $(".current_username").attr("id");
    if(username){                                               // ONLY IF USER IS LOGGED IN
        $.get("/api/alllists")                                      // LOADS AUTOMATICALLY
        .done(showShared)
        .fail(function(){
            console.log("COULDNT FIND API")
        })
    }
}

function showShared(data){
    var username = $(".current_username").attr("name");
    data.forEach(function(list){
        if(list.users.includes(username)){
            appendShared(list);
            // appendPopup(list);
        }
    })
}

function appendShared(list){
     // Create progression bar
    var seen_total = 0;
    list.movies.forEach(function(movie){
        if(movie.seen == "seen"){
            seen_total++; 
        }
    });
    var seen_progress = (seen_total/list.movies.length) * 100;
    
    var newList = $('<div class="found-lists" id="'+list._id+'">' +
                        '<div>' +
                            '<p class="list-name">'+list.name+'</p>'+
                            '<p class="list-total">Total movies: <span>'+list.movies.length+'</span></p>'+
                            '<div class="progress-bar"><div class="current_progress" style="width: '+seen_progress+'%;"></div></div>'+
                        '</div>' +
                    '</div>')
    $("#found-shared-lists").prepend(newList);
}

// function appendPopup(list){
//     var newList = $('<div class="found-lists-popup" id="'+list._id+'"><p class="list-name-popup">'+list.name+'</p><p class="list-total-popup">Total movies: <span>'+list.movies.length+'</span></div>')
//     $("#found-lists-popup").prepend(newList);
// }

// *******************************
// Open a shared List
// *******************************
$("#found-shared-lists").on("click", "div", function(){
    var foundId = $(this).attr("id");
    $("#shared-lists").hide();
    $("#inside-shared").show();
    $("#movies-in-shared").attr("name", foundId);
    
    $.get("/api/list/"+foundId)
    .then(fillShared)
})

// Open the list on the page and fill it with the movies in the database
function fillShared(data){
    data.movies.forEach(function(movie){
        if(movie.seen == "seen"){
            var newMovie = $('<div id="'+movie.imdbId+'" class="found-movie seen-movie" name="'+data._id+'">' +
                            '<img src="'+movie.poster+'">' +
                            '<div class="found-info">' +
                                '<p class="movie-title">'+movie.title+'</p>' +
                                '<p class="movie-year">'+movie.year+'</p>' +
                            '</div>' +
                        '</div>');
        } else {
            var newMovie = $('<div id="'+movie.imdbId+'" class="found-movie" name="'+data._id+'">' +
                            '<img src="'+movie.poster+'">' +
                            '<div class="found-info">' +
                                '<p class="movie-title">'+movie.title+'</p>' +
                                '<p class="movie-year">'+movie.year+'</p>' +
                            '</div>' +
                        '</div>');
        }
        $("#movies-in-shared").append(newMovie)
       
    })
}