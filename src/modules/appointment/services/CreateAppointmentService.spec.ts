import FakeAppointmentRepository from '@modules/appointment/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeNotificationRepository: FakeNotificationRepository;
let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        fakeNotificationRepository = new FakeNotificationRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository,
            fakeNotificationRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to create appointments', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 0, 1).getTime(),
        );

        const appointment = await createAppointment.execute({
            date: new Date(2020, 2, 1, 12),
            provider_id: '1234',
            customer_id: '1223',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1234');
    });

    it('should not be able to create two appointments at the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 0, 1).getTime(),
        );

        const appointmentDate = new Date(2020, 2, 1, 12);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '1234',
            customer_id: '1223',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '1235',
                customer_id: '1223',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create appointment in past dates', async () => {
        await expect(
            createAppointment.execute({
                date: new Date(2000, 1, 1),
                provider_id: '1235',
                customer_id: '1223',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create appointment with same customer/provider', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 0, 1).getTime(),
        );

        await expect(
            createAppointment.execute({
                date: new Date(2020, 2, 1, 12),
                provider_id: '1235',
                customer_id: '1235',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create appointment before 9:00 or after 18:00', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 0, 1).getTime(),
        );

        await expect(
            createAppointment.execute({
                date: new Date(2020, 2, 1, 8),
                provider_id: '1234',
                customer_id: '1235',
            }),
        ).rejects.toBeInstanceOf(AppError);
        await expect(
            createAppointment.execute({
                date: new Date(2020, 2, 1, 19),
                provider_id: '1234',
                customer_id: '1235',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
