import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Question from "./schemas/questionSchema.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
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

    // Insert new questions
    await Question.insertMany(questions);
    console.log("Successfully seeded questions");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
