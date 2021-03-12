import { Router } from 'express';
import { container } from 'tsyringe';

import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import ShowProfileService from '@modules/user/services/ShowProfileService';
import UpdateProfileService from '@modules/user/services/UpdateProfileService';

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', async (req, res) => {
    const user_id = req.user.id;
    const showProfileService = container.resolve(ShowProfileService);
    const user = await showProfileService.execute(user_id);
    return res.status(200).json(user);
});

profileRouter.put('/', async (req, res) => {
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

    return res.status(200).json(user);
});

export default profileRouter;
