import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { IServerResponse } from '../types/IServerResponse';

export const authenticateToken = (): RequestHandler => (req, res, next) => {
    const accessToken = req.cookies.jwt;

    if (!accessToken) {
        return res
            .status(401)
            .json({
                code: 401,
                message: 'Unauthorized',
                data: undefined,
                errors: ['Access Token needed to continue']
            } as IServerResponse);
    }

    jwt.verify(accessToken, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
            return res
                .clearCookie('jwt')
                .status(403)
                .json({
                    code: 403,
                    message: 'Forbidden',
                    data: undefined,
                    errors: ['Access Token not valid']
                } as IServerResponse);
        } else {
            res.locals.user = user;
            next();
        }
    })
};
