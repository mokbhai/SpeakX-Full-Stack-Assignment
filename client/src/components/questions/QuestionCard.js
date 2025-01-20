import React from "react";
import AnagramQuestion from "./AnagramQuestion.js";
import MCQQuestion from "./MCQQuestion.js";
import ReadAlongQuestion from "./ReadAlongQuestion.js";
import ContentOnlyQuestion from "./ContentOnlyQuestion.js";
import ConversationQuestion from "./ConversationQuestion.js";
import { QuestionType } from "../../grpc/questions_pb";
import { BiCheckSquare, BiBook, BiNote, BiConversation } from "react-icons/bi";
import { PiPuzzlePiece } from "react-icons/pi";

const getQuestionTypeName = (typeValue) => {
  const typeNames = {
    0: "UNKNOWN",
    1: "ANAGRAM",
    2: "MCQ",
    3: "READ_ALONG",
    4: "CONTENT_ONLY",
    5: "CONVERSATION",
  };
  return typeNames[typeValue] || `Unknown (${typeValue})`;
};

const getQuestionIcon = (type) => {
  switch (type) {
    case QuestionType.ANAGRAM:
      return <PiPuzzlePiece className="h-5 w-5" />;
    case QuestionType.MCQ:
      return <BiCheckSquare className="h-5 w-5" />;
    case QuestionType.READ_ALONG:
      return <BiBook className="h-5 w-5" />;
    case QuestionType.CONTENT_ONLY:
      return <BiNote className="h-5 w-5" />;
    case QuestionType.CONVERSATION:
      return <BiConversation className="h-5 w-5" />;
    default:
      return null;
  }
};

function QuestionCard({ question }) {
  const renderQuestionContent = () => {
    switch (question.getType()) {
      case QuestionType.ANAGRAM:
        return <AnagramQuestion question={question} />;
      case QuestionType.MCQ:
        return <MCQQuestion question={question} />;
      case QuestionType.READ_ALONG:
        return <ReadAlongQuestion question={question} />;
      case QuestionType.CONTENT_ONLY:
        return <ContentOnlyQuestion question={question} />;
      case QuestionType.CONVERSATION:
        return <ConversationQuestion question={question} />;
      default:
        return <p>Unknown question type ({question.getType()})</p>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-card-hover transition-shadow p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-secondary-900">
          {question.getTitle()}
        </h3>
        <div className="flex items-center gap-2 text-primary-500 bg-primary-50 px-3 py-1 rounded-full">
          {getQuestionIcon(question.getType())}
          <span className="text-sm font-medium">
            {getQuestionTypeName(question.getType())}
          </span>
        </div>
      </div>

      {renderQuestionContent()}
    </div>
  );
}

export default QuestionCard;
