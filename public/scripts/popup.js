/* global $ */

// Click on  a movie to see more details about it in a popup screen
$(".movies").on("click", "div", function(){
    $("#popup-loader").show();
    var clickedId = $(this).attr('id');
    var url = "https://www.omdbapi.com/?i=" + clickedId + "&plot=full" + apikey;
    // AJAX call comes here
    $.get(url)
    .done(fillPopup)
    .fail(function(){
        console.log("couldnt do it")
    })
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