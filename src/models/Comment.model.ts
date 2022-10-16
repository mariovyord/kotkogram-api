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
    postId: {
        type: Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post ID is required']
    },
},
    { timestamps: true }
)

const Comment = model('Comment', commentSchema);

export default Comment;