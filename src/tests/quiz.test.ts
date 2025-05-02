// src/tests/quiz.test.ts
import { describe, it, expect, beforeEach } from 'bun:test';
import { QuizQuestion, QuizOption, QuizResult } from '../core/domain/Quiz';
import { QuizService, QuizPresenter, QuizState } from '../core/application/QuizService';

// Mock presenter implementation for testing
class MockQuizPresenter implements QuizPresenter {
  public state: Partial<QuizState> = {};
  
  updateState(partialState: Partial<QuizState>): void {
    this.state = { ...this.state, ...partialState };
  }
}

// Mock repository implementation that returns predefined questions
class MockQuizRepository {
  private quizQuestions: QuizQuestion[] = [];
  
  constructor(questions: QuizQuestion[]) {
    this.quizQuestions = questions;
  }
  
  async getAllQuizSets() {
    return [{
      id: 'mock-set',
      title: 'Mock Quiz Set',
      description: 'A mock quiz set for testing',
      questions: this.quizQuestions
    }];
  }
  
  async getQuizSetById(id: string) {
    return {
      id: 'mock-set',
      title: 'Mock Quiz Set',
      description: 'A mock quiz set for testing',
      questions: this.quizQuestions
    };
  }
  
  async getQuestionsBySetId(setId: string) {
    return this.quizQuestions;
  }
}

// Test data: mock quiz questions with known correct answers
const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    questionText: 'What is 1 + 1?',
    options: [
      { id: 'A', text: '1' },
      { id: 'B', text: '2', isCorrect: true },
      { id: 'C', text: '3' },
      { id: 'D', text: '4' }
    ],
    correctAnswerId: 'B',
    explanation: 'Basic addition: 1 + 1 = 2'
  },
  {
    id: 'q2',
    questionText: 'What is TypeScript?',
    options: [
      { id: 'A', text: 'A programming language', isCorrect: true },
      { id: 'B', text: 'A text editor' },
      { id: 'C', text: 'A database' },
      { id: 'D', text: 'An operating system' }
    ],
    correctAnswerId: 'A',
    explanation: 'TypeScript is a strongly typed programming language that builds on JavaScript.'
  }
];

describe('Quiz Service Tests', () => {
  let presenter: MockQuizPresenter;
  let repository: MockQuizRepository;
  let service: QuizService;
  
  beforeEach(() => {
    presenter = new MockQuizPresenter();
    repository = new MockQuizRepository(mockQuizQuestions);
    service = new QuizService(presenter, repository);
  });
  
  it('initializes with correct default state', () => {
    const state = service.getState();
    expect(state.questions).toEqual([]);
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.selectedAnswerId).toBe(null);
    expect(state.confidence).toBe(50);
    expect(state.stage).toBe('question');
    expect(state.score).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.isLoading).toBe(true);
  });
  
  it('loads questions on initialize', async () => {
    await service.initialize();
    const state = service.getState();
    
    expect(state.questions.length).toBe(2);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });
  
  it('selects an answer correctly', async () => {
    await service.initialize();
    service.selectAnswer('B');
    
    const state = service.getState();
    expect(state.selectedAnswerId).toBe('B');
  });
  
  it('submits a correct answer and updates score', async () => {
    await service.initialize();
    service.selectAnswer('B'); // Correct answer for first question
    service.submitAnswer();
    
    const state = service.getState();
    expect(state.stage).toBe('explanation');
    expect(state.score).toBeGreaterThan(0);
    expect(state.streak).toBe(1);
  });
  
  it('submits an incorrect answer and resets streak', async () => {
    await service.initialize();
    service.selectAnswer('C'); // Incorrect answer for first question
    service.submitAnswer();
    
    const state = service.getState();
    expect(state.stage).toBe('explanation');
    expect(state.streak).toBe(0);
  });
  
  it('moves to the next question correctly', async () => {
    await service.initialize();
    service.selectAnswer('B');
    service.submitAnswer();
    service.nextQuestion();
    
    const state = service.getState();
    expect(state.currentQuestionIndex).toBe(1);
    expect(state.stage).toBe('question');
    expect(state.selectedAnswerId).toBe(null);
  });
  
  it('completes the quiz after the last question', async () => {
    await service.initialize();
    

    service.selectAnswer('B');
    service.submitAnswer();
    service.nextQuestion();
    service.selectAnswer('A');
    service.submitAnswer();
    service.nextQuestion();
    
    const state = service.getState();
    expect(state.stage).toBe('complete');
  });
  
  it('restarts the quiz correctly', async () => {
    await service.initialize();
    

    service.selectAnswer('B');
    service.submitAnswer();
    service.restartQuiz();
    
    const state = service.getState();
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.selectedAnswerId).toBe(null);
    expect(state.score).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.stage).toBe('question');
  });
});
