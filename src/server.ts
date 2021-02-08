import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from './routes';

import uploadConfig from './config/upload';
import AppError from './errors/AppError';
import './database/index';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

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
