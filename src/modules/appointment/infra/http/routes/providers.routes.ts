import { Router } from 'express';
import { container } from 'tsyringe';
import { celebrate, Segments, Joi } from 'celebrate';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointment/services/ListProvidersService';
import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import ListMonthAvailabilityService from '@modules/appointment/services/ListMonthAvailabilityService';
import ListDayAvailabilityService from '@modules/appointment/services/ListDayAvailabilityService';

const providersRouter = Router();
providersRouter.use(ensureAuthenticated);

providersRouter.get('/', async (req, res) => {
    const userId = req.user.id;

    const listProvidersService = container.resolve(ListProvidersService);

    const providers = await listProvidersService.execute(userId);

    return res.status(200).json(classToClass(providers));
});

providersRouter.get(
    '/:provider_id/month-availability',
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    async (req, res) => {
        const { provider_id } = req.params;
        const { month, year } = req.query;
        const listMonthAvailabilityService = container.resolve(
            ListMonthAvailabilityService,
        );

        const availability = await listMonthAvailabilityService.execute({
            provider_id,
            month: Number(month),
            year: Number(year),
        });

        return res.status(200).json(availability);
    },
);

providersRouter.get(
    '/:provider_id/day-availability',
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    async (req, res) => {
        const { provider_id } = req.params;
        const { day, month, year } = req.query;
        const listDayAvailabilityService = container.resolve(
            ListDayAvailabilityService,
        );

        const availability = await listDayAvailabilityService.execute({
            provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year),
        });

        return res.status(200).json(availability);
    },
);

export default providersRouter;
