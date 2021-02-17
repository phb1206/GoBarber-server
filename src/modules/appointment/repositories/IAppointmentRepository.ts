import Appointment from '@modules/appointment/models/IAppointment';
import CreateAppointmentDTO from '@modules/appointment/dtos/CreateAppointmentDTO';

export default interface IAppointmentRepository {
    findByDate(date: Date): Promise<Appointment | undefined>;
    create(data: CreateAppointmentDTO): Promise<Appointment>;
}
