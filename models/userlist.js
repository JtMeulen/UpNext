var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
    name: {type: String, required: "Must type something"},
    author_id: String,
    movies: []
}, {usePushEach: true});

module.exports = mongoose.model("MovieList", listSchema);