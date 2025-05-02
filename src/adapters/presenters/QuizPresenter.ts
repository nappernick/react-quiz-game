// src/adapters/presenters/QuizPresenter.ts
import { useState, useEffect, useCallback } from 'react';
import { QuizPresenter, QuizState, QuizService } from '../../core/application/QuizService';
import { QuizRepository } from '../../core/ports/QuizRepository';
import { JsonQuizRepository } from '../repositories/JsonQuizRepository';


export interface QuizViewModel {
  state: QuizState;
  selectAnswer: (answerId: string) => void;
  setConfidence: (level: number) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  restartQuiz: () => void;
  initializeQuiz: (quizSetId?: string) => Promise<void>;
}


export function useQuizPresenter(): QuizViewModel {

  const [state, setState] = useState<QuizState>({
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
  });


  const presenter: QuizPresenter = {
    updateState(partialState: Partial<QuizState>) {
      setState(prevState => ({ ...prevState, ...partialState }));
    }
  };


  const repository: QuizRepository = new JsonQuizRepository();


  const serviceRef = useCallback(() => {
    return new QuizService(presenter, repository);
  }, []);


  const initializeQuiz = useCallback(async (quizSetId?: string) => {
    const service = serviceRef();
    await service.initialize(quizSetId);
  }, [serviceRef]);

  const selectAnswer = useCallback((answerId: string) => {
    const service = serviceRef();
    service.selectAnswer(answerId);
  }, [serviceRef]);

  const setConfidence = useCallback((level: number) => {
    const service = serviceRef();
    service.setConfidence(level);
  }, [serviceRef]);

  const submitAnswer = useCallback(() => {
    const service = serviceRef();
    service.submitAnswer();
  }, [serviceRef]);

  const nextQuestion = useCallback(() => {
    const service = serviceRef();
    service.nextQuestion();
  }, [serviceRef]);

  const restartQuiz = useCallback(() => {
    const service = serviceRef();
    service.restartQuiz();
  }, [serviceRef]);


  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);


  return {
    state,
    selectAnswer,
    setConfidence,
    submitAnswer,
    nextQuestion,
    restartQuiz,
    initializeQuiz
  };
}
