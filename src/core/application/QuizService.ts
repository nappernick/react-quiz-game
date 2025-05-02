// src/core/application/QuizService.ts
import { QuizQuestion, QuizOption, QuizSet, QuizResult } from '../domain/Quiz';
import { QuizRepository } from '../ports/QuizRepository';


export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswerId: string | null;
  confidence: number;
  stage: 'question' | 'explanation' | 'complete';
  score: number;
  streak: number;
  results: QuizResult[];
  isLoading: boolean;
  error: string | null;
}


export interface QuizPresenter {
  updateState(state: Partial<QuizState>): void;
}

export class QuizService {
  private state: QuizState;
  private presenter: QuizPresenter;
  private repository: QuizRepository;

  constructor(
    presenter: QuizPresenter,
    repository: QuizRepository
  ) {
    this.presenter = presenter;
    this.repository = repository;
    this.state = {
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswerId: null,
      confidence: 50,
      stage: 'question',
      score: 0,
      streak: 0,
      results: [],
      isLoading: true,
      error: null
    };
  }


  async initialize(quizSetId?: string): Promise<void> {
    try {
      this.updateState({ isLoading: true });
      
      let questions: QuizQuestion[] = [];
      
      if (quizSetId) {
        // Load questions from a specific quiz set
        questions = await this.repository.getQuestionsBySetId(quizSetId);
      } else {
        // Load all quiz sets and combine questions
        const quizSets = await this.repository.getAllQuizSets();
        questions = quizSets.flatMap(set => set.questions);
      }
      
      // Shuffle questions
      const shuffledQuestions = this.shuffleArray([...questions]);
      
      this.updateState({ 
        questions: shuffledQuestions,
        currentQuestionIndex: 0,
        selectedAnswerId: null,
        confidence: 50,
        stage: 'question',
        score: 0,
        streak: 0,
        results: [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      this.updateState({ 
        error: `Failed to load questions: ${error instanceof Error ? error.message : String(error)}`,
        isLoading: false
      });
    }
  }


  selectAnswer(answerId: string): void {
    this.updateState({ selectedAnswerId: answerId });
  }


  setConfidence(level: number): void {
    this.updateState({ confidence: level });
  }


  submitAnswer(): void {
    const { questions, currentQuestionIndex, selectedAnswerId, confidence } = this.state;
    
    if (!selectedAnswerId) {
      this.updateState({ error: 'Please select an answer before submitting' });
      return;
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = currentQuestion.options.find(opt => opt.id === selectedAnswerId);
    
    if (!selectedOption) {
      this.updateState({ error: 'Selected answer not found' });
      return;
    }
    
    const isCorrect = selectedOption.isCorrect;
    
    // Update streak based on correctness
    const newStreak = isCorrect ? this.state.streak + 1 : 0;
    
    // Calculate score based on correctness and confidence
    const scoreChange = isCorrect
      ? Math.max(1, Math.floor(confidence / 33)) + 1 // Correct: 1-3 points based on confidence
      : -Math.max(1, Math.floor(confidence / 33));  // Incorrect: lose points based on confidence
      
    // Create a result entry using discriminated union type
    const result: QuizResult = isCorrect
      ? {
          questionId: currentQuestion.id,
          selectedOptionId: selectedAnswerId,
          isCorrect: true, // Literal true for correct answers
          confidence,
          score: scoreChange
        }
      : {
          questionId: currentQuestion.id,
          selectedOptionId: selectedAnswerId,
          isCorrect: false, // Literal false for incorrect answers
          confidence,
          score: scoreChange
        };
    
    // Update state
    this.updateState({
      selectedAnswerId: null,
      stage: 'explanation',
      score: this.state.score + result.score,
      streak: newStreak,
      results: [...this.state.results, result],
      error: null
    });
  }


  nextQuestion(): void {
    const { questions, currentQuestionIndex } = this.state;
    
    if (currentQuestionIndex >= questions.length - 1) {
      // Quiz completed
      this.updateState({
        stage: 'complete',
        error: null
      });
    } else {
      // Move to next question
      this.updateState({
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedAnswerId: null,
        confidence: 50,
        stage: 'question',
        error: null
      });
    }
  }


  restartQuiz(): void {
    const shuffledQuestions = this.shuffleArray([...this.state.questions]);
    
    this.updateState({
      questions: shuffledQuestions,
      currentQuestionIndex: 0,
      selectedAnswerId: null,
      confidence: 50,
      stage: 'question',
      score: 0,
      streak: 0,
      results: [],
      error: null
    });
  }


  getState(): QuizState {
    return { ...this.state };
  }


  private updateState(partialState: Partial<QuizState>): void {
    this.state = { ...this.state, ...partialState };
    this.presenter.updateState(partialState);
  }


  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
