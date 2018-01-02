/* global $ */

$("#create-list-btn").click(function(){
    var name = $("#list-name").val();
    $.post("/api/userlist", {name: name})
    .then(function(newlist){
        $("#list-name").val("");
        console.log(newlist)
    })
    .catch(function(err){
        console.log(err)
    });
})

