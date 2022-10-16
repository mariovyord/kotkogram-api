const mongoose = require('mongoose');
const { Schema, Types, model } = require('mongoose');

mongoose.Schema.Types.String.set('trim', true);

const commentSchema = new Schema({
    body: {
        type: String,
        required: [true, "Comment can't be empty"],
        minlength: [3, 'Minimum length is 3 characters'],
        maxlength: [280, 'Maximum length is 280 characters'],
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner ID is required'],
    },
    postId: {
        type: Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post ID is required']
    },
},
    { timestamps: true }
)

const Comment = model('Comment', commentSchema);

module.exports = Comment;