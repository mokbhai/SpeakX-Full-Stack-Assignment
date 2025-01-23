import React, { useState } from "react";
import { BiText, BiCheck, BiShuffle } from "react-icons/bi";
import shuffleArray from "./shuffleArray";

function AnagramQuestion({ question, correctAnswer }) {
  const [blocks, setBlocks] = useState(() => {
    const initialBlocks = question.getBlocksList();
    return shuffleArray(initialBlocks);
  });
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const items = Array.from(blocks);
    const draggedItemContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedItemContent);

    setBlocks(items);
    setDraggedItem(index);
  };

  const checkAnswer = () => {
    const userAnswer = blocks
      .filter((block) => block.getIsanswer())
      .map((block) => block.getText())
      .join(" ");

    setIsCorrect(userAnswer === correctAnswer);
    console.log("userAnswer", userAnswer);
    console.log("correctAnswer", correctAnswer);
    setIsChecked(true);
  };

  const resetBlocks = () => {
    const initialBlocks = question.getBlocksList();
    const shuffledBlocks = shuffleArray(initialBlocks);
    setBlocks(shuffledBlocks);
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-secondary-900">
          Arrange the blocks in correct order:
        </h4>
        <button
          onClick={resetBlocks}
          className="flex items-center gap-2 px-3 py-1 text-secondary-600 hover:text-primary-500 transition-colors"
        >
          <BiShuffle className="h-5 w-5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div
            key={block.getText() + index}
            draggable={!isChecked}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            className={`bg-white border rounded-lg p-4 transition-all ${
              isChecked
                ? isCorrect
                  ? "border-success-500 bg-success-50"
                  : "border-error-500 bg-error-50"
                : "border-secondary-200 hover:border-primary-500 cursor-move"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BiText className="text-secondary-400" />
                <span className="text-secondary-700">{block.getText()}</span>
              </div>
              {!isChecked && (
                <div className="text-secondary-400 text-sm">
                  Drag to reorder
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        {!isChecked ? (
          <button
            onClick={checkAnswer}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            <BiCheck className="h-5 w-5" />
            Check Answer
          </button>
        ) : (
          <div
            className={`text-center p-4 rounded-lg ${
              isCorrect
                ? "bg-success-50 text-success-500"
                : "bg-error-50 text-error-500"
            }`}
          >
            <p className="font-medium mb-2">
              {isCorrect
                ? "Correct! Well done!"
                : "Not quite right. Try again!"}
            </p>
            {!isCorrect && (
              <div className="mt-4 p-4 bg-white rounded-lg text-secondary-700">
                <p className="font-medium mb-2">Correct Answer:</p>
                <p>
                  {question
                    .getBlocksList()
                    .filter((block) => block.getIsanswer())
                    .map((block) => block.getText())
                    .join(" ")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnagramQuestion;
