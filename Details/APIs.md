### Question: Explain how you implemented the search API in your backend. Include details on how you queried the questions from the database.

**Answer:** To implement the search API in the backend, I followed a structured approach that involved setting up the server, defining the gRPC service, and querying the MongoDB database. Here’s a detailed breakdown of the implementation:

### 1. Setting Up the Server

I started by setting up a Node.js server using the `grpc/grpc-js` framework, which allows for easy handling of HTTP requests. I also integrated `envoy proxy` for communication between the frontend and backend.

Code: [Click Here](../server/config/gRPC.js)

### 2. Defining the gRPC Service

Next, I defined the gRPC service in a `.proto` file. This file specifies the service and the methods available, including the search method.

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

### 3. Defining the schemas

First I analyzed the question data and defined the schemas for the questions [analysed_output](../server/seed/speakx_questions_analysis.js).

Code: [Click Here](../server/schemas/questionSchema.js)

### 4. Implementing the Search Functionality

After this I created a `searchQuestion` method that handles the search request. This method queries the MongoDB database for questions that match the search query.

The `searchQuestion` uses a **Aggregation Pipeline** to query the questions from the database.

`query.title = { $regex: title, $options: "i" };`

This query is used to search for questions that match the title based on the user's input. The `$regex` operator allows for flexible matching, and the `$options: 'i'` makes the search case-insensitive.

`query.type = QuestionType[type];`

This query is used to search for questions that match the type based on the user's input. Note QuestionType is an enum defined in the `schemas/questionSchema.js` file.

```javascript
{ $sort: { _id: 1 } },
{ $skip: page * limit },
{ $limit: limit },
```

For sorting, skipping and limiting the questions based on the page number and limit.

code: [Click Here](../server/methods/index.js)
