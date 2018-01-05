/* global $ */

$("#found-lists").on("click", "div", function(){
    var foundId = $(this).attr("id");
    $("#your-lists").hide();
    $("#inside-list").show();
    
    $.get("/api/list/"+foundId)
    .then(fillList)
})

// Open the list on the page and fill it with the movies in the database
function fillList(data){
    data.movies.forEach(function(movie){
        var newMovie = $('<div id="'+movie.imdbId+'" class="found-movie" name="'+data._id+'">' +
                            '<img src="'+movie.poster+'">' +
                            '<div class="found-info">' +
                                '<p class="movie-title">'+movie.title+'</p>' +
                                '<p class="movie-year">'+movie.year+'</p>' +
                            '</div>' +
                            '<span name="'+movie.movie_id+'" class="seen-movie-btn">v</span>' +
                            '<span name="'+movie.movie_id+'"class="delete-movie-btn">x</span>' +
                        '</div>');
        $("#movies-in-list").append(newMovie)
    })
}

// Remove a movie from the list
$("#movies-in-list").on("click", ".delete-movie-btn", function(event){
    event.stopImmediatePropagation();
    var movie_id = $(this).attr("name");
    var data = {movie_id: movie_id};
    var listId = $(this).parent().attr("name");
    $(this).parent().fadeOut();
    var url = "/api/list/" + listId + "/delete";
        $.ajax({
            url: url, 
            data: data,
            method: "PUT"
        })
        .then(function(data){
            console.log("Deleted movie");
        })
        .catch(function(){
            console.log("No list selected")
        });
})

//  Toggle Seen status of movie
$("#movies-in-list").on("click", ".seen-movie-btn", function(event){
    event.stopImmediatePropagation();
    $(this).parent().toggleClass("seen-movie");

})