import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentRepository';

interface RequestDTO {
    provider: string;
    date: Date;
}

class CreateAppointmentService {
    private appointmentRepository;

    constructor(appointmentRepository: AppointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public execute({ provider, date }: RequestDTO): Appointment {
        const appointmentHour = startOfHour(date);

        if (this.appointmentRepository.findByDate(appointmentHour))
            throw Error('Timeslot already booked');

        const appointment = this.appointmentRepository.create({
            provider,
            date: appointmentHour,
        });
        return appointment;
    }
}

export default CreateAppointmentService;
