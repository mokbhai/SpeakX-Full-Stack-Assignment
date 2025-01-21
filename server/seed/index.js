import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Question from "../schemas/questionSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurable batch size
const BATCH_SIZE = 1000;

async function seedQuestionsInBatches(questions) {
  console.log(
    `Starting to seed ${questions.length} questions in batches of ${BATCH_SIZE}...`
  );
  let successCount = 0;
  let errorCount = 0;

  // Process questions in batches
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);

    try {
      // Transform the batch
      const transformedBatch = batch.map((question) => ({
        ...question,
        _id: new mongoose.Types.ObjectId(question._id["$oid"]),
        siblingId: question.siblingId
          ? new mongoose.Types.ObjectId(question.siblingId["$oid"])
          : null,
      }));

      // Insert batch using insertMany
      await Question.insertMany(transformedBatch, { ordered: false });
      successCount += batch.length;

      // Log progress
      const progress = Math.round(
        ((i + batch.length) / questions.length) * 100
      );
      console.log(
        `Progress: ${progress}% (${successCount}/${questions.length} questions seeded)`
      );
    } catch (error) {
      errorCount += batch.length;
      console.error(
        `Error seeding batch starting at index ${i}:`,
        error.message
      );
    }
  }

  return { successCount, errorCount };
}

const seedDatabase = async () => {
  try {
    // Connect to MongoDB with optimized settings
    await mongoose.connect(process.env.MONGO_URI, {
      // Optimize MongoDB connection for bulk operations
      writeConcern: { w: 1, j: false },
      maxPoolSize: 10,
      socketTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB");

    // Read the JSON file in chunks if it's very large
    const jsonData = await fs.readFile(
      path.join(__dirname, "speakx_questions.json"),
      "utf-8"
    );
    const questions = JSON.parse(jsonData);

    // Create indexes before bulk insert
    await Question.createIndexes();

    // Clear existing questions
    console.log("Clearing existing questions...");
    await Question.deleteMany({});

    // Seed questions in batches
    const { successCount, errorCount } = await seedQuestionsInBatches(
      questions
    );

    console.log("\nSeeding completed:");
    console.log(`Successfully seeded: ${successCount} questions`);
    console.log(`Failed to seed: ${errorCount} questions`);

    process.exit(0);
  } catch (error) {
    console.error("Error in seed process:", error);
    process.exit(1);
  }
};

// Export both functions for flexibility
export { seedDatabase, seedQuestionsInBatches };

// Run the seeding process if this file is executed directly
if (import.meta.url === `file://${__filename}`) {
  seedDatabase();
}
