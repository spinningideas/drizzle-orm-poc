import { DrizzleBaseRepository } from './DrizzleBaseRepository';
import { countries } from '../db/schema';
import type { Country } from '../types';

export class CountryRepository extends DrizzleBaseRepository<Country> {
  constructor() {
    super(countries, 'countryId');
  }
}
