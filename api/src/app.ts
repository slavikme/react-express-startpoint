import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import apiV1 from './v1';
import middlewares from './middlewares';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Express Works! Yeah!',
  });
});

app.use('/v1', apiV1);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
