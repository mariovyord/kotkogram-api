exports.getAll = async (Collection, query) => {
    const options = {};
    console.log(query)
    // Search
    if (Array.isArray(query.where)) {
        query.where
            .forEach(x => {
                const [prop, value] = x.split('=');
                options[prop] = value;
            })
    } else if (typeof query.where === 'string') {
        const [prop, value] = query.where.split('=');
        options[prop] = value;
    }

    // Sort
    const sort = {};
    if (Array.isArray(query.sortBy)) {
        query.sortBy
            .forEach(x => {
                const [sortProp, order] = x.split(' ');
                sort[sortProp] = order;
            })
    } else if (typeof query.sortBy === 'string') {
        const [sortProp, order] = (query.sortBy).split(' ');
        sort[sortProp] = order;
    } else {
        sort.createdAt = 'asc';
    }

    // Pagination
    const pagination = {
        limit: 10,
        skip: 0,
    }

    if (query.page && query.pageSize) {
        pagination.limit = parseInt(query.pageSize);
        pagination.skip = Math.max(0, (parseInt(query.page) - 1)) * pagination.limit;
    }

    // Populate properties
    let populate = '';
    let limitPopulate = ''

    if (Array.isArray(query.populate)) {
        populate += query.populate.join(' ');
    } else if (typeof query.populate === 'string') {
        populate += query.populate;
    }

    if (query.populate && (query.populate).includes('owner')) {
        limitPopulate += 'username firstName lastName imageUrl followers'
    }

    // Select properties
    let select = '';
    if (Array.isArray(query.select)) {
        select += query.select.join(' ');
    } else if (typeof query.select === 'string') {
        select += query.select;
    }

    // Result
    const result = Collection
        .find(options)
        .sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip)
        .populate(populate, limitPopulate)
        .select(select);

    // Return count if specified
    if (query.count === 'true') {
        if (query.where) return result.count();
        return result.estimatedDocumentCount();
    }

    return result;
}

exports.getOne = async (collection, _id, query) => {
    // Populate properties
    let populate = '';
    let limitPopulate = ''

    if (query.populate) {
        populate += query.populate;

        if (query.populate.includes('owner')) {
            limitPopulate += 'firstName lastName imageUrl'
        }
    }
    return collection
        .findById(_id)
        .populate(populate, limitPopulate);
}

exports.create = async (collection, data) => {
    const result = new collection(data);
    await result.save();
    return result;
}

exports.update = async (collection, _id, userId, data) => {
    const post = await collection.findById(_id);

    if (post === null) throw new Error();
    if (post.owner != userId) throw new Error('Only owners can update items!');

    for (const key of Object.keys(data)) {
        post[key] = data[key];
    }

    await post.save();

    return post;
}

exports.remove = async (collection, _id, userId) => {
    const post = await collection.findById(_id);
    if (post === null) throw new Error('Item does not exist');

    if (post.owner != userId) throw new Error('Only owners can delete items')

    post.remove()
}

exports.like = async (collection, itemId, userId) => {
    const post = await collection.findById(itemId);
    if (post === null) throw new Error('Item does not exist');

    const existingIndex = post.likes.indexOf(userId);

    if (existingIndex !== -1) {
        post.likes.splice(existingIndex, 1);
    } else {
        post.likes.push(userId);
    }

    await post.save();

    return post;
}

