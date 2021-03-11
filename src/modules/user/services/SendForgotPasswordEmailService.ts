import { inject, injectable } from 'tsyringe';

import UserRepository from '@modules/user/repositories/IUserRepository';
import UserTokenRepository from '@modules/user/repositories/IUserTokenRepository';
import MailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UserRepository')
        private userRepository: UserRepository,

        @inject('MailProvider')
        private mailProvider: MailProvider,

        @inject('UserTokenRepository')
        private userTokenRepository: UserTokenRepository,
    ) {}

    public async execute(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User does not exist');
        }

        const { token } = await this.userTokenRepository.generate(user.id);

        await this.mailProvider.sendMail(
            email,
            `Password recovery request received ${token}`,
        );
    }
}

export default SendForgotPasswordEmailService;
