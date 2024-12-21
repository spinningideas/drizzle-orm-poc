import continentData from "./continentData";
import countryData from "./countryData";
import { database } from "../database";
import { continents, countries } from "../schema";
import { Continent, Country } from "types";

const seedContinents = async (db) => {
  console.log("Running seeding of continents");
  const data = continentData;
  for (let i = 0; i < data.length; i++) {
    const continent = data[i] as Continent;
    console.log(`Seeding continent: ${continent.continentName}`);
    await db.insert(continents).values({
      continentId: continent.continentId,
      continentCode: continent.continentCode,
      continentName: continent.continentName
    }).onConflictDoUpdate({
      target: [continents.continentId],
      set: {
        continentCode: continent.continentCode,
        continentName: continent.continentName
      }
    });
  }
};

const seedCountries = async (db) => {
  console.log("Running seeding of countries");
  const data = countryData;
  for (let i = 0; i < data.length; i++) {
    const country = data[i] as unknown as Country;
    const countryValues = {
      countryId: country.countryId,
      countryCode: country.countryCode,
      countryCode3: country.countryCode3,
      countryName: country.countryName,
      capital: country.capital || null,
      continentId: country.continentId,
      area: country.area || null,
      population: country.population || null,
      latitude: country.latitude || null,
      longitude: country.longitude || null,
      currencyCode: country.currencyCode || null
    };

    await db.insert(countries).values(countryValues).onConflictDoUpdate({
      target: [countries.countryId],
      set: {
        countryCode: country.countryCode,
        countryCode3: country.countryCode3,
        countryName: country.countryName,
        capital: country.capital || null,
        continentId: country.continentId,
        area: country.area || null,
        population: country.population || null,
        latitude: country.latitude || null,
        longitude: country.longitude || null,
        currencyCode: country.currencyCode || null
      }
    });

    console.log(`Seeded country: ${country.countryName}`);
  }
};

const runSeeders = async (): Promise<boolean> => {
  try {
    console.log("Running seeders in database");
    await seedContinents(database);
    await seedCountries(database);
    console.log("Completed running seeders in database");
    return Promise.resolve(true);
  } catch (e) {
    console.log("ERROR: could not run seeders in database:");
    console.log(e);
    return Promise.resolve(false);
  }
};

export default runSeeders;
