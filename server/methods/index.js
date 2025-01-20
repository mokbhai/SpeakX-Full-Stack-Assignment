import QuestionModel from "../schemas/questionSchema.js";
import { QuestionType, AnagramType } from "../schemas/questionSchema.js";
import AnalyseData from "../seed/analyse.js";

// Implement the Add RPC method
function add(call, callback) {
  const { a, b } = call.request;
  const result = a + b;
  callback(null, { result });
}

function getQuestionTypes(call, callback) {
  const questionTypes = Object.values(QuestionType);
  callback(null, { questionTypes });
}

async function searchQuestion(call, callback) {
  try {
    const { title, type, pagination } = call.request;
    const page = pagination?.page || 0;
    const limit = pagination?.limit || 10;

    // Build query object with only defined filters
    const query = {};
    if (title) {
      // Create text index for efficient text search
      await QuestionModel.collection.createIndex({ title: "text" });
      query.$text = { $search: title };
    }

    if (type !== undefined && type !== 0) {
      query.type = QuestionType[type];
    }

    // console.log(query);

    // Use aggregation pipeline for efficient querying and pagination
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
                  $indexOfArray: [Object.values(QuestionType), "$type"],
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
    console.error("Search Question Error:", error);
    callback(error);
  }
}

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
};
