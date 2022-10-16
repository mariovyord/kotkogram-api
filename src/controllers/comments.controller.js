const Router = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth.middleware');
const commentsService = require('../services/comments.service');
const collectionsService = require('../services/collections.service');
const Comment = require('../models/Comment.model');

const router = Router();

// get all
router.get('/', async (req, res, next) => {
    try {
        const query = req.query;

        const result = await collectionsService.getAll(Comment, query);

        return res.json({
            code: 200,
            message: `List of comments`,
            data: result,
        });

    } catch (err) {
        console.log(err)
        next(err);
    }
})

// post new
router.post('/',
    body('body').trim().escape(),
    authenticateToken(),
    async (req, res, next) => {
        try {
            const data = req.body;
            const userId = res.locals.user._id;

            const result = await commentsService.create({ owner: userId, ...data });

            return res.status(201)
                .json({
                    code: 201,
                    message: `Created item in comments`,
                    data: result,
                });

        } catch (err) {
            next(err);
        }
    });

// get one by id
router.get('/:_id', async (req, res, next) => {
    try {
        const _id = req.params._id;
        const query = req.query;
        const result = await commentsService.getOne(_id, query);

        return res.json({
            code: 200,
            message: `Details of item in comments`,
            data: result,
        });

    } catch (err) {
        next(err);
    }
})

// update one
router.patch('/:_id',
    authenticateToken(),
    async (req, res, next) => {
        try {
            const _id = req.params._id;
            const userId = res.locals.user._id;

            const result = await commentsService.update(_id, userId, req.body);

            return res.json({
                code: 200,
                message: `Updated item in comments`,
                data: result
            });

        } catch (err) {
            next(err);
        }
    });

// delete post
router.delete('/:_id', authenticateToken(), async (req, res, next) => {
    try {
        const _id = req.params._id;
        const userId = res.locals.user._id;

        await commentsService.remove(_id, userId);

        return res.status(202).json({
            code: 202,
            message: `Deleted item in comments`,
            data: undefined,
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;
