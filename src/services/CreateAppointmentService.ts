import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentRepository';

interface RequestDTO {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({
        provider_id,
        date,
    }: RequestDTO): Promise<Appointment> {
        const appointmentRepository = getCustomRepository(
            AppointmentRepository,
        );

        const appointmentHour = startOfHour(date);

        if (await appointmentRepository.findByDate(appointmentHour))
            throw Error('Timeslot already booked');

        const appointment = appointmentRepository.create({
            provider_id,
            date: appointmentHour,
        });
        await appointmentRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;