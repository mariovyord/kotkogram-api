import Router from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import * as commentsService from '../services/comments.service';
import { IServerResponse } from '../types/interfaces';

const router = Router();

// get all
router.get('/', async (req, res, next) => {
    try {
        const query = req.query;

        const result = await commentsService.getAll(query);

        const responseJson: IServerResponse = {
            code: 200,
            message: `List of comments`,
            data: result,
        }

        return res.json(responseJson);

    } catch (err) {
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

            const responseJson: IServerResponse = {
                code: 201,
                message: `Created item in comments`,
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
        const result = await commentsService.getOne(_id, query);

        const responseJson: IServerResponse = {
            code: 200,
            message: `Details of item in comments`,
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

            const result = await commentsService.update(_id, userId, req.body);

            const responseJson: IServerResponse = {
                code: 200,
                message: `Updated item in comments`,
                data: result
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

        await commentsService.remove(_id, userId);

        const responseJson: IServerResponse = {
            code: 202,
            message: `Deleted item in comments`,
            data: undefined,
        }

        return res.status(202).json(responseJson);

    } catch (err) {
        next(err);
    }
});

export default router;
