const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./router/router');
const { handleErrors } = require('./middleware/handleGenericErrors.middleware');

// init App
const app = express();

// loads environment variables
dotenv.config();

// middlewares
app.enable('trust proxy');
app.disable('etag');
app.use(cors(
    {
        origin: ["https://kotkogram.web.app", "http://localhost:4200"],
        methods: [['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']],
        allowedHeaders: ['Content-Type', 'Cache-Control', 'Pragma', 'Expires'],
        credentials: true,
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes and error handling
app.use(router);
app.use(handleErrors());

const io = require('socket.io')({ cors: { origin: '*' } });
require('./socket')(io)

module.exports = { app, io };