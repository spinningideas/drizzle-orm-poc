import { DrizzleBaseRepository } from './DrizzleBaseRepository';
import { continents } from '../db/schema';
import type { Continent } from '../types';

export class ContinentRepository extends DrizzleBaseRepository<Continent> {
  constructor() {
    super(continents, 'continentId');
  }
}
