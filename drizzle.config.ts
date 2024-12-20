import type { Config } from 'drizzle-kit';
import { env } from './src/utils';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    user: env('DB_USER'),
    password: env('DB_PASSWORD'),
    host: env('DB_SERVER'),
    database: env('DB_NAME'),
    port: parseInt(env('DB_PORT') || '5432'),
  },
} satisfies Config;
