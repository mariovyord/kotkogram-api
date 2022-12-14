const Router = require('express');
const { Types } = require('mongoose');
const { body } = require('express-validator');

const { authenticateToken } = require('../middleware/auth.middleware');

const collectionsService = require('../services/collections.service');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');
const router = Router();

const getCollection = (collection) => {
    switch (collection) {
        case 'posts': return Post
        case 'comments': return Comment
        default: throw new Error('Collection does not exist')
    }
}

router.all('/', (req, res) => {
    res.json({
        message: 'Hello to Collections Service',
        endpoints: ['/comments', '/posts']
    })
});

// get all
router.get('/:collection', async (req, res, next) => {
    try {
        const query = req.query;
        const collectionName = req.params.collection
        const collection = getCollection(collectionName);

        const result = await collectionsService.getAll(collection, query);

        return res.json({
            code: 200,
            message: `List of ${collectionName}`,
            data: result,
        });

    } catch (err) {
        next(err);
    }
})

// post new
router.post('/:collection',
    authenticateToken(),
    body('body').optional().trim(),
    body('postId').optional().trim(),
    body('imageUrl').optional().trim(),
    body('description').optional().trim(),
    async (req, res, next) => {
        try {
            const data = req.body;
            const userId = res.locals.user._id;
            const collectionName = req.params.collection
            const collection = getCollection(collectionName);

            const result = await collectionsService.create(collection, { owner: userId, ...data });

            return res.status(201)
                .json({
                    code: 201,
                    message: `Created item in ${collectionName}`,
                    data: result,
                });

        } catch (err) {
            next(err);
        }
    });

// get one by id
router.get('/:collection/:_id', async (req, res, next) => {
    try {
        const _id = req.params._id;
        const query = req.query;
        const collectionName = req.params.collection
        const collection = getCollection(collectionName);

        const result = await collectionsService.getOne(collection, _id, query);

        return res.json({
            code: 200,
            message: `Details of item in posts`,
            data: result,
        });

    } catch (err) {
        next(err);
    }
})

// update one
router.patch('/:collection/:_id',
    authenticateToken(),
    body('body').optional().trim(),
    body('postId').optional().trim(),
    body('imageUrl').optional().trim(),
    body('description').optional().trim(),
    async (req, res, next) => {
        try {
            const _id = req.params._id;
            const userId = res.locals.user._id;
            const collectionName = req.params.collection
            const collection = getCollection(collectionName);

            const result = await collectionsService.update(collection, _id, userId, req.body);

            return res.json({
                code: 200,
                message: `Updated item in posts`,
                data: result
            });

        } catch (err) {
            next(err);
        }
    });

// delete post
router.delete('/:collection/:_id',
    authenticateToken(),
    async (req, res, next) => {
        try {
            const _id = req.params._id;
            const userId = res.locals.user._id;
            const collectionName = req.params.collection
            const collection = getCollection(collectionName);

            await collectionsService.remove(collection, _id, userId);

            return res.status(202).json({
                code: 202,
                message: `Deleted item in ${collectionName}`,
                data: undefined,
            });

        } catch (err) {
            next(err);
        }
    });

// add/remove like
router.post('/:collection/:_id/like',
    authenticateToken(),
    async (req, res, next) => {
        try {
            const postId = req.params._id;
            const userId = res.locals.user._id;
            const collectionName = req.params.collection
            const collection = getCollection(collectionName);

            const result = await collectionsService.like(collection, postId, new Types.ObjectId(userId));

            return res.json({
                code: 200,
                message: `Voted for item in posts`,
                data: result,
            });

        } catch (err) {
            next(err);
        }
    });

module.exports = router;
