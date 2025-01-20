import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Question from "../schemas/questionSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to seed one question at a time
async function seedQuestionOneByOne(questions) {
  console.log(`Starting to seed ${questions.length} questions one by one...`);
  let successCount = 0;
  let errorCount = 0;

  for (const question of questions) {
    try {
      const transformedQuestion = {
        ...question,
        _id: new mongoose.Types.ObjectId(question._id["$oid"]),
        siblingId: question.siblingId
          ? new mongoose.Types.ObjectId(question.siblingId["$oid"])
          : null,
      };

      await Question.create(transformedQuestion);
      successCount++;

      // Log progress every 100 questions
      if (successCount % 100 === 0) {
        console.log(
          `Progress: ${successCount}/${questions.length} questions seeded`
        );
      }
    } catch (error) {
      errorCount++;
      console.error(
        `Error seeding question ${question._id["$oid"]}:`,
        error.message
      );
    }
  }

  return { successCount, errorCount };
}

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://mokshitjain18:PaWsqINM2Lc8ItGC@speakx.u00st.mongodb.net/?retryWrites=true&w=majority&appName=speakx"
    );
    console.log("Connected to MongoDB");

    // Read the JSON file
    const jsonData = await fs.readFile(
      path.join(__dirname, "speakx_questions.json"),
      "utf-8"
    );
    const questions = JSON.parse(jsonData);

    // Clear existing questions
    await Question.deleteMany({});
    console.log("Cleared existing questions");

    // Seed questions one by one
    const { successCount, errorCount } = await seedQuestionOneByOne(questions);

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
export { seedDatabase, seedQuestionOneByOne };

// Run the seeding process if this file is executed directly
if (import.meta.url === `file://${__filename}`) {
  seedDatabase();
}
