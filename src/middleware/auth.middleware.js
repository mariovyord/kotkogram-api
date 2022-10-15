import jwt from 'jsonwebtoken';

exports.authenticateToken = () => (req, res, next) => {
    const accessToken = req.headers['x-auth-token'];

    if (!accessToken) return res.status(401)
        .json({
            message: 'Unauthorized',
            errors: ['Access Token needed to continue']
        });

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403)
            .json({
                message: 'Forbidden',
                errors: ['Access Token not valid']
            });

        res.locals.user = user;
        next();
    })
};
