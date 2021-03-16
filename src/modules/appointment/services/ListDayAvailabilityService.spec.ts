import FakeAppointmentsRepository from '@modules/appointment/repositories/fakes/FakeAppointmentsRepository';
import ListDayAvailabilityService from './ListDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listDayAvailabilityService: ListDayAvailabilityService;

describe('ListDayAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listDayAvailabilityService = new ListDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the day availability for providers', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: '123',
            date: new Date(2020, 2, 14, 9),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: '123',
            date: new Date(2020, 2, 14, 10),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: '123',
            date: new Date(2020, 2, 14, 12),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: '123',
            date: new Date(2020, 2, 14, 13),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: '123',
            date: new Date(2020, 2, 14, 15),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: '123',
            date: new Date(2020, 2, 14, 17),
        });

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 2, 14, 12).getTime();
        });

        const availability = await listDayAvailabilityService.execute({
            provider_id: 'provider_id',
            month: 3,
            year: 2020,
            day: 14,
        });

        expect(availability).toEqual([
            { hour: 8, isAvailable: false },
            { hour: 9, isAvailable: false },
            { hour: 10, isAvailable: false },
            { hour: 11, isAvailable: false },
            { hour: 12, isAvailable: false },
            { hour: 13, isAvailable: false },
            { hour: 14, isAvailable: true },
            { hour: 15, isAvailable: false },
            { hour: 16, isAvailable: true },
            { hour: 17, isAvailable: false },
        ]);
    });
});
