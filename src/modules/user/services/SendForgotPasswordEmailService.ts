import { inject, injectable } from 'tsyringe';
import path from 'path';

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

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );
        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Password recovery',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `http://localhost:3000/reset-password?token=${token}`,
                },
            },
        });
    }
}

export default SendForgotPasswordEmailService;
