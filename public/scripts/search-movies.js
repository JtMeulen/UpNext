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

// Movie or own list nav bar button logic
// Search selection
$("#show-search-btn").click(function(){
    $(this).addClass("selected-btn");
    $("#show-list-btn").removeClass("selected-btn");
    $("#movie-list").hide();
    $("#search-list").show();
});

// Own list selection
$("#show-list-btn").click(function(){
    $(this).addClass("selected-btn");
    $("#show-search-btn").removeClass("selected-btn");
    $("#search-list").hide();
    $("#movie-list").show();
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
        $("#found-movies").empty();
        $("#error-message").text("Failed to get info..");
    })
})

function ajaxCall(){
    // manage all the showing fields
    $("#inside-list").hide();
    $("#movies-in-list").empty();
    $("#your-lists").show();
    $("#movie-list").hide();
    $("#search-list").show();
    
    $("#found-movies").empty(); // Clear the list of movies that are displayed
    $(".pages").empty();
    $("#error-message").empty();
    $("#show-search-btn").addClass("selected-btn");
    $("#show-list-btn").removeClass("selected-btn");
    
    // Start loader
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
       var newMovie = $('<div id="'+movie.imdbID+'" class="found-movie">' +
                            '<img src="'+generalPoster+'">' +
                            '<div class="found-info">' +
                                '<p class="movie-title">'+movie.Title+'</p>' +
                                '<p class="movie-year">'+movie.Year+'</p>' +
                            '</div>' + 
                            '<span class="add-btn">+</span>' +
                        '</div>');
   } else {
       var newMovie = $('<div id="'+movie.imdbID+'" class="found-movie">' +
                            '<img src="'+movie.Poster+'">' +
                            '<div class="found-info">' +
                                '<p class="movie-title">'+movie.Title+'</p>' +
                                '<p class="movie-year">'+movie.Year+'</p>' +
                            '</div>' + 
                            '<span class="add-btn">+</span>' +
                        '</div>');
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