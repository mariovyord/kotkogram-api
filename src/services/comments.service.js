const Comment = require('../models/Comment.model');

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
    return Comment
        .findById(_id)
        .populate(populate, limitPopulate);
}

exports.create = async (data) => {
    const result = new Comment(data);
    await result.save();
    return result;
}

exports.update = async (_id, userId, data) => {
    const post = await Comment.findById(_id);

    if (post === null) throw new Error();
    if (post.owner != userId) throw new Error('Only owners can update items!');

    for (const key of Object.keys(data)) {
        post[key] = data[key];
    }

    await post.save();

    return post;
}

exports.remove = async (_id, userId) => {
    const post = await Comment.findById(_id);
    if (post === null) throw new Error('Post does not exist');

    if (post.owner != userId) throw new Error('Only owners can delete items')

    post.remove()
}

