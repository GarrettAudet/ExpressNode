const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: {
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 100
    },
});

// Virtual for genre's URL
genreSchema.virtual('url').get(function () {
    // Assuming the URL path would be something like "/catalog/genre/{id}"
    return '/catalog/genre/' + this._id;
});

// Export model
module.exports = mongoose.model("Genre", GenreSchema);