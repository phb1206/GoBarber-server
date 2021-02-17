import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticeteUserService from '@modules/user/services/AuthenticeteUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    const data = req.body;

    const authUser = container.resolve(AuthenticeteUserService);
    const { user, token } = await authUser.execute(data);
    delete user.password;

    return res.json({ user, token });
});

export default sessionsRouter;
