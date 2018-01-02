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
});

$("#show-list-btn").click(function(){
    var username = $(".current_username").attr("id");
    
    $.get("/api/list")
    .done(function(data){
        data.forEach(function(list){
            if(list.author_id == username){
                var newList = $('<div id="'+list.id+'"><p>'+list.name+'</p></div>')
                $("#found-lists").append(newList);
            }
        })
    })
})

