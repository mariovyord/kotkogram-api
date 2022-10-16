const Router = require('express');
const usersController = require('../controllers/users.controller');
const collectionsController = require('../controllers/collections.controller');

const router = Router();

router.use((req, res, next) => {
    console.log('>>>', req.method, req.url);
    next();
})

router.get('/', (req, res) => {
    res.json({
        message: 'Path should start with /api',
    })
});

router.get('/api', (req, res) => {
    res.json({
        message: 'Hello to Kotkogram REST API',
        endpoints: ['/users', '/collections']
    })
});

// Data Collections
router.use('/api/collections', collectionsController);

// Users (incl. sign up etc.)
router.use('/api/users', usersController);

router.all('*', (req, res) => {
    res.status(404)
        .json({
            code: 404,
            message: 'Path not found',
            data: undefined,
            errors: ['Path not found']
        })
})

module.exports = router;