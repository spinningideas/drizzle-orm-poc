import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../utils';
import * as schema from './schema';

const pool = new Pool({
  user: env('DB_USER'),
  password: env('DB_PASSWORD'),
  host: env('DB_SERVER'),
  database: env('DB_NAME'),
  port: parseInt(env('DB_PORT') || '5432'),
});

export const db = drizzle(pool, { schema });
