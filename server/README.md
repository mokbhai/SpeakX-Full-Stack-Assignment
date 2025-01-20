## Backend

### Data Analysis

I started by analyzing the data and generated the following output: [speakx_questions_analysis](./seed/speakx_questions_analysis.json). This analysis helped in understanding the structure and requirements for the backend.

---

### `index.js` File

The backend starts the gRPC server using the following code:

```js
startGrpcServer(grpcMethods);
```

- **`grpcMethods`**: These are defined in the `methods/index.js` file.
  - This file contains all the methods required to interact with the database.
  - These methods act as **services** (similar to services in express) and handle the logic for fetching, adding, and processing data.

---

### Methods Overview

#### **SearchQuestion**

- This method is used to search for questions in the database.
- It utilizes the **MongoDB aggregation pipeline** to perform complex queries and filter the results efficiently.

#### **SearchSuggestions**

- This method is used to search for suggestions in the database.
- It uses **regular expressions (regex)** to match questions based on the input query.
- The method returns results containing the **title** and **type** of the matching questions.

#### **GetQuestionTypes** (For Testing)

- This method retrieves all the available question types.
- It is primarily used for testing connection between client and server.

#### **Add** (For Testing)

- This method is used to add two numbers.
- It is primarily used for testing connection between client and server.

---

### Database Connection

I used **Mongoose** to connect to the MongoDB database. The connection is established using the following code:

```js
connectDB();
```

Mongoose simplifies database interactions by providing a schema-based solution for modeling application data.

---

### Notes

- The gRPC server is designed to handle requests efficiently by leveraging the methods defined in `methods/index.js`.
- Each method is tailored to perform specific operations, ensuring modularity and maintainability.
- The use of **aggregation pipelines** and **regex** ensures that the database queries are both powerful and flexible.
