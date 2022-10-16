import { SortOrder, Types } from 'mongoose';
import QueryString from 'qs';
import Post from '../models/Post.model';
import { IPost } from '../types/interfaces';

export const getAll = async (query: QueryString.ParsedQs) => {
    const options: { [key: string]: string } = {};

    // Search
    if (query.where) {
        const [prop, value] = (query.where as string).split('=');
        options[prop] = value;
    }

    // Sort
    const sort: string | { [key: string]: SortOrder | { $meta: "textScore"; }; } | null | undefined = {};
    if (query.sortBy) {
        const [sortProp, order] = (query.sortBy as string).split(' ');
        // TODO types
        // @ts-ignore: Unreachable code error
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
        pagination.limit = parseInt(query.pageSize as string);
        pagination.skip = Math.max(0, (parseInt(query.page as string) - 1)) * pagination.limit;
    }

    // Populate properties
    let populate = '';
    let limitPopulate = ''
    if (query.populate) {
        populate += query.populate;

        if ((query.populate as string).includes('owner')) {
            limitPopulate += 'username firstName lastName imageUrl'
        }
    }

    // Select properties
    let select = '';
    if (query.select) {
        select += query.select;
    }

    // Result
    const result = Post
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

export const getOne = async (_id: string, query: QueryString.ParsedQs) => {
    // Populate properties
    let populate = '';
    let limitPopulate = ''

    if (query.populate) {
        populate += query.populate;

        if ((query.populate as string).includes('owner')) {
            limitPopulate += 'firstName lastName imageUrl'
        }
    }
    return Post
        .findById(_id)
        .populate(populate, limitPopulate);
}

export const create = async (data: Partial<IPost>) => {
    const result = new Post(data);
    await result.save();
    return result;
}

export const update = async (_id: string, userId: string, data: any) => {
    const post = await Post.findById(_id) as any;

    if (post === null) throw new Error();
    if (post.owner != userId) throw new Error('Only owners can update items!');

    for (const key of Object.keys(data)) {
        post[key] = data[key];
    }

    await post.save();

    return post;
}

export const remove = async (_id: string, userId: string) => {
    const post = await Post.findById(_id);
    if (post === null) throw new Error('Post does not exist');

    if (post.owner != userId) throw new Error('Only owners can delete items')

    post.remove()
}

export const like = async (itemId: string, userId: Types.ObjectId) => {
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

