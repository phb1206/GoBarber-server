import { inject, injectable } from 'tsyringe';

import { getDaysInMonth, isAfter } from 'date-fns';
import AppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

interface IResponse {
    day: number;
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
        month,
        year,
    }: IRequest): Promise<IResponse[]> {
        const appointments = await this.appointmentRepository.findAllInMonth({
            provider_id,
            year,
            month,
        });

        const monthArray = Array.from(
            { length: getDaysInMonth(month - 1) },
            (_, index) => index + 1,
        );

        const availability = monthArray.map(day => {
            const compareDate = new Date(year, month - 1, day, 17, 59, 59);

            const appointmentsInDay = appointments.filter(
                appointment => appointment.date.getDate() === day,
            );

            return {
                day,
                isAvailable:
                    isAfter(compareDate, new Date()) &&
                    appointmentsInDay.length < 10,
            };
        });
        return availability;
    }
}

export default ListMonthAvailabilityService;
