import { QuestionsClient } from "./questions_grpc_web_pb";
import {
  AddRequest,
  GetQuestionTypesRequest,
  SearchQuestionRequest,
  PaginationRequest,
  SearchSuggestionsRequest,
} from "./questions_pb";

const client = new QuestionsClient("http://localhost:8080", null, null);

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

  searchQuestion: ({ title, type, pagination }) => {
    return new Promise((resolve, reject) => {
      const request = new SearchQuestionRequest();

      // Set optional title if provided
      if (title) {
        request.setTitle(title);
      }

      // Set optional type if provided
      if (type !== undefined) {
        request.setType(type);
      }

      // Create and set pagination object
      if (pagination) {
        const paginationRequest = new PaginationRequest();
        paginationRequest.setPage(pagination.page);
        paginationRequest.setLimit(pagination.limit);
        request.setPagination(paginationRequest);
      }

      client.searchQuestion(request, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },

  searchSuggestions: (query) => {
    return new Promise((resolve, reject) => {
      const request = new SearchSuggestionsRequest();
      request.setQuery(query);
      client.searchSuggestions(request, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },
};
