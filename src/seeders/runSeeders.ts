import SequelizeRepository from "../repositories/SequelizeRepositoryBasic";
import { Sequelize } from "sequelize-typescript";
import continentData from "./continentData";
import countryData from "./countryData";
import Country from "../models/Country";
import Continent from "../models/Continent";

const seedContinents = async (sequelize) => {
  // const continentRepo = sequelize.getRepository(Continent);
  const continentRepo = SequelizeRepository(sequelize, "Continent");
  console.log("Running seeding of continents");
  const data = continentData;
  for (let i = 0; i < data.length; i++) {
    let continent = data[i] as Continent;
    console.log(`Seeding continent: ${continent.continentName}`);
    await continentRepo.upsert(
      { continentId: continent.continentId },
      continent
    );
  }
};

const seedCountries = async (sequelize) => {
  //const countryRepo = sequelize.getRepository(Country);
  const countryRepo = SequelizeRepository(sequelize, "Country");
  console.log("Running seeding of countries");
  const data = countryData;
  for (let i = 0; i < data.length; i++) {
    let country = data[i] as Country;
    await countryRepo.upsert({ countryId: country.countryId }, country);
    console.log(`Seeded country: ${country.countryName}`);
  }
};

const runSeeders = async (sequelize: Sequelize): Promise<boolean> => {
  try {
    console.log("Running seeders in database");
    await seedContinents(sequelize);
    await seedCountries(sequelize);
    console.log("Completed running seeders in database");
    return Promise.resolve(true);
  } catch (e) {
    console.log("ERROR: could not run seeders in database:");
    console.log(e);
    return Promise.resolve(false);
  }
};

export default runSeeders;
