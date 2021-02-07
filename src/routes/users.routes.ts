import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
    try {
        const data = req.body;

        const createUser = new CreateUserService();
        const user = await createUser.execute(data);
        // const userWOPassword = {
        //     id: user.id,
        //     name: user.name,
        //     email: user.email,
        //     created_at: user.created_at,
        //     updated_at: user.updated_at,
        // };
        delete user.password;

        return res.json(user);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

export default usersRouter;
