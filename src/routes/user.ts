import { FastifyInstance } from 'fastify';
import crypto, { randomUUID } from 'node:crypto';
import { knex } from '../infra/database';
import { z } from 'zod';
import { hash } from 'bcrypt';
import { checkUserIdExists } from '../middlewares/check-user-id-exists';

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    });

    const { name, email, password } = createUserBodySchema.parse(request.body);

    const hashedPassword = await hash(password, 8);

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
    });

    return reply.status(201).send({ status: 'success', message: 'Criado com sucesso!' });
  });

  app.get('/:email', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const userParamsSchema = z.object({
      email: z.string(),
    });

    const { email } = userParamsSchema.parse(request.params);

    const users = await knex('users').where('email', email).first();

    if (!users) {
      throw new Error('User not exists');
    }

    return { users };
  });
}
