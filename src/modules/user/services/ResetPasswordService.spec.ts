import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUserRepository,
            fakeUserTokenRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset password', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const userToken = await fakeUserTokenRepository.generate(user.id);

        await resetPassword.execute({
            token: userToken.token,
            password: '654321',
        });

        const updatedUser = await fakeUserRepository.findById(user.id);

        expect(updatedUser?.password).toBe('654321');
    });

    it('should hash the new password', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const { token } = await fakeUserTokenRepository.generate(user.id);

        await resetPassword.execute({ token, password: '654321' });

        expect(generateHash).toHaveBeenCalledWith('654321');
    });

    it('should not be able to reset password with inexistant token', async () => {
        await expect(
            resetPassword.execute({ token: 'token', password: '654321' }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password after over 2 hours', async () => {
        const user = await fakeUserRepository.create({
            name: 'Pedro',
            email: 'pedro@brandao.com',
            password: '123456',
        });

        const userToken = await fakeUserTokenRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementation(() => {
            const newNow = new Date();
            return newNow.setHours(newNow.getHours() + 3);
        });

        await expect(
            resetPassword.execute({
                token: userToken.token,
                password: '654321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
