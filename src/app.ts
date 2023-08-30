import cookie from '@fastify/cookie';
import fastify from 'fastify';

import { userRoutes } from './routes/user';
import { sessionsRoutes } from './routes/sessions';
import { snacksRoutes } from './routes/snacks';

export const app = fastify();

app.register(cookie);

app.register(userRoutes, {
  prefix: 'users',
});

app.register(sessionsRoutes, {
  prefix: 'sessions',
});

app.register(snacksRoutes, {
  prefix: 'snacks',
});
