import { ErrorRequestHandler } from "express";
import mapErrors from "../utils/mapErrors";

// eslint-disable-next-line no-unused-vars
export const handleErrors = (): ErrorRequestHandler => (err, req, res, next) => {
    console.log(`error ${err.message}`)

    const status = err.code || 400

    res.status(status).json({
        message: 'Error fetching data',
        errors: mapErrors(err.message),
    })
}