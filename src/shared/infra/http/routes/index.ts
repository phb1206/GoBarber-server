import { Router } from 'express';

import appointmentsRouter from '@modules/appointment/infra/http/routes/appointments.routes';
import providersRouter from '@modules/appointment/infra/http/routes/providers.routes';
import usersRouter from '@modules/user/infra/http/routes/users.routes';
import sessionsRouter from '@modules/user/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/user/infra/http/routes/passwords.routes';
import profileRouter from '@modules/user/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/providers', providersRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

export default routes;
