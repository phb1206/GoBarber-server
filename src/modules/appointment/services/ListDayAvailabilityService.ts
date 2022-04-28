import isAfter from 'date-fns/isAfter';
import { inject, injectable } from 'tsyringe';

import AppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

interface IResponse {
    hour: number;
    isAvailable: boolean;
}

@injectable()
class ListMonthAvailabilityService {
    constructor(
        @inject('AppointmentRepository')
        private appointmentRepository: AppointmentRepository,
    ) {}

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IRequest): Promise<IResponse[]> {
        const appointments = await this.appointmentRepository.findAllInDay({
            provider_id,
            year,
            month,
            day,
        });

        const dayArray = Array.from({ length: 10 }, (_, index) => index + 8);

        const availability = dayArray.map(hour => {
            const currentDate = new Date(Date.now());
            const thisDate = new Date(year, month - 1, day, hour);

            const hourBooked = appointments.some(
                appointment => appointment.date.getUTCHours() === hour,
            );

            return {
                hour,
                isAvailable: !hourBooked && isAfter(thisDate, currentDate),
            };
        });

        return availability;
    }
}

export default ListMonthAvailabilityService;
