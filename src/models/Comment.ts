import { Schema, Types, model } from 'mongoose';

const commentSchema = new Schema({
    body: {
        type: String,
        required: [true, "Comment can't be empty"],
        minlength: [2, 'Minimum length is 2 characters']
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner ID is required'],
    },
    answer: {
        type: Types.ObjectId,
        ref: 'Answer',
        required: [true, 'Answer ID is required']
    },
},
    { timestamps: true }
)

const Comment = model('Comment', commentSchema);

module.exports = Comment;