import Router from 'express';
import { body, validationResult } from 'express-validator';

import { authenticateToken } from '../middleware/auth.middleware';

import { getUserData, patchUserData, } from '../services/users.service';
import { signup, login, logout } from '../services/auth.service';
import mapErrors from '../utils/mapErrors';

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

            const userData = req.body;
            const result = await signup(userData);

            res.json({
                message: 'Sign up successful',
                result: result,
            });

        } catch (err) {
            res.status(400)
                .json({
                    message: 'Sign up failed',
                    errors: mapErrors(err),
                })
        }
    });

router.post('/login',
    body('username').trim().toLowerCase().escape(),
    body('password').trim().escape(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw (errors.array().map(x => ({ message: x.msg })))
            }

            const userData = req.body;
            const result = await login(userData.username, userData.password);

            res.json({
                message: 'Login successful',
                result: result,
            });

        } catch (err) {
            return res.status(401)
                .json({
                    message: 'Login up failed',
                    errors: mapErrors(err),
                });
        }
    }
);

router.delete('/logout',
    body('refreshToken').trim().not().isEmpty(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new Error();
            }

            await logout(req.body.refreshToken);

            res.json({
                message: 'Logout successful',
            });

        } catch (err) {
            res.status(400)
                .json({
                    message: 'Logout failed',
                    errors: mapErrors(err),
                });
        }
    }
)

router.get('/:_id', authenticateToken(), async (req, res, next) => {
    try {
        const userId = res.locals.user._id;
        const requestUserId = req.params._id;

        let isOwner = false;
        if (userId == requestUserId) isOwner = true;

        const userData = await getUserData(requestUserId, isOwner);

        res.json({
            message: 'User data',
            result: userData
        });
    } catch (err) {
        next(err);
    }
});

router.patch('/:_id',
    body('firstName').trim().escape(),
    body('lastName').trim().escape(),
    body('description').trim().escape(),
    body('password').trim(),
    body('imageUrl').trim(),
    authenticateToken(),
    async (req, res, next) => {
        try {
            const userId = res.locals.user._id;
            const requestUserId = req.params._id;

            if (userId != requestUserId) throw new Error();

            const data = req.body;
            const userData = await patchUserData(userId, data);

            res.json({
                message: 'User data updated',
                result: userData
            });
        } catch (err) {
            next(err);
        }
    }
);

export default router;

