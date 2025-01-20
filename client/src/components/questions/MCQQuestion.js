import React, { useState } from "react";
import { BiCheckCircle, BiXCircle, BiRadioCircle } from "react-icons/bi";

function MCQQuestion({ question }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    if (selectedOption === null) {
      setSelectedOption(option);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-secondary-900">Select the correct answer:</h4>
      <div className="space-y-3">
        {question.getOptionsList().map((option, index) => {
          const isSelected = selectedOption === option;
          const showResult = isSelected;

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
              className={`w-full flex items-center justify-between bg-white border rounded-lg p-4 transition-colors ${
                isSelected
                  ? "border-primary-500 bg-primary-50"
                  : selectedOption
                  ? "border-secondary-200 opacity-70"
                  : "border-secondary-200 hover:border-primary-500 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 ${
                    isSelected ? "text-primary-500" : "text-secondary-400"
                  }`}
                >
                  <BiRadioCircle className="h-5 w-5" />
                </div>
                <span className="text-secondary-700 text-left">
                  {option.getText()}
                </span>
              </div>

              {showResult && (
                <div
                  className={`flex items-center gap-2 ${
                    option.getIscorrectanswer()
                      ? "text-success-500"
                      : "text-error-500"
                  }`}
                >
                  {option.getIscorrectanswer() ? (
                    <>
                      <BiCheckCircle className="h-5 w-5" />
                      <span className="font-medium">Correct!</span>
                    </>
                  ) : (
                    <>
                      <BiXCircle className="h-5 w-5" />
                      <span className="font-medium">Incorrect</span>
                    </>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedOption && !selectedOption.getIscorrectanswer() && (
        <div className="mt-4 p-4 bg-secondary-50 rounded-lg text-secondary-700">
          <p className="font-medium mb-2">Correct Answer:</p>
          <p>
            {question
              .getOptionsList()
              .find((opt) => opt.getIscorrectanswer())
              ?.getText()}
          </p>
        </div>
      )}
    </div>
  );
}

export default MCQQuestion;
