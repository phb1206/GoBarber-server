import { inject, injectable } from 'tsyringe';

import AppointmentRepository from '../repositories/IAppointmentRepository';
import Appointment from '../models/IAppointment';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentRepository')
        private appointmentRepository: AppointmentRepository,
    ) {}

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IRequest): Promise<Appointment[]> {
        return this.appointmentRepository.findAllInDay({
            provider_id,
            year,
            month,
            day,
        });
    }
}

export default ListProviderAppointmentsService;
