### Question: Explain how you implemented the search API in your backend. Include details on how you queried the questions from the database.

**Answer:** To implement the search API in the backend, I followed a structured approach that involved setting up the server, defining the gRPC service, and querying the MongoDB database. Here's a detailed breakdown of the implementation:

### 1. Setting Up the Server

I started by setting up a Node.js server using the `grpc/grpc-js` framework, which allows for easy handling of HTTP requests. I also integrated `envoy proxy` for communication between the frontend and backend.

Code: [Click Here](../server/config/gRPC.js)

### 2. Defining the schemas

First I analyzed the question data and defined the schemas for the questions [analysed_output](../server/seed/speakx_questions_analysis.js).

Code: [Click Here](../server/schemas/questionSchema.js)

### 3. Defining the Proto File

Next, I defined the Proto File `questions.proto` which specifies the request and response messages for the search method.

Code: [Click Here](../proto/questions.proto)

example:

```protobuf
syntax = "proto3";

service QuestionService {
    rpc SearchQuestions(SearchRequest) returns (SearchResponse);
}

message SearchRequest {
    string query = 1;
}

message SearchResponse {
    repeated Question questions = 1;
}

message Question {
    string id = 1;
    string title = 2;
    string type = 3;
}
```

### 4. Implementing the Search Functionality

After this I created a `searchQuestion` method that handles the search request. This method queries the MongoDB database for questions that match the search query.

### 3. Implementing Search Functionality

The search functionality is implemented through two main methods:

#### a. Search Questions

```javascript
const searchQuestion = async (call, callback) => {
  const { title, type, pagination, displayAllQuestionTypes } = call.request;

  // Build query object
  const query = {};

  // Title Search (Exact Match)
  if (title) {
    query.title = title;
    // Alternative: Regex search
    // query.title = { $regex: title, $options: "i" };
  }

  // Type Filter
  if (type !== undefined && type !== 0 && QuestionType[type] !== undefined) {
    query.type = QuestionType[type];
  }

  // Display All Types Filter when displayAllQuestionTypes is false and type is not provided
  if (!displayAllQuestionTypes && query.type === undefined) {
    query.type = {
      $in: [QuestionType.ANAGRAM, QuestionType.MCQ],
    };
  }

  // Aggregation Pipeline for Efficient Querying
  const aggregationPipeline = [
    { $match: query },
    {
      $facet: {
        metadata: [{ $count: "totalItems" }],
        questions: [
          { $sort: { _id: 1 } },
          { $skip: page * limit },
          { $limit: limit },
          // Project stage for field transformations
        ],
      },
    },
  ];
};
```

Code Explanation:

- The `query` object is built based on the search parameters provided by the client.
- The `aggregationPipeline` is used to query the database efficiently.
- The `metadata` stage counts the total number of items.
- The `questions` stage sorts, skips, and limits the questions based on the pagination parameters.

#### b. Search Suggestions

```javascript
const searchSuggestions = async (call, callback) => {
  const { query, displayAllQuestionTypes, type } = call.request;

  const mongoQuery = {
    title: { $regex: query, $options: "i" },
  };

  // Apply type filter if specified
  if (type !== undefined && type !== 0 && QuestionType[type] !== undefined) {
    mongoQuery.type = QuestionType[type];
  }

  // Filter for specific types if not showing all
  if (!displayAllQuestionTypes && !mongoQuery.type) {
    mongoQuery.type = { $in: [QuestionType.ANAGRAM, QuestionType.MCQ] };
  }

  const suggestions = await QuestionModel.find(mongoQuery, {
    title: 1,
    _id: 0,
    type: 1,
  }).limit(4);
};
```

code: [Click Here](../server/methods/index.js)
