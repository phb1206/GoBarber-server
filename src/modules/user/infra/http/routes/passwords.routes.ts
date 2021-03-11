import { Router } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from '@modules/user/services/SendForgotPasswordEmailService';
import ResetPasswordService from '@modules/user/services/ResetPasswordService';

const passwordRouter = Router();

passwordRouter.post('/forgot', async (req, res) => {
    const { email } = req.body;

    const sendForgotPasswordEmailService = container.resolve(
        SendForgotPasswordEmailService,
    );

    await sendForgotPasswordEmailService.execute(email);

    return res.status(204).json();
});

passwordRouter.patch('/reset', async (req, res) => {
    const { token, password } = req.body;

    const resetPasswordService = container.resolve(ResetPasswordService);

    await resetPasswordService.execute({ token, password });

    return res.status(204).json();
});

export default passwordRouter;
