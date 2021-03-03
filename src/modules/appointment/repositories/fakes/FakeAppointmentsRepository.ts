import { v4 as uuid4 } from 'uuid';
import { isEqual } from 'date-fns';

import IAppointmentRepository from '@modules/appointment/repositories/IAppointmentRepository';
import CreateAppointmentDTO from '@modules/appointment/dtos/CreateAppointmentDTO';

import Appointment from '@modules/appointment/infra/typeorm/entities/Appointment';

class AppointmentRepository implements IAppointmentRepository {
    appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );
        return findAppointment;
    }

    public async create({
        provider_id,
        date,
    }: CreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        // appointment.id = uuid4();
        // appointment.provider_id = provider_id;
        // appointment.date = date;
        Object.assign(appointment, {
            id: uuid4(),
            provider_id,
            date,
        });

        this.appointments.push(appointment);
        return appointment;
    }
}

export default AppointmentRepository;
