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
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes and error handling
app.use(router);
app.use(handleErrors());

module.exports = app;