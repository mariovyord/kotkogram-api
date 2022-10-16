const Post = require('../models/Post.model');

exports.getOne = async (_id, query) => {
    // Populate properties
    let populate = '';
    let limitPopulate = ''

    if (query.populate) {
        populate += query.populate;

        if (query.populate.includes('owner')) {
            limitPopulate += 'firstName lastName imageUrl'
        }
    }
    return Post
        .findById(_id)
        .populate(populate, limitPopulate);
}

exports.create = async (data) => {
    const result = new Post(data);
    await result.save();
    return result;
}

exports.update = async (_id, userId, data) => {
    const post = await Post.findById(_id);

    if (post === null) throw new Error();
    if (post.owner != userId) throw new Error('Only owners can update items!');

    for (const key of Object.keys(data)) {
        post[key] = data[key];
    }

    await post.save();

    return post;
}

exports.remove = async (_id, userId) => {
    const post = await Post.findById(_id);
    if (post === null) throw new Error('Post does not exist');

    if (post.owner != userId) throw new Error('Only owners can delete items')

    post.remove()
}

exports.like = async (itemId, userId) => {
    const post = await Post.findById(itemId);
    if (post === null) throw new Error('Post does not exist');

    const existingIndex = post.likes.indexOf(userId);

    if (existingIndex !== -1) {
        post.likes.splice(existingIndex, 1);
    } else {
        post.likes.push(userId);
    }

    await post.save();

    return post;
}

