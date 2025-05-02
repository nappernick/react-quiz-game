// src/core/ports/QuizRepository.ts
/**
 * Port for accessing quiz questions and sets
 */
import { QuizQuestion, QuizSet } from '../domain/Quiz';

export interface QuizRepository {
  /**
   * Get all available quiz sets
   */
  getAllQuizSets(): Promise<QuizSet[]>;
  
  /**
   * Get a specific quiz set by ID
   */
  getQuizSetById(id: string): Promise<QuizSet | null>;
  
  /**
   * Get all questions from a specific quiz set
   */
  getQuestionsBySetId(setId: string): Promise<QuizQuestion[]>;
}
