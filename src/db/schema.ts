import { pgTable, uuid, varchar, integer, decimal, foreignKey } from 'drizzle-orm/pg-core';

export const continents = pgTable('continents', {
  continentId: uuid('continent_id').primaryKey().defaultRandom(),
  continentCode: varchar('continent_code', { length: 2 }).notNull(),
  continentName: varchar('continent_name', { length: 100 }).notNull().unique(),
});

export const countries = pgTable('countries', {
  countryId: uuid('country_id').primaryKey().defaultRandom(),
  countryCode: varchar('country_code', { length: 2 }).notNull(),
  countryCode3: varchar('country_code3', { length: 3 }).notNull(),
  countryName: varchar('country_name', { length: 100 }).notNull().unique(),
  capital: varchar('capital', { length: 100 }),
  continentId: uuid('continent_id').notNull().references(() => continents.continentId),
  area: integer('area'),
  population: integer('population'),
  latitude: decimal('latitude', { precision: 10, scale: 6 }),
  longitude: decimal('longitude', { precision: 10, scale: 6 }),
  currencyCode: varchar('currency_code', { length: 3 }),
});
