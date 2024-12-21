import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleBaseRepository } from '../../repositories/DrizzleBaseRepository';
import { countries } from '../schema';
import type { Country } from '../../types';

export class CountryRepository extends DrizzleBaseRepository<Country> {
  constructor(database: NodePgDatabase) {
    super(database, countries, 'countryId');
  }
}
