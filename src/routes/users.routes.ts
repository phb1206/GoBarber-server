import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

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

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (req, res) => {
        try {
            const updateUserAvatarService = new UpdateUserAvatarService();
            const user = await updateUserAvatarService.execute({
                user_id: req.user.id,
                avatarFileName: req.file.filename,
            });

            delete user.password;
            return res.json(user);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
);

export default usersRouter;
