import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define the "quizzes" table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  userId: text("user_id"),
});

// Define relations for "quizzes"
export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
}));

// Define the "questions" table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text"),
  quizzId: integer("quizz_id"),
});

// Define relations for "questions"
export const questionsRelations = relations(questions, ({ one, many }) => ({
  quizz: one(quizzes, {
    fields: [questions.quizzId],
    references: [quizzes.id],
  }),
  answers: many(questionAnswers),
}));

// Define the "answers" table
export const questionAnswers = pgTable("answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id"),
  answerText: text("answer_text"),
  isCorrect: boolean("is_correct"),
});

// Define relations for "answers"
export const questionAnswersRelations = relations(questionAnswers, ({ one }) => ({
  question: one(questions, {
    fields: [questionAnswers.questionId],
    references: [questions.id],
  }),
}));
