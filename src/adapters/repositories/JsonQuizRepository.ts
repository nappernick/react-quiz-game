// src/adapters/repositories/JsonQuizRepository.ts
import { QuizRepository } from '../../core/ports/QuizRepository';
import { QuizQuestion, QuizSet } from '../../core/domain/Quiz';
import { initialQuizQuestions } from '../../data/quizQuestions';

export class JsonQuizRepository implements QuizRepository {
  private quizSets: QuizSet[];

  constructor() {
    // Convert the quiz questions data to our domain model
    this.quizSets = [
      {
        id: 'default',
        title: 'Default Quiz',
        description: 'A collection of quiz questions on various topics',
        questions: initialQuizQuestions
      }
    ];
  }

  async getAllQuizSets(): Promise<QuizSet[]> {
    return this.quizSets;
  }

  async getQuizSetById(id: string): Promise<QuizSet | null> {
    const quizSet = this.quizSets.find(set => set.id === id);
    return quizSet || null;
  }

  async getQuestionsBySetId(setId: string): Promise<QuizQuestion[]> {
    const quizSet = await this.getQuizSetById(setId);
    return quizSet ? quizSet.questions : [];
  }
}
