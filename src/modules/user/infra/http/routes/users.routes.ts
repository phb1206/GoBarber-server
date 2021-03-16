import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';
import { celebrate, Segments, Joi } from 'celebrate';

import CreateUserService from '@modules/user/services/CreateUserService';
import UpdateUserAvatarService from '@modules/user/services/UpdateUserAvatarService';
import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            password_confirmation: Joi.string()
                .required()
                .valid(Joi.ref('password')),
        },
    }),
    async (req, res) => {
        const data = req.body;

        const createUser = container.resolve(CreateUserService);
        const user = await createUser.execute(data);
        delete user.password;

        return res.json(user);
    },
);

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
