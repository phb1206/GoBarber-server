import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        listProvidersService = new ListProvidersService(fakeUserRepository);
    });

    it('should be able to list providers', async () => {
        const loggedUser = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const user1 = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const user2 = await fakeUserRepository.create({
            name: 'Pedro2',
            email: 'pedro2@brandao.com',
            password: '123456',
        });

        const users = await listProvidersService.execute(loggedUser.id);

        // delete user1.password;
        // delete user2.password;

        expect(users).toEqual([user1, user2]);
    });
});
