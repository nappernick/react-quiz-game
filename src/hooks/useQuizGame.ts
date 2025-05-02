// src/hooks/useQuizGame.ts
import { useState, useCallback, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuizQuestion, QuizStage } from '../core/domain/Quiz';
import { QuizGameState, QuizGameActions, QuestionData } from '../core/domain/UI';

type LocalQuizStage = QuizStage | 'playing' | 'review' | 'results' | 'idle' | 'answering';

const LOCAL_KEY = 'quiz_game_state';

const calculateNextInterval = (currentInterval: number, isCorrect: boolean): number => {
  if (isCorrect) {
    return Math.max(1, currentInterval * 2);
  } else {
    return Math.max(1, Math.floor(currentInterval / 2));
  }
};

const selectNextQuestion = (questions: QuestionData[], lastTopic: string | null): QuestionData | null => {
  if (questions.length === 0) return null;

  const now = Date.now();
  const dueQuestions = questions.filter(q => q.lastSeen + q.interval * 60000 <= now);

  if (dueQuestions.length > 0) {
    dueQuestions.sort((a, b) => {
      if (lastTopic && a.topic !== lastTopic && b.topic === lastTopic) return -1;
      if (lastTopic && a.topic === lastTopic && b.topic !== lastTopic) return 1;
      return a.lastSeen - b.lastSeen;
    });
    return dueQuestions[0];
  }

  const sortedByLastSeen = [...questions].sort((a, b) => a.lastSeen - b.lastSeen);
  return sortedByLastSeen[0];
};

const initialState: Omit<QuizGameState, 'questions'> = {
  currentQuestionIndex: 0,
  selectedAnswerId: null,
  confidence: 3,
  stage: 'playing',
  score: 0,
  streak: 0,
  isLoading: false,
};

export function useQuizGame(): [QuizGameState, QuizGameActions] {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [stage, setStage] = useState<LocalQuizStage>('idle');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [lastTopic, setLastTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentQuestion = currentId ? questions.find(q => q.id === currentId) : null;

  const selectNext = useCallback(() => {
    setSelectedAnswer(null);
    setConfidence(null);
    setStage('playing');
    
    const nextQuestion = selectNextQuestion(questions, lastTopic);
    if (nextQuestion) {
      setCurrentId(nextQuestion.id);
    } else {
      setStage('idle');
    }
  }, [questions, lastTopic]);

  const handleFileUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rawQuestions = JSON.parse(reader.result as string) as any[];
        const now = Date.now();
        const processedQuestions: QuestionData[] = rawQuestions.map((q, i) => ({
          id: uuidv4(),
          question: q.question || '',
          options: q.options || [],
          correctIndex: q.correctIndex ?? -1,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 1,
          topic: q.topic || 'General',
          lastSeen: 0,
          interval: 1,
          ...q,
        }));        
        setQuestions(processedQuestions);
        setStage('idle'); // Go to idle after upload to allow selection
        setCurrentId(null);
        setScore(0);
        setStreak(0);
        setBadges([]);
        setLastTopic(null);
        setSelectedAnswer(null);
        setConfidence(null);
        if (processedQuestions.length > 0) {
           const firstQuestion = selectNextQuestion(processedQuestions, null);
           if (firstQuestion) {
               setCurrentId(firstQuestion.id);
               setStage('answering');
           }
        }
      } catch (error) {
        console.error('Failed to parse JSON file:', error);
        alert('Error loading file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer !== null) {
       setStage('review');
    }
  }, [selectedAnswer]);

  const handleNext = useCallback(() => {
    if (!currentQuestion || confidence === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    const points = isCorrect ? confidence * 10 : -confidence * 5;

    setScore(prev => {
        const newScore = Math.max(0, prev + points);
        if (newScore >= 100 && !badges.includes('Score 100')) {
            setBadges(b => [...b, 'Score 100']);
        }
        return newScore;
    });

    setStreak(prev => {
        const newStreak = isCorrect ? prev + 1 : 0;
        if (newStreak === 5 && !badges.includes('5-Streak')) {
            setBadges(b => [...b, '5-Streak']);
        }
        return newStreak;
    });

    setQuestions(prevQs =>
      prevQs.map(q =>
        q.id === currentId
          ? { 
              ...q, 
              lastSeen: Date.now(), 
              interval: calculateNextInterval(q.interval, isCorrect) 
            }
          : q
      )
    );

    setLastTopic(currentQuestion.topic);
    selectNext(); // Select the next question
  }, [currentQuestion, confidence, selectedAnswer, badges, currentId, selectNext]);

  const handleRestart = useCallback(() => {
    localStorage.removeItem(LOCAL_KEY);
    setQuestions([]);
    setCurrentId(null);
    setStage('idle');
    setScore(0);
    setStreak(0);
    setBadges([]);
    setLastTopic(null);
    setSelectedAnswer(null);
    setConfidence(null);
    setIsLoading(false);
  }, []);

  const state: QuizGameState = {
    questions: questions as unknown as QuizQuestion[],
    currentQuestionIndex: currentId ? questions.findIndex(q => q.id === currentId) : 0,
    selectedAnswerId: selectedAnswer !== null ? String(selectedAnswer) : null,
    confidence: confidence || 3,
    stage: stage as 'playing' | 'review' | 'results',
    score,
    streak,
    isLoading,
  };

  const actions: QuizGameActions = {
    submitAnswer: handleSubmitAnswer,
    nextQuestion: handleNext,
    restartQuiz: handleRestart,
    setConfidence: (level: number) => setConfidence(level),
    setSelectedAnswer: (optionId: string) => setSelectedAnswer(Number(optionId)),
  };

  return [state, actions];
}
