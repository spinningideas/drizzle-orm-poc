import { InferModel } from 'drizzle-orm';
import { continents, countries } from './db/schema';

export type Continent = InferModel<typeof continents>;
export type Country = InferModel<typeof countries>;

export type NewContinent = InferModel<typeof continents, 'insert'>;
export type NewCountry = InferModel<typeof countries, 'insert'>;
