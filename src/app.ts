import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './router/router';

import { handleErrors } from './middleware/handleGenericErrors.middleware';

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

export default app;