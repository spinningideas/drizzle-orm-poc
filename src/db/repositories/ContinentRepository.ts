import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleBaseRepository } from '../../repositories/DrizzleBaseRepository';
import { continents } from '../schema';
import type { Continent } from '../../types';

export class ContinentRepository extends DrizzleBaseRepository<Continent> {
  constructor(database: NodePgDatabase) {
    super(database, continents, 'continentId');
  }
}
