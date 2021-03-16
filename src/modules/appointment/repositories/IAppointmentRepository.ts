import Appointment from '@modules/appointment/models/IAppointment';
import CreateAppointmentDTO from '@modules/appointment/dtos/CreateAppointmentDTO';
import FindAllInMonthDTO from '../dtos/FindAllInMonthDTO';
import FindAllInDayDTO from '../dtos/FindAllInDayDTO';

export default interface IAppointmentRepository {
    create(data: CreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
    findAllInMonth(data: FindAllInMonthDTO): Promise<Appointment[]>;
    findAllInDay(data: FindAllInDayDTO): Promise<Appointment[]>;
}
