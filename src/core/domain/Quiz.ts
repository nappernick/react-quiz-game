// src/core/domain/Quiz.ts
/**
 * Core domain model for quiz questions
 */

/**
 * Represents a single option for a quiz question.
 */
export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

/**
 * Represents a single quiz question.
 */
export interface QuizQuestion {
  id: string;
  questionText: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation: string;
  topic?: 'TypeScript' | 'React';
  text?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

/**
 * Represents a set of quiz questions.
 */
export interface QuizSet {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

/**
 * Represents the result of a quiz question attempt.
 */
export type QuizResult = 
  | CorrectQuizResult
  | IncorrectQuizResult;

/**
 * Represents a correct quiz answer
 */
export interface CorrectQuizResult {
  questionId: string;
  selectedOptionId: string;
  isCorrect: true;
  confidence?: number;
  score: number;
}

/**
 * Represents an incorrect quiz answer
 */
export interface IncorrectQuizResult {
  questionId: string;
  selectedOptionId: string;
  isCorrect: false;
  confidence?: number;
  score: number;
}

/**
 * Represents the different stages of the quiz game.
 */
export type QuizStage = 'idle' | 'loading' | 'question' | 'explanation' | 'complete';

/**
 * Represents the user's selected answer and confidence level.
 */
export interface AnswerSubmission {
  questionId: string;
  selectedAnswerId: string;
  confidence: number;
}
