import { v4 as uuid4 } from 'uuid';
import { isEqual } from 'date-fns';

import IAppointmentRepository from '@modules/appointment/repositories/IAppointmentRepository';
import CreateAppointmentDTO from '@modules/appointment/dtos/CreateAppointmentDTO';

import Appointment from '@modules/appointment/infra/typeorm/entities/Appointment';
import FindAllInMonthDTO from '@modules/appointment/dtos/FindAllInMonthDTO';
import FindAllInDayDTO from '@modules/appointment/dtos/FindAllInDayDTO';

class AppointmentRepository implements IAppointmentRepository {
    appointments: Appointment[] = [];

    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            appointment =>
                isEqual(appointment.date, date) &&
                appointment.provider_id === provider_id,
        );
        return findAppointment;
    }

    public async create({
        provider_id,
        customer_id,
        date,
    }: CreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        // appointment.id = uuid4();
        // appointment.provider_id = provider_id;
        // appointment.date = date;
        Object.assign(appointment, {
            id: uuid4(),
            provider_id,
            customer_id,
            date,
        });

        this.appointments.push(appointment);
        return appointment;
    }

    findAllInMonth({
        provider_id,
        year,
        month,
    }: FindAllInMonthDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                appointment.date.getFullYear() === year &&
                appointment.date.getMonth() === month - 1,
        );

        return Promise.resolve(appointments);
    }

    findAllInDay({
        provider_id,
        year,
        month,
        day,
    }: FindAllInDayDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                appointment.date.getFullYear() === year &&
                appointment.date.getMonth() === month - 1 &&
                appointment.date.getDate() === day,
        );

        return Promise.resolve(appointments);
    }
}

export default AppointmentRepository;
