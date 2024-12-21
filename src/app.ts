import express, { Express, Request, Response } from "express";
import cors from "cors";
import { eq, asc, desc } from "drizzle-orm";
import { database } from "./db/database";
import { continents, countries } from "./db/schema";
import runSeeders from "./db/seeders/runSeeders";

const app: Express = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "localhost";

// Setup app
app.use(cors());
app.use(express.json());

// Setup routes
//==continents=======================
app.get("/continents", async (req: Request, res: Response) => {
  //const result = await continentRepo.findAll();
  const result = await database.select().from(continents);
  if (result) {
    res.json(result);
  } else {
    res.status(500).json({ error: "No continents found" });
  }
});

//==countries==============================
app.get("/countries/:continentCode", async (req: Request, res: Response) => {
  const continentCode = req.params.continentCode;
  const continentResult = await database
    .select()
    .from(continents)
    .where(eq(continents.continentCode, continentCode))
    .limit(1);
  if (!continentResult) {
    res.status(404).json({
      message: "Continent not found with code: " + continentCode,
    });
  }
  const result = await database
    .select()
    .from(countries)
    .where(eq(countries.continentId, continentResult[0].continentId));

  // const result = await countryRepo.findWhere({
  //   fields: { continentId: eq(continentResult.data.continentId) }
  // });

  if (result) {
    res.json(result);
  } else if (!result) {
    res.status(404).json({
      message: "Countries not found for continent: " + continentCode,
    });
  } else {
    res.status(500).json({ error: "Could not find countries" });
  }
});

app.get(
  "/countries/:continentCode/:pageNumber/:pageSize/:orderBy/:orderDesc",
  async (req: Request, res: Response) => {
    const { continentCode, pageNumber, pageSize, orderBy, orderDesc } =
      req.params;

    // First find the continent to get its ID
    const continentResult = await database
      .select()
      .from(continents)
      .where(eq(continents.continentCode, continentCode))
      .limit(1);

    if (!continentResult) {
      res.status(404).json({
        message: "Continent not found with code: " + continentCode,
      });
    }

    let orderByDirection = asc;
    if (orderDesc && orderDesc.toLowerCase() === "true") {
      orderByDirection = desc;
    }
    const skip = (parseInt(pageNumber) - 1) * parseInt(pageSize);
    const countryResult = await database
      .select()
      .from(countries)
      .where(eq(countries.continentId, continentResult[0].continentId))
      .orderBy(
        orderByDirection(orderBy ? countries[orderBy] : countries.countryName)
      ) // order by is mandatory
      .limit(pageSize as unknown as number) // the number of rows to return
      .offset(skip); // the number of rows to skip;

    if (!countryResult) {
      res.status(404).json({
        message: "Countries not found with code: " + continentCode,
      });
    }

    if (countryResult) {
      res.json(countryResult);
    } else {
      res.status(500).json({ error: "Could not find countries" });
    }
  }
);

app.get("/country/:countryCode", async (req: Request, res: Response) => {
  const countryCode = req.params.countryCode;
  const result = await database
    .select()
    .from(countries)
    .where(eq(countries.countryCode, countryCode))
    .limit(1);

  if (result) {
    res.json(result);
  } else if (!result) {
    res.status(404).json({
      message: "Country not found with code: " + countryCode,
    });
  } else {
    res.status(500).json({ error: "Could not find country" });
  }
});

//==app start AFTER DB setup==============================
async function configureDatabase(): Promise<boolean> {
  try {
    let seedersRunSuccessfully = false;
    console.log(`Running database seeding`);
    seedersRunSuccessfully = await runSeeders();
    console.log("Database seeding setup ok?:", seedersRunSuccessfully);
    return Promise.resolve(seedersRunSuccessfully);
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
