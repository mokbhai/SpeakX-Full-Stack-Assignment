import mongoose from "mongoose";

export const QuestionType = {
  ANAGRAM: "ANAGRAM",
  MCQ: "MCQ",
  READ_ALONG: "READ_ALONG",
  CONTENT_ONLY: "CONTENT_ONLY",
  CONVERSATION: "CONVERSATION",
};

export const AnagramType = {
  WORD: "WORD",
  SENTENCE: "SENTENCE",
};

const anagramBlockSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  showInOption: {
    type: Boolean,
    required: true,
    default: true,
  },
  isAnswer: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const mcqOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrectAnswer: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// in every question type, title is required, type is required
// if question type is anagram, then anagramType is required and blocks are required
// if question type is mcq, then options are required
// if question type is read along, nothing is required
// if question type is content only,nothing is required
// if question type is conversation, nothing is required

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(QuestionType),
    required: true,
  },
  solution: {
    type: String,
    required: false,
  },
  siblingId: {
    type: String, // it should be id but, i don't understand what is the relation between siblingId and questionId?? so i left it as string
    required: false,
  },
  anagramType: {
    type: String,
    enum: Object.values(AnagramType),
    required: function () {
      return this.type === QuestionType.ANAGRAM;
    },
  },
  blocks: {
    type: [anagramBlockSchema],
    required: function () {
      return this.type === QuestionType.ANAGRAM;
    },
  },
  options: {
    type: [mcqOptionSchema],
    required: function () {
      return this.type === QuestionType.MCQ;
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Question", questionSchema);
