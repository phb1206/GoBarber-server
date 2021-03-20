import { Router } from 'express';
import { container } from 'tsyringe';
import { celebrate, Segments, Joi } from 'celebrate';

import CreateAppointmentService from '@modules/appointment/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';
import ListProviderAppointmentsService from '@modules/appointment/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
            date: Joi.date().required(),
        },
    }),
    async (req, res) => {
        const user_id = req.user.id;
        const { provider_id, date } = req.body;

        const createAppointment = container.resolve(CreateAppointmentService);
        const appointment = await createAppointment.execute({
            provider_id,
            customer_id: user_id,
            date,
        });

        return res.json(appointment);
    },
);

appointmentsRouter.get('/me', async (req, res) => {
    const provider_id = req.user.id;
    const { day, month, year } = req.query;

    const createAppointment = container.resolve(
        ListProviderAppointmentsService,
    );

    const appointments = await createAppointment.execute({
        provider_id,
        day: Number(day),
        month: Number(month),
        year: Number(year),
    });

    return res.json(classToClass(appointments));
});

export default appointmentsRouter;
