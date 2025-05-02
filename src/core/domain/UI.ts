// src/core/domain/UI.ts


import { QuizQuestion, QuizOption } from './Quiz';
import { CodingChallenge } from './CodingChallenge';
import { Sequence } from './Sequence';


export interface RawQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty?: number;
  topic?: string;
}


export interface QuestionData extends RawQuestion {
  id: string;
  explanation: string;
  difficulty: number;
  topic: string;
  lastSeen: number;
  interval: number;
}


export interface QuestionSet {
  id: string;
  name: string;
  data: RawQuestion[];
}


export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
  className?: string;
}


export interface ConfidenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}


export interface QuestionCardProps {
  question: QuizQuestion;
  selectedAnswer: string | null;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
}


export interface CodingChallengeCardProps {
  challenge: CodingChallenge;
  userCode: string;
  onCodeChange: (code: string) => void;
  onSubmit: () => void;
  output: string;
  isExecuting: boolean;
}


export interface SequenceCardProps {
  sequence: Sequence;
  currentOrder: string[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onCheck: () => void;
  onReset: () => void;
  result: boolean[] | null;
}


export interface QuizGameState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswerId: string | null;
  confidence: number;
  stage: 'playing' | 'review' | 'results';
  score: number;
  streak: number;
  isLoading: boolean;
}


export interface QuizGameActions {
  submitAnswer: () => void;
  nextQuestion: () => void;
  restartQuiz: () => void;
  setConfidence: (level: number) => void;
  setSelectedAnswer: (optionId: string) => void;
}


export interface CodingChallengeState {
  challenges: CodingChallenge[];
  currentChallengeIndex: number;
  currentChallenge?: CodingChallenge | null;
  userCode: string;
  output: string;
  isExecuting: boolean;
  isCorrect: boolean | null;
  isRunning?: boolean;
}


export interface CodingChallengeActions {
  updateCode: (code: string) => void;
  executeCode: () => void;
  nextChallenge: () => void;
  previousChallenge: () => void;
  setUserCode?: (code: string) => void;
  handleRunCode?: () => void;
  setCurrentChallengeById?: (id: string | null) => void;
}
