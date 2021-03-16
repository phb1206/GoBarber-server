import { container } from 'tsyringe';

import '@modules/user/providers';
import './providers';

import IAppointmentRepository from '@modules/appointment/repositories/IAppointmentRepository';
import AppointmentRepository from '@modules/appointment/infra/typeorm/repositories/AppointmentRepository';

import IUserRepository from '@modules/user/repositories/IUserRepository';
import UserRepository from '@modules/user/infra/typeorm/repositories/UserRepository';

import IUserTokenRepository from '@modules/user/repositories/IUserTokenRepository';
import UserTokenRepository from '@modules/user/infra/typeorm/repositories/UserTokenRepository';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import NotificationRepository from '@modules/notifications/infra/typeorm/repositories/NotificationRepository';

container.registerSingleton<IAppointmentRepository>(
    'AppointmentRepository',
    AppointmentRepository,
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IUserTokenRepository>(
    'UserTokenRepository',
    UserTokenRepository,
);

container.registerSingleton<INotificationRepository>(
    'NotificationRepository',
    NotificationRepository,
);
