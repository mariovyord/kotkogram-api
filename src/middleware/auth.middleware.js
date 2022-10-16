const jwt = require('jsonwebtoken');

exports.authenticateToken = () => (req, res, next) => {
    const accessToken = req.cookies.jwt;

    if (!accessToken) {
        return res
            .status(401)
            .json({
                code: 401,
                message: 'Unauthorized',
                data: undefined,
                errors: ['Access Token needed to continue']
            });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res
                .clearCookie('jwt')
                .status(403)
                .json({
                    code: 403,
                    message: 'Forbidden',
                    data: undefined,
                    errors: ['Access Token not valid']
                });
        } else {
            res.locals.user = user;
            next();
        }
    })
};
