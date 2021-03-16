import FakeAppointmentsRepository from '@modules/appointment/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list appointments on a given day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2020, 2, 14, 10),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            customer_id: 'c_id',
            date: new Date(2020, 2, 14, 13),
        });

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: 'provider_id',
            day: 14,
            month: 3,
            year: 2020,
        });

        expect(appointments).toEqual([appointment1, appointment2]);
    });
});