import { Router } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointment/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (req, res) => {
//     return res.json(await appointmentRepository.find());
// });

appointmentsRouter.post('/', async (req, res) => {
    const user_id = req.user.id;
    const { provider_id, date } = req.body;
    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);
    const appointment = await createAppointment.execute({
        provider_id,
        customer_id: user_id,
        date: parsedDate,
    });

    return res.json(appointment);
});

export default appointmentsRouter;
