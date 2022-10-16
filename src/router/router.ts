import Router from 'express';
import usersController from '../controllers/users.controller';
import postsController from '../controllers/posts.controller';

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
router.all('/api/collections', (req, res) => {
    res.json({
        message: 'Hello to Collections Service',
        endpoints: ['/comments', '/posts']
    })
});

router.use('/api/collections/posts', postsController);

// Users (incl. sign up etc.)
router.use('/api/users', usersController);

router.all('*', (req, res) => {
    res.status(404).json({
        message: 'Path not found'
    })
})

export default router;