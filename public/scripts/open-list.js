/* global $ */

$("#found-lists").on("click", "div", function(){
    var foundId = $(this).attr("id");
    console.log(foundId)
    $.get("/api/list/"+foundId)
    .then(function(data){
        console.log(data)
    })
})


// Add to list
$("#found-movies").on("click", "span", function(event){
    // First create movie object with the data needed for creating in DB
    var movie = {}
    movie.imdbId = $(this).parent().attr("id");
    movie.poster = $(this).siblings("img").attr("src");
    movie.title = $(this).siblings(".found-info").children(".movie-title").text();
    movie.year = $(this).siblings(".found-info").children(".movie-year").text();
    console.log(movie);
    // Open up the List selection screen
    event.stopPropagation();
    $("#modal-small").show();
    // Click on the list in which you want to create the movie
    $("#found-lists-popup").on("click", "div", function(){
        var listId = $(this).attr("id");
        var url = "/" + listId
        $.post(url, {movie: movie})
        .then(function(newMovie){
            $("#list-name").val("");
            console.log(newMovie);
            console.log("added movie to list");
            $("#modal-small").hide();
        })
        .catch(function(err){
            console.log(err)
        });
    })
    
})

$("#close-popup-small").click(function(){
    $("#modal-small").hide();
})
