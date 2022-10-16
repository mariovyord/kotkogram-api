import { Schema, Types, model } from 'mongoose';
import { IPost } from '../types/interfaces';

const postSchema = new Schema<IPost>({
    imageUrl: {
        type: String,
        required: [true, `Image is required`],
    },
    description: {
        type: String,
        required: [true, `Description is required`],
        minlength: [3, 'Minimum length is 2 characters'],
        maxlength: [300, 'Maximum length is 1500 characters']
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


const Post = model<IPost>('Post', postSchema);

export default Post;