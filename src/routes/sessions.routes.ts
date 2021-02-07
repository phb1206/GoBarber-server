import { Router } from 'express';

import AuthenticeteUserService from '../services/AuthenticeteUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    try {
        const data = req.body;

        const authUser = new AuthenticeteUserService();
        const { user, token } = await authUser.execute(data);
        delete user.password;

        return res.json({ user, token });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

export default sessionsRouter;
