import FakeAppointmentRepository from '@modules/appointment/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
        );
    });

    it('should be able to create appointments', async () => {
        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '1234',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1234');
    });

    it('should not be able to create two appointments ate the same time', async () => {
        const appointmentDate = new Date();

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '1234',
        });

        expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '1235',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
