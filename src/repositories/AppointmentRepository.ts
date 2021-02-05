import { isEqual } from 'date-fns';

import Appointment from '../models/Appointment';

interface CreateAppointmentDTO {
    provider: string;
    date: Date;
}

class AppointmentRepository {
    private appointments: Appointment[];

    constructor() {
        this.appointments = [];
    }

    public create({ provider, date }: CreateAppointmentDTO): Appointment {
        const appointment = new Appointment({ provider, date });

        this.appointments.push(appointment);

        return appointment;
    }

    public findByDate(date: Date): Appointment | null {
        return (
            this.appointments.find(appointment =>
                isEqual(date, appointment.date),
            ) || null
        );
    }

    public getAppointments(): Appointment[] {
        return this.appointments;
    }
}

export default AppointmentRepository;
