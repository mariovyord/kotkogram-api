const mapErrors = require("../utils/mapErrors")

// eslint-disable-next-line no-unused-vars
exports.handleErrors = () => (err, req, res, next) => {
    console.log(`error ${err.message}`)

    const status = err.code || 400

    res.status(status)
        .json({
            code: status,
            message: 'Error fetching data',
            data: undefined,
            errors: mapErrors(err.message)
        })
}