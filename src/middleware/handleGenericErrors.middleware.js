// eslint-disable-next-line no-unused-vars
exports.handleErrors = () => (err, req, res, next) => {
    return res
        .status(400)
        .json({
            code: 400,
            message: 'An error occured! Please try again later',
            data: undefined,
            errors: ['An error occured when trying to fetch resources']
        })
}