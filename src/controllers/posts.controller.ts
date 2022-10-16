import Router from 'express';
import { body } from 'express-validator';
import { Types } from 'mongoose';
import { authenticateToken } from '../middleware/auth.middleware';
import * as postsService from '../services/posts.service';
import * as collectionsService from '../services/collections.service';
import Post from '../models/Post.model';
import { IServerResponse } from '../types/interfaces';

const router = Router();

// get all
router.get('/', async (req, res, next) => {
    try {
        const query = req.query;

        const result = await collectionsService.getAll(Post, query);

        const responseJson: IServerResponse = {
            code: 200,
            message: `List of posts`,
            data: result,
        }

        return res.json(responseJson);

    } catch (err) {
        next(err);
    }
})

// post new
router.post('/',
    body('imageUrl').trim().escape(),
    body('description').trim().escape(),
    authenticateToken(),
    async (req, res, next) => {
        try {
            const data = req.body;
            const userId = res.locals.user._id;

            const result = await postsService.create({ owner: userId, ...data });

            const responseJson: IServerResponse = {
                code: 201,
                message: `Created item in posts`,
                data: result,
            }

            return res.status(201)
                .json(responseJson);

        } catch (err) {
            next(err);
        }
    });

// get one by id
router.get('/:_id', async (req, res, next) => {
    try {
        const _id = req.params._id;
        const query = req.query;
        const result = await postsService.getOne(_id, query);

        const responseJson: IServerResponse = {
            code: 200,
            message: `Details of item in posts`,
            data: result,
        }

        return res.json(responseJson);

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

            const result = await postsService.update(_id, userId, req.body);

            const responseJson: IServerResponse = {
                code: 200,
                message: `Updated item in posts`,
                data: result
            }

            return res.json(responseJson);

        } catch (err) {
            next(err);
        }
    });

// add/remove like
router.post('/:_id/like',
    authenticateToken(),
    async (req, res, next) => {
        try {
            const postId = req.params._id;
            const userId = res.locals.user._id;

            const result = await postsService.like(postId, new Types.ObjectId(userId));

            const responseJson: IServerResponse = {
                code: 200,
                message: `Voted for item in posts`,
                data: result,
            }

            return res.json(responseJson);

        } catch (err) {
            next(err);
        }
    });

// delete post
router.delete('/:_id', authenticateToken(), async (req, res, next) => {
    try {
        const _id = req.params._id;
        const userId = res.locals.user._id;

        await postsService.remove(_id, userId);

        const responseJson: IServerResponse = {
            code: 202,
            message: `Deleted item in posts`,
            data: undefined,
        }

        return res.status(202).json(responseJson);

    } catch (err) {
        next(err);
    }
});

export default router;
