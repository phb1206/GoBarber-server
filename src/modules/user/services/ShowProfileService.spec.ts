import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        showProfileService = new ShowProfileService(fakeUserRepository);
    });

    it('should be able to show user profile', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const updatedUser = await showProfileService.execute(user.id);

        expect(updatedUser.name).toBe(user.name);
        expect(updatedUser.email).toBe(user.email);
    });

    it('should not be able to show non-existing user profile', async () => {
        await expect(
            showProfileService.execute('user.id'),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to show user password', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const updatedUser = await showProfileService.execute(user.id);

        expect(updatedUser.password).toBe(undefined);
    });
});
