import React, { useState, useEffect } from "react";
import { BiText, BiCheck, BiShuffle } from "react-icons/bi";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import shuffleArray from "./shuffleArray";

function AnagramQuestion({ question }) {
  const [blocks, setBlocks] = useState(() => {
    const initialBlocks = question.getBlocksList();
    return shuffleArray(initialBlocks); // Shuffle the blocks on initialization
  });
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // This is needed for react-beautiful-dnd to work in StrictMode
    const animation = requestAnimationFrame(() => {
      setEnabled(true);
    });

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
  };

  const checkAnswer = () => {
    const userAnswer = blocks.map((block) => block.getText()).join(" ");
    const correctAnswer = question
      .getBlocksList()
      .filter((block) => block.getIsanswer())
      .map((block) => block.getText())
      .join(" ");

    setIsCorrect(userAnswer === correctAnswer);
    setIsChecked(true);
  };

  const resetBlocks = () => {
    setBlocks(question.getBlocksList());
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

      {enabled && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable droppableId="blocks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {blocks.map((block, index) => (
                  <Draggable
                    key={block.getText() + index}
                    draggableId={block.getText() + index}
                    index={index}
                    isDragDisabled={isChecked}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white border rounded-lg p-4 transition-all ${
                          snapshot.isDragging
                            ? "shadow-lg border-primary-500"
                            : "border-secondary-200"
                        } ${
                          isChecked
                            ? block.getIsanswer() &&
                              index === blocks.findIndex((b) => b.getIsanswer())
                              ? "border-success-500 bg-success-50"
                              : "border-error-500 bg-error-50"
                            : "hover:border-primary-500 cursor-move"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BiText className="text-secondary-400" />
                            <span className="text-secondary-700">
                              {block.getText()}
                            </span>
                          </div>
                          {!isChecked && (
                            <div className="text-secondary-400 text-sm">
                              Drag to reorder
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      )}

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
