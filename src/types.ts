import { continents, countries } from './db/schema';

export type Continent = typeof continents.$inferSelect;
export type Country = typeof countries.$inferSelect;

export type NewContinent = typeof continents.$inferInsert;
export type NewCountry = typeof countries.$inferInsert;
