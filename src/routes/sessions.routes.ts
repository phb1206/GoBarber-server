import { Router } from 'express';

import AuthenticeteUserService from '../services/AuthenticeteUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    const data = req.body;

    const authUser = new AuthenticeteUserService();
    const { user, token } = await authUser.execute(data);
    delete user.password;

    return res.json({ user, token });
});

export default sessionsRouter;
