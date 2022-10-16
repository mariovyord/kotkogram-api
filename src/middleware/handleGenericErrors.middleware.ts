import { ErrorRequestHandler } from "express";
import { IServerResponse } from "../types/interfaces";

// eslint-disable-next-line no-unused-vars
export const handleErrors = (): ErrorRequestHandler => (err, req, res, next) => {
    return res
        .status(400)
        .json({
            code: 400,
            message: 'An error occured! Please try again later',
            data: undefined,
            errors: ['An error occured when trying to fetch resources']
        } as IServerResponse)
}