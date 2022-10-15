import Router from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import collectionsService from '../services/collections.service';

const router = Router();

// Return list of collections
router.get('/', (req, res, next) => {
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        if (err) {
            next(err);
        }
        else {
            res.json({
                message: 'List of collections',
                result: names?.filter(x => x.name !== 'refreshtokens').map(x => x.name),
            });
        }
    });
});

router.get('/:collection', async (req, res, next) => {
    try {
        const collection = req.params.collection;
        const query = req.query;

        const result = await collectionsService.getAll(collection, query);

        res.json({
            message: `List of ${collection}`,
            result: result,
        })

    } catch (err) {
        next(err);
    }
})

router.post('/:collection',
    body('body').trim().escape(),
    body('title').trim().escape(),
    body('description').trim().escape(),
    body('meta.question').trim().escape(),
    body('meta.circle').trim().escape(),
    authenticateToken(),
    async (req, res, next) => {
        try {
            const collection = req.params.collection;
            const data = req.body;
            const result = await collectionsService.create(collection, data);

            res.status(201)
                .json({
                    message: `Created item in ${collection}`,
                    result: result,
                });
        } catch (err) {
            next(err);
        }
    });

router.get('/:collection/:_id', async (req, res, next) => {
    try {
        const collection = req.params.collection;
        const _id = req.params._id;
        const query = req.query;
        const result = await collectionsService.getOne(collection, _id, query);

        res.json({
            message: `Details of item in ${collection}`,
            result: result,
        })

    } catch (err) {
        next(err);
    }
})

router.patch('/:collection/:_id', authenticateToken(), async (req, res, next) => {
    try {
        const collection = req.params.collection;
        const _id = req.params._id;
        const userId = res.locals.user._id;

        const result = await collectionsService.update(collection, _id, req.body, userId);

        res.json({
            message: `Updated item in ${collection}`,
            result: result,
        });
    } catch (err) {
        next(err);
    }
});

router.post('/:collection/:_id/vote',
    body('upvote').not().isEmpty().isBoolean(),
    body('downvote').not().isEmpty().isBoolean(),
    authenticateToken(),
    async (req, res, next) => {
        try {
            const collection = req.params.collection;
            const itemId = req.params._id;
            const userId = res.locals.user._id;
            const vote = req.body;
            const result = await collectionsService.vote(collection, itemId, userId, vote);
            res.json({
                message: `Voted for item in ${collection}`,
                result: result,
            });
        } catch (err) {
            next(err);
        }
    });

router.delete('/:collection/:_id', authenticateToken(), async (req, res, next) => {
    try {
        const collection = req.params.collection;
        const _id = req.params._id;
        const userId = res.locals.user._id;

        await collectionsService.delete(collection, _id, userId);

        res.status(202).json({
            message: `Deleted item in ${collection}`,
        });
    } catch (err) {
        next(err);
    }
});

export default router;

