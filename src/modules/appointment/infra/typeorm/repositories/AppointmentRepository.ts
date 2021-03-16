import { getRepository, Raw, Repository } from 'typeorm';

import IAppointmentRepository from '@modules/appointment/repositories/IAppointmentRepository';
import CreateAppointmentDTO from '@modules/appointment/dtos/CreateAppointmentDTO';

import Appointment from '@modules/appointment/infra/typeorm/entities/Appointment';
import FindAllInMonthDTO from '@modules/appointment/dtos/FindAllInMonthDTO';
import FindAllInDayDTO from '@modules/appointment/dtos/FindAllInDayDTO';

class AppointmentRepository implements IAppointmentRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async create({
        provider_id,
        customer_id,
        date,
    }: CreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            provider_id,
            customer_id,
            date,
        });
        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const foundAppointment = await this.ormRepository.findOne({
            where: { date },
        });
        return foundAppointment;
    }

    public async findAllInMonth({
        provider_id,
        year,
        month,
    }: FindAllInMonthDTO): Promise<Appointment[]> {
        const paddedMonth = String(month).padStart(2, '0');
        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${paddedMonth}-${year}'`,
                ),
            },
        });
        return appointments;
    }

    public async findAllInDay({
        provider_id,
        year,
        month,
        day,
    }: FindAllInDayDTO): Promise<Appointment[]> {
        const paddedMonth = String(month).padStart(2, '0');
        const paddedDay = String(day).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${paddedDay}-${paddedMonth}-${year}'`,
                ),
            },
        });

        return appointments;
    }
}

export default AppointmentRepository;
