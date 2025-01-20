import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AnalyseData {
  constructor() {
    this.data = null;
  }

  async initialize() {
    try {
      // Read the JSON file
      const jsonData = await fs.readFile(
        path.join(__dirname, "speakx_questions.json"),
        "utf-8"
      );
      const allData = JSON.parse(jsonData);

      // Limit to 200 questions
      this.data = allData;
      console.log(
        `Loaded ${this.data.length} questions (limited from ${allData.length} total questions)`
      );
    } catch (error) {
      console.error("Error loading questions:", error);
      throw error;
    }
  }

  getQuestionTypes() {
    if (!this.data) return {};

    const types = {};
    this.data.forEach((question) => {
      if (!types[question.type]) {
        types[question.type] = 1;
      } else {
        types[question.type]++;
      }
    });

    return types;
  }

  getAnagramTypes() {
    if (!this.data) return {};

    const anagramType = {};
    this.data.forEach((question) => {
      if (question.type.toLowerCase() == "anagram") {
        if (!anagramType[question.anagramType]) {
          anagramType[question.anagramType] = 1;
        } else {
          anagramType[question.anagramType]++;
        }
      }
    });

    return anagramType;
  }

  getQuestionsByAnagramType(anagramType) {
    if (!this.data) return [];
    return this.data
      .filter((q) => q.anagramType?.toLowerCase() === anagramType.toLowerCase())
      .slice(0, 5);
  }

  getQuestionsByType(type) {
    if (!this.data) return [];
    return this.data
      .filter((q) => q.type.toLowerCase() === type.toLowerCase())
      .slice(0, 5);
  }

  getSchemaStructure() {
    if (!this.data || this.data.length === 0) return {};

    const structure = {};

    // Analyze all questions to get all possible fields
    this.data.forEach((question) => {
      Object.keys(question).forEach((key) => {
        if (!structure[key]) {
          // Get the type of the field
          const value = question[key];
          const type = Array.isArray(value)
            ? `Array<${typeof value[0]}>`
            : typeof value;

          // Count how many questions have this field
          const frequency = this.data.filter(
            (q) => q[key] !== undefined
          ).length;
          const percentage = ((frequency / this.data.length) * 100).toFixed(2);

          structure[key] = {
            type,
            example: value,
            frequency: `${frequency}/${this.data.length} (${percentage}%)`,
            required: percentage > 90, // Suggest required if present in >90% of questions
          };
        }
      });
    });

    return structure;
  }
}

// Example usage:
async function main() {
  const data = {
    questionsTypes: {},
    anagramTypes: {},
    schemaStructure: {},
    examples: {}, // Initialize examples object
    anagramExamples: {}, // Initialize anagramExamples object
  };

  const analyser = new AnalyseData();
  await analyser.initialize();

  const questionsTypes = analyser.getQuestionTypes();
  const anagramTypes = analyser.getAnagramTypes();

  data.questionsTypes = questionsTypes;
  data.anagramTypes = anagramTypes;
  data.schemaStructure = analyser.getSchemaStructure();

  console.log("\n=== Question Types ===");
  console.log(JSON.stringify(questionsTypes, null, 2));

  console.log("\n=== Anagram Types ===");
  console.log(JSON.stringify(anagramTypes, null, 2));

  //   console.log("\n=== Schema Structure ===");
  //   console.log(JSON.stringify(data.schemaStructure, null, 2));

  //   console.log("\n=== Questions by Types ===");
  for (const type in questionsTypes) {
    // console.log(`${type}: ${questionsTypes[type]}`);
    // console.log(JSON.stringify(analyser.getQuestionsByType(type), null, 2));
    data.examples[type.toLowerCase()] = await analyser.getQuestionsByType(type);
  }

  //   console.log("\n=== Questions by Anagram Types ===");
  for (const type in anagramTypes) {
    // console.log(`${type}: ${anagramTypes[type]}`);
    // console.log(JSON.stringify(analyser.getQuestionsByAnagramType(type), null, 2));
    data.anagramExamples[type.toLowerCase()] =
      await analyser.getQuestionsByAnagramType(type);
  }

  fs.writeFile(
    path.join(__dirname, "speakx_questions_analysis.json"),
    JSON.stringify(data, null, 2)
  );
  console.log("Analysis completed and saved to speakx_questions_analysis.json");
}

// Run the analysis if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export default AnalyseData;
