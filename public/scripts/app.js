/* global $ */
const apikey = "&apikey=74f9ae25"; // private api key needed for OMDB
var urlForPages = "";

// Search bar ajax logic
$("#search-btn").click(ajaxCall); //if the user clicked the button
$("#search-bar").keypress(function(e) {
    if(e.which == 13) {    //if the user pressed enter
        ajaxCall();
    }
});

// Login and authentication bars show up
$("#signup-btn").click(function(){
    $("#login-box").slideUp();
    $("#signup-box").slideDown();
});

$("#login-btn").click(function(){
    $("#signup-box").slideUp();
    $("#login-box").slideDown();
});

// Hide elements if they are not clicked on
$(document).mouseup(function(e){
    var container = $(".user-input-box");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0 && !$("#signup-btn").is(e.target) && !$("#login-btn").is(e.target) ) {
        container.slideUp();
    }
});


// Movie or own list nav bar button logic
// Search selection
$("#show-search-btn").click(function(){
    $(this).addClass("selected-btn");
    $("#show-list-btn").removeClass("selected-btn");
    $("#search-list").show();
    $("#movie-list").hide();
});
// Own list selection
$("#show-list-btn").click(function(){
    $(this).addClass("selected-btn");
    $("#show-search-btn").removeClass("selected-btn");
    $("#movie-list").show();
    $("#search-list").hide();
});

// Page numeration buttons
$(".pages").on("click", "div", function(){
    $(".selected-page").removeClass("selected-page");
    $(this).addClass("selected-page");
    $("#found-movies").empty(); // Clear the list of movies that are displayed
    $("#search-loader").show();
    var url = urlForPages + $(this).attr('id') + apikey;
    // AJAX call comes here
    $.get(url)
    .done(showMoviesNewPage)
    .fail(function(){
        $("#search-loader").hide();
        $("#error-message").text("Failed to get info..");
    })
})

// Click on  a movie to see more details about it in a popup screen
$("#found-movies").on("click", "div", function(){
    $("#popup-loader").show();
    var clickedId = $(this).attr('id');
    var url = "https://www.omdbapi.com/?i=" + clickedId + "&plot=full" + apikey;
    // AJAX call comes here
    $.get(url)
    .done(fillPopup)
})

// Close the popup screen
$("#close-popup").click(function(){
    $("#title").text("");
    $("#director").text("");
    $("#released").text("");
    $("#genre").text("");
    $("#rTomatoes").text("");
    $("#imdb").text("");
    $("#awards").text("");
    $("#poster").attr("src", "https://www.movieinsider.com/images/none_175px.jpg");   
    $("#modal").hide();
});

// Callback functions come here

function fillPopup(data){
    $("#popup-loader").hide();
    console.log(data)
    $("#modal").show();
    $("#title").text(data.Title);
    $("#director").text(data.Director);
    $("#released").text(data.Year);
    $("#genre").text(data.Genre);
    $("#plot").text(data.Plot);
    $("#rTomatoes").text(data.Ratings[1].Value);
    $("#imdb").text(data.Ratings[0].Value);
    $("#awards").text(data.Awards);
    if(data.Poster == "N/A" || data.Poster == undefined){
       $("#poster").attr("src", "https://www.movieinsider.com/images/none_175px.jpg"); //In case the DB doesnt have poster
    } else {
       $("#poster").attr("src", data.Poster);
    }
}


function ajaxCall(){
    // Start loader
    $("#found-movies").empty(); // Clear the list of movies that are displayed
    $(".pages").empty();
    $("#error-message").empty();
    $("#search-loader").show();
    // Get URL form input field
    var searchType = $("input[name=searchType]:checked").val();
    var searchValue = $("#search-bar").val();
    var url = "https://www.omdbapi.com/?s=" + searchValue + "&type=" + searchType + apikey;
    urlForPages = "https://www.omdbapi.com/?s=" + searchValue + "&type=" + searchType + "&"
    $("#search-bar").val('');
    // AJAX call comes here
    $.get(url)
    .done(showMovies)
    .fail(function(){
        $("#search-loader").hide();
        $("#error-message").text("Failed to get info..");
    })
}


// Find each movie in the array if the search came up with content
function showMovies(data){
   if(data.Response == "False"){
       $("#search-loader").hide();
       $("#error-message").text("No results...");
   } else {
       $("#search-loader").hide();
       createPageNums(data);
       data.Search.forEach(showMovie); //callback to showMovie with each of the items from the array
   }
}

// Find each movie in the for the new page that is clicked
function showMoviesNewPage(data){
   if(data.Response == "False"){
       $("#search-loader").hide();
       $("#error-message").text("No results...");
   } else {
       $("#search-loader").hide();
       data.Search.forEach(showMovie); //callback to showMovie with each of the items from the array
   }
}

// For each movie in the array, create a list item and append that item to the view page.
function showMovie(movie){
   if(movie.Poster == "N/A"){
       var generalPoster = "https://www.movieinsider.com/images/none_175px.jpg" //In case the DB doesnt have poster
       var newMovie = $('<div id="'+movie.imdbID+'" class="found-movie"><img src="'+generalPoster+'"><div class="found-info"><p class="movie-title">'+movie.Title+'</p><p class="movie-year">'+movie.Year+'</p></div></div>');
   } else {
       var newMovie = $('<div id="'+movie.imdbID+'" class="found-movie"><img src="'+movie.Poster+'"><div class="found-info"><p class="movie-title">'+movie.Title+'</p><p class="movie-year">'+movie.Year+'</p></div></div>');
   }
   $("#found-movies").append(newMovie);
}

// Create numeration bar to scrolls through the pages of movies
function createPageNums(data){
    var totalPages = Math.ceil(data.totalResults/10)
    for(var i = 1; i <= totalPages; i++){
        if(i < 11){
            if(i==1){
               $(".pages").append("<div id='page="+i+"' class='page-btn selected-page'>"+i+"</div"); //add selected page class
            } else {
                $(".pages").append("<div id='page="+i+"' class='page-btn'>"+i+"</div");
            }
        }
    }
}