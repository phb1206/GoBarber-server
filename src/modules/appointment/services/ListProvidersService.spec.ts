import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProvidersService = new ListProvidersService(
            fakeUserRepository,
            fakeCacheProvider,
        );
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

        expect(users).toEqual([user1, user2]);
    });

    it('should be able to list providers using cache', async () => {
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

        await listProvidersService.execute(loggedUser.id);
        const users = await listProvidersService.execute(loggedUser.id);

        expect(users).toEqual([user1, user2]);
    });
});
