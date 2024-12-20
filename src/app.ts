import * as dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { ContinentRepository } from "./repositories/ContinentRepository";
import { CountryRepository } from "./repositories/CountryRepository";
import { db } from "./db";
import { continents, countries } from "./db/schema";
import { eq } from "drizzle-orm";

const app: Express = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "localhost";

// Setup app
app.use(cors());
app.use(express.json());

const continentRepo = new ContinentRepository();
const countryRepo = new CountryRepository();

// Setup routes
//==continents=======================
app.get("/continents", async (req: Request, res: Response) => {
  const result = await continentRepo.findAll();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

//==countries==============================
app.get("/countries/:continentCode", async (req: Request, res: Response) => {
  const continentCode = req.params.continentCode;
  // First find the continent to get its ID
  const continentResult = await continentRepo.findOneWhere({
    fields: { continentCode: eq(continentCode) }
  });

  if (!continentResult.success || !continentResult.data) {
    return res.status(404).json({
      message: "Continent not found with code: " + continentCode,
    });
  }

  const result = await countryRepo.findWhere({
    fields: { continentId: eq(continentResult.data.continentId) }
  });

  if (result.success && result.data) {
    res.json(result.data);
  } else if (!result.data) {
    res.status(404).json({
      message: "Countries not found for continent: " + continentCode,
    });
  } else {
    res.status(500).json({ error: result.error });
  }
});

app.get(
  "/countries/:continentCode/:pageNumber/:pageSize/:orderBy/:orderDesc",
  async (req: Request, res: Response) => {
    const { continentCode, pageNumber, pageSize, orderBy, orderDesc } = req.params;
    
    // First find the continent to get its ID
    const continentResult = await continentRepo.findOneWhere({
      fields: { continentCode: eq(continentCode) }
    });

    if (!continentResult.success || !continentResult.data) {
      return res.status(404).json({
        message: "Continent not found with code: " + continentCode,
      });
    }

    const result = await countryRepo.findWherePaginated(
      { fields: { continentId: eq(continentResult.data.continentId) } },
      parseInt(pageNumber),
      parseInt(pageSize),
      orderBy,
      orderDesc === 'true'
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({ error: result.error });
    }
  }
);

app.get("/country/:countryCode", async (req: Request, res: Response) => {
  const countryCode = req.params.countryCode;
  const result = await countryRepo.findOneWhere({
    fields: { countryCode: eq(countryCode) }
  });

  if (result.success && result.data) {
    res.json(result.data);
  } else if (!result.data) {
    res.status(404).json({
      message: "Country not found with code: " + countryCode,
    });
  } else {
    res.status(500).json({ error: result.error });
  }
});

//==app start AFTER DB setup==============================
async function configureDatabase() {
  try {
    let seedersRunSuccessfully = false;
    console.log(`Running database migrations`);
    const migrationsRun = await db.runMigrations();
    console.log("database migrations setup ok?:", migrationsRun);
    if (migrationsRun) {
      console.log(`Running database seeding`);
      seedersRunSuccessfully = await db.runSeeders();
      console.log("Database seeding setup ok?:", seedersRunSuccessfully);
    }
    return Promise.resolve(migrationsRun && seedersRunSuccessfully);
  } catch (err) {
    console.error("Error setting up the database", err);
    return Promise.resolve(false);
  }
}

configureDatabase().then((result) => {
  app.listen(PORT, () => {
    console.log("db setup ok?:", result);

    console.log(`Server running at ${HOST}:${PORT} `);
  });
});
