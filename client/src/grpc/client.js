import { QuestionsClient } from "./questions_grpc_web_pb";
import {
  AddRequest,
  GetQuestionTypesRequest,
  SearchQuestionRequest,
  PaginationRequest,
  SearchSuggestionsRequest,
} from "./questions_pb";

const client = new QuestionsClient("https://grpc-server.impressment.in", null, {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "X-Requested-With": "XMLHttpRequest",
});

export const QuestionsService = {
  add: (a, b) => {
    return new Promise((resolve, reject) => {
      const request = new AddRequest();
      request.setA(a);
      request.setB(b);

      client.add(request, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },

  getQuestionTypes: () => {
    return new Promise((resolve, reject) => {
      const request = new GetQuestionTypesRequest();
      client.getQuestionTypes(request, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },

  searchQuestion: (request) => {
    return new Promise((resolve, reject) => {
      const req = new SearchQuestionRequest();
      req.setTitle(request.title || "");
      if (request.type) {
        req.setType(request.type);
      }

      const pagination = new PaginationRequest();
      pagination.setPage(request.pagination.page);
      pagination.setLimit(request.pagination.limit);
      req.setPagination(pagination);

      req.setDisplayallquestiontypes(request.displayAllQuestionTypes || false);

      client.searchQuestion(req, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },

  searchSuggestions: (request) => {
    return new Promise((resolve, reject) => {
      const req = new SearchSuggestionsRequest();

      if (request.query) {
        req.setQuery(request.query);
      } else {
        return reject("Query is required");
      }

      // Set optional displayAllQuestionTypes if provided
      req.setDisplayallquestiontypes(request.displayAllQuestionTypes || false);

      // Handle type properly - make sure it's a valid QuestionType value
      if (request.type !== undefined && request.type !== "") {
        req.setType(parseInt(request.type) || 0);
      } else {
        req.setType(0); // Set default type (ALL)
      }

      client.searchSuggestions(req, {}, (err, response) => {
        if (err) {
          console.error("Error fetching suggestions:", err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },
};
