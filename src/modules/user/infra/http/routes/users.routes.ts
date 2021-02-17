import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '@modules/user/services/CreateUserService';
import UpdateUserAvatarService from '@modules/user/services/UpdateUserAvatarService';

import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import { container } from 'tsyringe';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
    const data = req.body;

    const createUser = container.resolve(CreateUserService);
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
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (req, res) => {
        const updateUserAvatarService = container.resolve(
            UpdateUserAvatarService,
        );
        const user = await updateUserAvatarService.execute({
            user_id: req.user.id,
            avatarFileName: req.file.filename,
        });

        delete user.password;
        return res.json(user);
    },
);

export default usersRouter;
