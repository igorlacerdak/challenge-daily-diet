import { FastifyInstance } from 'fastify';
import { checkUserIdExists } from '../middlewares/check-user-id-exists';
import { knex } from '../infra/database';
import { format } from 'date-fns';
import { z } from 'zod';

export async function snacksRoutes(app: FastifyInstance) {
  // BUSCA AS REFEIÇÕES DO USUARIO

  app.get('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const { userId } = request.cookies;

    const snacks = await knex('snacks').where('user_id', userId);

    if (!snacks) {
      throw new Error('There are no meals registered for this user.');
    }

    const formattedSnacks = snacks.map((snack) => ({
      ...snack,
      meal_date: format(new Date(snack.meal_date), 'dd/MM/yyyy HH:mm'),
    }));

    return { snacks: formattedSnacks };
  });

  // BUSCA A REFEIÇÃO ESPECIFICA DO USUARIO

  app.get('/:id', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const { userId } = request.cookies;

    const idSnackSchema = z.object({
      id: z.string(),
    });

    const { id } = idSnackSchema.parse(request.params);

    const snacks = await knex('snacks')
      .where({
        id: id,
        user_id: userId,
      })
      .first();

    if (!snacks) {
      throw new Error('There are no meals registered for this user.');
    }

    // Formatação do campo meal_date para "dd/MM/yyyy HH:mm"
    const formattedSnacks = {
      ...snacks,
      meal_date: format(new Date(snacks.meal_date), 'dd/MM/yyyy HH:mm'),
    };

    return { snacks: formattedSnacks };
  });

  // INSERE UMA NOVA REFEIÇÃO

  app.post('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const { userId } = request.cookies;

    const createSnackBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_inside_diet: z.boolean(),
      meal_date: z.string(),
    });

    const { name, description, is_inside_diet, meal_date } = createSnackBodySchema.parse(request.body);

    await knex('snacks').insert({
      name,
      description,
      meal_date: new Date(meal_date),
      is_inside_diet,
      user_id: userId,
    });

    return reply.status(201).send({ status: 'success', message: 'Successfully registered meal' });
  });

  // EDITA UMA REFEIÇÃO CADASTRADA

  app.patch('/:id', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const { userId } = request.cookies;

    const idSnackSchema = z.object({
      id: z.string(),
    });

    const { id } = idSnackSchema.parse(request.params);

    const createSnackBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_inside_diet: z.boolean(),
      meal_date: z.string(),
    });

    const { name, description, is_inside_diet, meal_date } = createSnackBodySchema.parse(request.body);

    const snack = knex('snacks').where({ id: id, user_id: userId }).first();

    if (!snack) {
      throw new Error('There are no meals registered for this user.');
    }

    await snack.update({
      name,
      description,
      is_inside_diet,
      meal_date: new Date(meal_date),
    });

    return reply.status(204).send({ status: 'success', message: 'Meal update successfully' });
  });

  // DELETA UMA REFEIÇÃO CADASTRADA

  app.delete('/:id', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const { userId } = request.cookies;

    const idSnackSchema = z.object({
      id: z.string(),
    });

    const { id } = idSnackSchema.parse(request.params);

    const snack = knex('snacks').where({ id: id, user_id: userId }).first();

    if (!snack) {
      throw new Error('There are no meals registered for this user.');
    }

    await snack.del();

    return reply.status(204).send({ status: 'success', message: 'Meal deleted successfully' });
  });
}
