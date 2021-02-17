import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointment/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointment/repositories/IAppointmentRepository';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentRepository')
        private appointmentsRepository: IAppointmentRepository,
    ) {}

    public async execute({
        provider_id,
        date,
    }: IRequestDTO): Promise<Appointment> {
        const appointmentHour = startOfHour(date);

        if (await this.appointmentsRepository.findByDate(appointmentHour))
            throw new AppError('Timeslot already booked');

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentHour,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
