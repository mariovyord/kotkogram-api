const mongoose = require('mongoose');
const { Schema, Types, model } = require('mongoose');

mongoose.Schema.Types.String.set('trim', true);

const postSchema = new Schema({
    imageUrl: {
        type: String,
        required: [true, `Image is required`],
    },
    description: {
        type: String,
        required: [true, `Description is required`],
        minlength: [3, 'Minimum length is 3 characters'],
        maxlength: [280, 'Maximum length is 280 characters']
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner ID is required'],
    },
    likes: {
        type: [Types.ObjectId],
        ref: 'User',
        default: [],
    },
},
    { timestamps: true }
)


const Post = model('Post', postSchema);

module.exports = Post;