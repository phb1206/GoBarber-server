import { isBefore, startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointment/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointment/repositories/IAppointmentRepository';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
    provider_id: string;
    customer_id: string;
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
        customer_id,
        date,
    }: IRequestDTO): Promise<Appointment> {
        if (provider_id === customer_id)
            throw new AppError(
                "Can't create appointment with same customer/provider",
            );

        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now()))
            throw new AppError("Can't create appointment in the past");

        if (appointmentDate.getHours() < 9)
            throw new AppError("Can't create appointment before 9:00");
        if (appointmentDate.getHours() > 18)
            throw new AppError("Can't create appointment after 18:00");

        if (await this.appointmentsRepository.findByDate(appointmentDate))
            throw new AppError('Timeslot already booked');

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            customer_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
