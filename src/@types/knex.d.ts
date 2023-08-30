import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      password: string;
    };

    snacks: {
      id: string;
      name: string;
      description: string;
      is_inside_diet: boolean;
      meal_date: Date;
      user_id: string;
    };
  }
}
