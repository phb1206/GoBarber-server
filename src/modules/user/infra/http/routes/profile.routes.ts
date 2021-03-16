import { Router } from 'express';
import { container } from 'tsyringe';
import { celebrate, Segments, Joi } from 'celebrate';
import { classToClass } from 'class-transformer';

import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import ShowProfileService from '@modules/user/services/ShowProfileService';
import UpdateProfileService from '@modules/user/services/UpdateProfileService';

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', async (req, res) => {
    const user_id = req.user.id;
    const showProfileService = container.resolve(ShowProfileService);
    const user = await showProfileService.execute(user_id);
    return res.status(200).json(classToClass(user));
});

profileRouter.put(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string(),
            old_password: Joi.string().when('password', {
                is: Joi.exist(),
                then: Joi.required(),
            }),
            password_confirmation: Joi.string()
                .valid(Joi.ref('password'))
                .when('password', {
                    is: Joi.exist(),
                    then: Joi.required(),
                }),
        },
    }),
    async (req, res) => {
        const user_id = req.user.id;
        const { name, email, old_password, password } = req.body;

        const updateProfileService = container.resolve(UpdateProfileService);
        const user = await updateProfileService.execute({
            user_id,
            name,
            email,
            old_password,
            password,
        });

        return res.status(200).json(classToClass(user));
    },
);

export default profileRouter;
