import { FastifyInstance } from 'fastify';
import { knex } from '../infra/database';
import { z } from 'zod';
import { compare } from 'bcrypt';

export async function sessionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const sessionsUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = sessionsUserBodySchema.parse(request.body);

    const user = await knex('users').where('email', email).first();

    if (!user) {
      throw new Error('User credentials do not match');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('User credentials do not match');
    }

    let userId = user.id;
    reply.cookie('userId', userId, { path: '/', maxAge: 1000 * 60 * 60 * 24 });

    return reply.status(201).send({ status: 'success', message: 'Successfully authenticated user' });
  });
}
