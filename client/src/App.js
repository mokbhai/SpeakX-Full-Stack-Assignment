import React, { useEffect, useState } from "react";
import TestConnection from "./testConnection";
import { QuestionsService } from "./grpc/client";
import { QuestionType } from "./grpc/questions_pb";

function App() {
  const [questionTypes, setQuestionTypes] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Get question types
    QuestionsService.getQuestionTypes().then((response) => {
      const types = response.getQuestiontypesList();
      setQuestionTypes(types);
    });

    // Search questions with pagination
    QuestionsService.searchQuestion({
      title: "",
      type: QuestionType.ANAGRAM,
      pagination: {
        page: 2,
        limit: 10,
      },
    })
      .then((response) => {
        const questions = response.getQuestionsList();
        const paginationInfo = response.getPaginationinfo();

        console.log("Questions:", questions);
        console.log("Pagination:", {
          currentPage: paginationInfo.getCurrentpage(),
          totalPages: paginationInfo.getTotalpages(),
          totalItems: paginationInfo.getTotalitems(),
          itemsPerPage: paginationInfo.getItemsperpage(),
          hasNextPage: paginationInfo.getHasnextpage(),
          hasPreviousPage: paginationInfo.getHaspreviouspage(),
        });

        setQuestions(questions);
      })
      .catch((error) => {
        console.error("Error searching questions:", error);
      });
  }, []);

  return (
    <div>
      <TestConnection />
      <div>
        <h2>Question Types:</h2>
        {questionTypes.map((type) => (
          <div key={type}>{type}</div>
        ))}
      </div>
      <div>
        <h2>Questions:</h2>
        {questions.map((question) => (
          <div key={question.getId()} className="question-card">
            <h3>{question.getTitle()}</h3>
            <p>Type: {QuestionType[question.getType()]}</p>
            <p>Solution: {question.getSolution()}</p>
            <div className="blocks">
              <h4>Blocks:</h4>
              {question.getBlocksList().map((block, index) => (
                <div key={index} className="block">
                  <span>Text: {block.getText()}</span>
                  <span>Show: {block.getShowinoption() ? "Yes" : "No"}</span>
                  <span>Answer: {block.getIsanswer() ? "Yes" : "No"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
