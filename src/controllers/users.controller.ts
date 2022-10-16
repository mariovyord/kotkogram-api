import Router from 'express';
import { body, validationResult } from 'express-validator';
import { IServerResponse } from '../types/interfaces';

import { authenticateToken } from '../middleware/auth.middleware';

import * as usersService from '../services/users.service';
import { IUser } from '../types/IUser';
import mapErrors from '../utils/mapErrors';
import { PublicUser } from '../common/PublicUser';

const router = Router();

router.all('/', (req, res) => {
    res.json({
        message: 'Welcome to users service!',
        endpoints: {
            login: '/login; POST',
            signup: '/signup; POST',
            logout: '/logout; DELETE',
            authenticate: '/me; GET',
            userData: '/_id; GET',
            editUserData: '/_id; PATCH',
        }
    })
})

router.post('/signup',
    body('username').trim().not().isEmpty().toLowerCase().escape(),
    body('firstName').trim().not().isEmpty().escape(),
    body('lastName').trim().not().isEmpty().escape(),
    body('password').trim().not().isEmpty().custom(function noBlacklistedChars(params) {
        return /\W/.test(params) === false;
    }),
    body('description').trim().escape(),
    async (req, res) => {
        try {
            // check for errors from validator and throw array if any
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw (errors.array().map(x => ({ message: x.msg })))
            }

            const userData = req.body as IUser;
            const result = await usersService.signup(userData);

            return res
                .cookie('jwt', result.token, {
                    httpOnly: true,
                    sameSite: false,
                    secure: true,
                })
                .json({
                    code: 200,
                    message: 'Signup successful',
                    data: new PublicUser(result.user),
                } as IServerResponse);

        } catch (err) {
            return res
                .status(403)
                .json({
                    code: 403,
                    message: 'Signup failed',
                    data: undefined,
                    errors: mapErrors(err),
                } as IServerResponse);
        }
    });

router.post('/login',
    body('username').trim().toLowerCase().escape(),
    body('password').trim().escape(),
    async (req, res) => {
        try {
            // check for errors from validator and throw array of errors if any
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw (errors.array().map(x => ({ message: x.msg })))
            }

            // get user data from body and call service
            const userData = req.body;
            const result = await usersService.login(userData.username, userData.password);

            // return response
            return res
                .cookie('jwt', result.token, {
                    httpOnly: true,
                    sameSite: false,
                    expires: new Date(Date.now() + 900000), // 15 min life
                    secure: true,
                })
                .json({
                    code: 200,
                    message: 'Login successful',
                    data: new PublicUser(result.user),
                } as IServerResponse);

        } catch (err) {
            return res
                .status(403)
                .json({
                    code: 403,
                    message: 'Login failed',
                    data: undefined,
                    errors: mapErrors(err),
                } as IServerResponse);
        }
    }
);

router.delete('/logout',
    authenticateToken(),
    async (req, res) => {
        return res
            .clearCookie('jwt')
            .json({
                code: 200,
                message: 'Logout successful',
                data: undefined,
                errors: undefined,
            } as IServerResponse);
    }
)

router.get('/me',
    authenticateToken(),
    async (req, res) => {
        try {
            const userId = res.locals.user._id;

            const userData = await usersService.getUserData(userId) as IUser;

            return res.json({
                code: 200,
                message: 'User data',
                data: new PublicUser(userData),
            } as IServerResponse);

        } catch (err) {
            return res
                .clearCookie('jwt')
                .status(401)
                .json({
                    code: 401,
                    message: 'Unauthorized',
                    data: undefined,
                    errors: ['Unauthorized', 'Please login'],
                } as IServerResponse);
        }
    });

router.get('/:_id',
    authenticateToken(),
    async (req, res) => {
        try {
            const requestUserId = req.params._id;

            const userData = await usersService.getUserData(requestUserId) as IUser;

            return res.json({
                code: 200,
                message: 'User data',
                data: new PublicUser(userData),
            } as IServerResponse);

        } catch (err) {
            return res
                .status(404)
                .json({
                    code: 404,
                    message: 'No user found',
                    data: undefined,
                    errors: ['No user found'],
                } as IServerResponse);
        }
    });

router.patch('/:_id',
    body('username').trim().toLowerCase().escape(),
    body('firstName').trim().escape(),
    body('lastName').trim().escape(),
    body('description').trim().escape(),
    authenticateToken(),
    async (req, res) => {
        try {
            const userId = res.locals.user._id;
            const requestUserId = req.params?._id;

            if (userId != requestUserId || req.params === undefined) {
                throw new Error();
            }

            const userData: IUser = await usersService.patchUserData(userId, req.body);

            return res.json({
                code: 200,
                message: 'User data updated',
                data: new PublicUser(userData),
            } as IServerResponse);

        } catch (err) {
            return res
                .clearCookie('jwt')
                .status(401)
                .json({
                    code: 401,
                    message: 'Unauthorized',
                    data: undefined,
                    errors: ['Error updating user'],
                } as IServerResponse);
        }
    }
);

export default router;

