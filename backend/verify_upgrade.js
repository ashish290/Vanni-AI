import { run } from "./src/agents/orchestratorAgent.js";
import { initDriver } from "./src/services/dbService.js";
import { sequelize, Mistake } from "./src/models/index.js";

async function testUpgrade() {
  try {
    console.log("🚀 Starting Error Correction Upgrade Verification...");
    await initDriver();
    await sequelize.sync({ alter: true }); // Automatically update schema with new columns

    const userId = 5; // Valid user ID found in DB
    const conversationId = undefined; // Let orchestrator handle conversation creation

    // Clear previous mistakes for clean test
    await Mistake.destroy({ where: { userId } });

    console.log("\n--- TEST 1: First Mistake ('Yesterday I go to market') ---");
    const result1 = await run(
      userId,
      "Yesterday I go to market",
      conversationId,
    );
    console.log("VANNI REPLY:", result1.reply);

    // Verify mistake saved in DB
    const mistakesAfter1 = await Mistake.findAll({ where: { userId } });
    console.log(`Mistakes in DB: ${mistakesAfter1.length}`);
    if (mistakesAfter1.length > 0) {
      console.log(
        `First mistake type: ${mistakesAfter1[0].mistakeType}, Count: ${mistakesAfter1[0].count}`,
      );
    }

    console.log("\n--- TEST 2: Repeating the Mistake ---");
    const result2 = await run(
      userId,
      "Yesterday I go to market",
      conversationId,
    );
    console.log("VANNI REPLY (should mention repeat):", result2.reply);

    const mistakesAfter2 = await Mistake.findAll({ where: { userId } });
    if (mistakesAfter2.length > 0) {
      console.log(`Mistake count in DB: ${mistakesAfter2[0].count}`);
    }

    console.log("\n--- TEST 3: Fresh topic and engagement ---");
    const result3 = await run(userId, "I love eating samosas", conversationId);
    console.log("VANNI REPLY (food topic):", result3.reply);

    console.log("\n--- TEST 4: Follow-up question based on past topic ---");
    const result4 = await run(userId, "Anyway, how are you?", conversationId);
    console.log("VANNI REPLY (should recall market or samosa):", result4.reply);

    console.log("\n✅ Verification script completed.");
  } catch (error) {
    console.error("❌ Verification failed:", error);
  } finally {
    process.exit(0);
  }
}

testUpgrade();
