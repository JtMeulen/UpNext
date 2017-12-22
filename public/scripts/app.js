/* global $ */
const apikey = "&apikey=74f9ae25"; // private api key needed for OMDB

// Search bar ajax logic
$("#search-btn").click(ajaxCall); //if the user clicked the button
$("#search-bar").keypress(function(e) {
    if(e.which == 13) {    //if the user pressed enter
        ajaxCall();
    }
});


// Movie or own list nav bar button logic
// Search selection
$("#show-search-btn").click(function(){
    $("#search-list").show();
    $("#movie-list").hide();
});
// Own list selection
$("#show-list-btn").click(function(){
    $("#movie-list").show();
    $("#search-list").hide();
});

// Click on  a movie to see more details about it in a popup screen
$("#found-movies").on("click", "div", function(){
    var clickedId = $(this).attr('id');
    var url = "https://www.omdbapi.com/?i=" + clickedId + apikey;
    // AJAX call comes here
    $.get(url)
    .done(fillPopup)
})

// Close the popup screen
$("#close-popup").click(function(){
    $("#modal").fadeOut();
});

// Callback functions come here

function fillPopup(data){
    $("#modal").fadeIn();
    $("#title").text(data.Title);
    $("#director").text(data.Director);
    $("#released").text(data.Released);
    $("#genre").text(data.Genre);
    $("#rTomatoes").text(data.Ratings[1].Value);
    $("#imdb").text(data.Ratings[0].Value);
    $("#awards").text(data.Awards);
    $("#poster").attr("src", data.Poster);
    console.log(data)
}


function ajaxCall(){
    // Get URL form input field
    var searchValue = $("#search-bar").val();
    var url = "https://www.omdbapi.com/?s=" + searchValue + apikey;
    $("#search-bar").val('');
    // AJAX call comes here
    $.get(url)
    .done(showMovies)
    .fail(function(){
        $("#error-message").text("Failed to get info..");
    })
}


// Find each movie in the array if the search came up with content
function showMovies(data){
   if(data.Response == "False"){
       $("#error-message").text("No results...");
   } else {
       $("#found-movies").empty(); // Clear the list of movies that are displayed
       data.Search.forEach(showMovie); //callback to showMovie with each of the items from the array
   }
}

// For each movie in the array, create a list item and append that item to the view page.
function showMovie(movie){
   if(movie.Poster == "N/A"){
       var generalPoster = "https://www.movieinsider.com/images/none_175px.jpg" //In case the DB doesnt have poster
       var newMovie = $('<div id="'+movie.imdbID+'"><img src="'+generalPoster+'"><p class="movie-title">'+movie.Title+'</p></div>');
   } else {
       var newMovie = $('<div id="'+movie.imdbID+'"><img src="'+movie.Poster+'"><p class="movie-title">'+movie.Title+'</p></div>');
   }
   $("#found-movies").append(newMovie);
}

