var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
    name: {type: String, required: "Must type something"},
    author_id: String,
    movies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie"
        }    
    ],
});

module.exports = mongoose.model("MovieList", listSchema);