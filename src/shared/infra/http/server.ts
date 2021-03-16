import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import '@shared/infra/typeorm';
import '@shared/container';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'Error',
            message: err.message,
        });
    }

    console.error(err);
    return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
    });

    next();
});

app.listen(3333, () => {
    console.log('🚀 Server started on port 3333');
});
