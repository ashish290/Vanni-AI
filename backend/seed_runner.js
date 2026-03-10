import "dotenv/config";
import { seedPlans } from "./src/models/index.js";
import { initDriver, closeDriver } from "./src/services/dbService.js";

async function run() {
  await initDriver();
  await seedPlans();
  console.log("DB Seeded");
  await closeDriver();
  process.exit(0);
}
run();
