import FakeAppointmentsRepository from '@modules/appointment/repositories/fakes/FakeAppointmentsRepository';
import ListMonthAvailabilityService from './ListMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listMonthAvailabilityService: ListMonthAvailabilityService;

describe('ListMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listMonthAvailabilityService = new ListMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the month availability for providers', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 14, 9),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 14, 10),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 14, 11),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 14, 12),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 14, 13),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 14, 14),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 14, 15),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 14, 16),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 14, 17),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 14, 18),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2022, 2, 15, 10),
        });

        const availability = await listMonthAvailabilityService.execute({
            provider_id: 'provider_id',
            month: 3,
            year: 2022,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 14, isAvailable: false },
                { day: 15, isAvailable: true },
                { day: 1, isAvailable: true },
            ]),
        );
    });
});
