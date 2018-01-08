/* global $ */ 
var sessionlist = [];

$("#found-movies").on("click", "span", function(event){
    // First create movie object with the data needed for creating in DB
    var imdbId = $(this).parent().attr("id");
    var poster = $(this).siblings("img").attr("src");
    var title = $(this).siblings(".found-info").children(".movie-title").text();
    var year = $(this).siblings(".found-info").children(".movie-year").text();
    var movie_id = Math.floor(Math.random() * 99999999999999999999) + 999999999;
    var movie = {
        movie_id: movie_id,
        imdbId: imdbId,
        poster: poster,
        title: title,
        year: year,
        seen: "not-seen"
    }
    
    sessionlist.unshift(movie);
    // Open up the List selection screen
    event.stopImmediatePropagation();
    $("#modal-small").show();
    // Click on the list in which you want to push the movie to the new list
    $("#found-lists-popup").on("click", "div", function(event){
        event.stopImmediatePropagation();
        var listId = $(this).attr("id");
        var url = "/api/list/" + listId;
        $.ajax({
            url: url, 
            data: sessionlist[0],
            method: "PUT"
        })
        .then(function(){
            $("#modal-small").hide();
        })
        .catch(function(){
            console.log("No list selected")
        });
    })
})

$("#close-popup-small").click(function(){
    $("#modal-small").hide();
})