var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
    title: String,
    Poster: String,
    Year: String,
    imdbID: String
});

module.exports = mongoose.model("Movie", movieSchema);