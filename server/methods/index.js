import QuestionModel from "../schemas/questionSchema.js";
import { QuestionType, AnagramType } from "../schemas/questionSchema.js";
// import AnalyseData from "../seed/analyse.js";

// Just for testing
// {
//   a: number,
//   b: number
// }
const add = async (call, callback) => {
  const { a, b } = call.request;
  const result = a + b;
  callback(null, { result });
};

// Just for testing
// {
//   questionTypes: string[]
// }
const getQuestionTypes = async (call, callback) => {
  const questionTypes = Object.values(QuestionType);
  callback(null, { questionTypes });
};

// {
//   questions: object[],
//   paginationInfo: object
// }
const searchQuestion = async (call, callback) => {
  try {
    const { title, type, pagination, displayAllQuestionTypes } = call.request;
    const page = pagination?.page || 0;
    const limit = pagination?.limit || 10;

    // Build query object with only defined filters
    const query = {};
    if (title) {
      // for exact match
      query.title = title;

      // for Regex search
      // query.title = { $regex: title, $options: "i" };
    }

    if (type !== undefined && type !== 0 && QuestionType[type] !== undefined) {
      query.type = QuestionType[type];
    }

    if (!displayAllQuestionTypes && query.type === undefined) {
      query.type = {
        $in: [QuestionType.ANAGRAM, QuestionType.MCQ],
      };
    }

    // console.log(query);

    // Used aggregation pipeline for efficient querying and pagination
    const aggregationPipeline = [
      { $match: query },
      {
        $facet: {
          metadata: [{ $count: "totalItems" }],
          questions: [
            { $sort: { _id: 1 } },
            { $skip: page * limit },
            { $limit: limit },
            {
              $project: {
                id: { $toString: "$_id" },
                title: 1,
                type: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$type", "ANAGRAM"] }, then: 1 },
                      { case: { $eq: ["$type", "MCQ"] }, then: 2 },
                      { case: { $eq: ["$type", "READ_ALONG"] }, then: 3 },
                      { case: { $eq: ["$type", "CONTENT_ONLY"] }, then: 4 },
                      { case: { $eq: ["$type", "CONVERSATION"] }, then: 5 },
                    ],
                    default: 0,
                  },
                },
                solution: { $ifNull: ["$solution", ""] },
                siblingId: {
                  $ifNull: [{ $toString: "$siblingId" }, ""],
                },
                anagramType: {
                  $cond: {
                    if: "$anagramType",
                    then: {
                      $indexOfArray: [
                        Object.values(AnagramType),
                        "$anagramType",
                      ],
                    },
                    else: 0,
                  },
                },
                blocks: { $ifNull: ["$blocks", []] },
                options: { $ifNull: ["$options", []] },
                createdAt: {
                  $dateToString: {
                    date: "$createdAt",
                    format: "%Y-%m-%dT%H:%M:%S.%LZ",
                  },
                },
              },
            },
          ],
        },
      },
    ];

    const [result] = await QuestionModel.aggregate(aggregationPipeline);
    const totalItems = result.metadata[0]?.totalItems || 0;
    const totalPages = Math.ceil(totalItems / limit);

    callback(null, {
      questions: result.questions,
      paginationInfo: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages - 1,
        hasPreviousPage: page > 0,
      },
    });
  } catch (error) {
    console.error("Error in searchQuestion:", error);
    throw error;
  }
};

// {
//   suggestions: {title: string, type: number}[]
// }
const searchSuggestions = async (call, callback) => {
  try {
    const { query, displayAllQuestionTypes, type } = call.request;

    const mongoQuery = { title: { $regex: query, $options: "i" } };

    if (type !== undefined && type !== 0 && QuestionType[type] !== undefined) {
      mongoQuery.type = QuestionType[type];
    }

    if (!displayAllQuestionTypes && !mongoQuery.type) {
      mongoQuery.type = { $in: [QuestionType.ANAGRAM, QuestionType.MCQ] };
    }

    const suggestions = await QuestionModel.find(mongoQuery, {
      title: 1,
      _id: 0,
      type: 1,
    }).limit(4);

    callback(null, { suggestions });
  } catch (error) {
    console.error("Search Suggestions Error:", error);
    callback(error);
  }
};

// get by file
// const analyser = new AnalyseData();
// await analyser.initialize();
// async function searchQuestion(call, callback) {
//   try {
//     const question = await QuestionModel.findById("665568f4ac3f6205c943a937");
//     // const question = analyser.getQuestionsByType("anagram");
//     console.log(question);
//     callback(null, {
//       questions: question,
//       paginationInfo: {
//         currentPage: 0,
//         totalPages: 1,
//         totalItems: question.length,
//         itemsPerPage: question.length,
//         hasNextPage: false,
//         hasPreviousPage: false,
//       },
//     });
//   } catch (error) {
//     console.error("Search Question Error:", error);
//     callback(error);
//   }
// }

export default {
  add,
  getQuestionTypes,
  searchQuestion,
  searchSuggestions,
};
