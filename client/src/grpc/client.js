const { QuestionsClient } = require("./questions_grpc_web_pb");
const { AddRequest } = require("./questions_pb");

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

  
};
