const mongoose = require('mongoose');

// user Schema

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

// post Model
let Post = module.exports = mongoose.model('Post', postSchema);