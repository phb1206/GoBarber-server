import { getRepository, Repository } from 'typeorm';

import IAppointmentRepository from '@modules/appointment/repositories/IAppointmentRepository';
import CreateAppointmentDTO from '@modules/appointment/dtos/CreateAppointmentDTO';

import Appointment from '@modules/appointment/infra/typeorm/entities/Appointment';

class AppointmentRepository implements IAppointmentRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const foundAppointment = await this.ormRepository.findOne({
            where: { date },
        });
        return foundAppointment;
    }

    public async create({
        provider_id,
        date,
    }: CreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            provider_id,
            date,
        });
        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentRepository;
