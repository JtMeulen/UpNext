/* global $ */ 
var sessionlist = [];

$("#found-movies").on("click", "span", function(event){
    // First create movie object with the data needed for creating in DB
    var imdbId = $(this).parent().attr("id");
    var poster = $(this).siblings("img").attr("src");
    var title = $(this).siblings(".found-info").children(".movie-title").text();
    var year = $(this).siblings(".found-info").children(".movie-year").text();
    
    var movie = {
        imdbId: imdbId,
        poster: poster,
        title: title,
        year: year
    }
    
    sessionlist.unshift(movie);
    // Open up the List selection screen
    event.stopImmediatePropagation();
    $("#modal-small").show();
    // Click on the list in which you want to push the movie to the new list
    $("#found-lists-popup").on("click", "div", function(event){
        event.stopImmediatePropagation();
        var listId = $(this).attr("id");
        var url = "/" + listId;
        $.ajax({
            url: url, 
            data: sessionlist[0],
            method: "PUT"
        })
        .then(function(){
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