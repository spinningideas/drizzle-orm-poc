import runSeeders from "./runSeeders";

async function seed(): Promise<boolean> {
  try {
    let seedersRunSuccessfully = false;
    console.log(`Running database seeding`);
    seedersRunSuccessfully = await runSeeders();
    console.log("Database seeding setup ok?:", seedersRunSuccessfully);
    return Promise.resolve(seedersRunSuccessfully);
  } catch (err) {
    console.error("Error seeding up the database", err);
    return Promise.resolve(false);
  }
}

seed().then((result) => {
  console.log("Database seeding ok?:", result);
});
