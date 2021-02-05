import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentRepository from '../repositories/AppointmentRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentRepository = new AppointmentRepository();

appointmentsRouter.get('/', (req, res) => {
    return res.json(appointmentRepository.getAppointments());
});

appointmentsRouter.post('/', (req, res) => {
    try {
        const { provider, date } = req.body;
        const parsedDate = parseISO(date);

        const createAppointmentService = new CreateAppointmentService(
            appointmentRepository,
        );
        const appointment = createAppointmentService.execute({
            provider,
            date: parsedDate,
        });

        return res.json(appointment);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

export default appointmentsRouter;
