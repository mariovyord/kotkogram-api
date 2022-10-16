import { Model, SortOrder } from 'mongoose';
import QueryString from 'qs';

export const getAll = async (Collection: Model<any>, query: QueryString.ParsedQs) => {
    const options: { [key: string]: string | string[] } = {};
    console.log(query)
    // Search
    if (Array.isArray(query.where)) {
        (query.where as string[])
            .forEach(x => {
                const [prop, value] = x.split('=');
                options[prop] = value;
            })
    } else if (typeof query.where === 'string') {
        const [prop, value] = (query.where as string).split('=');
        options[prop] = value;
    }

    // Sort
    const sort: { [key: string]: SortOrder } = {};
    if (Array.isArray(query.sortBy)) {
        (query.sortBy as string[])
            .forEach(x => {
                const [sortProp, order] = x.split(' ');
                sort[sortProp] = order as SortOrder;
            })
    } else if (typeof query.sortBy === 'string') {
        const [sortProp, order] = (query.sortBy as string).split(' ');
        sort[sortProp] = order as SortOrder;
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

    if (Array.isArray(query.populate)) {
        populate += query.populate.join(' ');
    } else if (typeof query.populate === 'string') {
        populate += query.populate;
    }

    if (query.populate && (query.populate as string).includes('owner')) {
        limitPopulate += 'username firstName lastName imageUrl'
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