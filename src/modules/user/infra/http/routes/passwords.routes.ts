import { Router } from 'express';
import { container } from 'tsyringe';
import { celebrate, Segments, Joi } from 'celebrate';

import SendForgotPasswordEmailService from '@modules/user/services/SendForgotPasswordEmailService';
import ResetPasswordService from '@modules/user/services/ResetPasswordService';

const passwordRouter = Router();

passwordRouter.post(
    '/forgot',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        },
    }),
    async (req, res) => {
        const { email } = req.body;

        const sendForgotPasswordEmailService = container.resolve(
            SendForgotPasswordEmailService,
        );

        await sendForgotPasswordEmailService.execute(email);

        return res.status(204).json();
    },
);

passwordRouter.patch(
    '/reset',
    celebrate({
        [Segments.BODY]: {
            token: Joi.string().uuid().required(),
            password: Joi.string().required(),
            password_confirmation: Joi.string()
                .required()
                .valid(Joi.ref('password')),
        },
    }),
    async (req, res) => {
        const { token, password } = req.body;

        const resetPasswordService = container.resolve(ResetPasswordService);

        await resetPasswordService.execute({ token, password });

        return res.status(204).json();
    },
);

export default passwordRouter;
