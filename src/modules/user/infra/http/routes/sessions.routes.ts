import { Router } from 'express';
import { container } from 'tsyringe';
import { celebrate, Segments, Joi } from 'celebrate';
import { classToClass } from 'class-transformer';

import AuthenticeteUserService from '@modules/user/services/AuthenticeteUserService';

const sessionsRouter = Router();

sessionsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    async (req, res) => {
        const data = req.body;

        const authUser = container.resolve(AuthenticeteUserService);
        const { user, token } = await authUser.execute(data);
        // delete user.password;

        return res.json({ user: classToClass(user), token });
    },
);

export default sessionsRouter;
