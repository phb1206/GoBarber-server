import { inject, injectable } from 'tsyringe';

import CacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
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

        @inject('CacheProvider')
        private cacheProvider: CacheProvider,
    ) {}

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IRequest): Promise<Appointment[]> {
        const cacheKey = `provider_appointments:${provider_id}:${year}:${month}:${day}`;

        let appointments = await this.cacheProvider.get<Appointment[]>(
            cacheKey,
        );

        if (!appointments) {
            appointments = await this.appointmentRepository.findAllInDay({
                provider_id,
                year,
                month,
                day,
            });

            await this.cacheProvider.save(cacheKey, classToClass(appointments));
        }

        return appointments;
    }
}

export default ListProviderAppointmentsService;
