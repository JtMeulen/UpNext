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
        var newMovie = $('<div id="'+movie.imdbId+'" class="found-movie">' +
                            '<img src="'+movie.poster+'">' +
                            '<div class="found-info">' +
                                '<p class="movie-title">'+movie.title+'</p>' +
                                '<p class="movie-year">'+movie.year+'</p>' +
                            '</div>' +
                            '<span class="seen-movie-btn">v </span>' +
                            '<span class="delete-movie-btn"> x</span>' +
                        '</div>');
                    
        $("#movies-in-list").append(newMovie)
    })
}

