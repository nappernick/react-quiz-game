// src/components/PreloadedQuiz.tsx
import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizOption } from '../core/domain/Quiz';
import { RawQuestion, QuestionData, QuestionSet } from '../core/domain/UI';
import QuestionCard from './QuestionCard';
import '../App.css';
import '../styles/PreloadedQuiz.css';

import regularQuestionsJson from '../data/questions.json';
import challengingQuestionsJson from '../data/challenging_questions.json';
import moreQuestionsJson from '../data/more_questions.json';

const PRELOADED_QUIZ_KEY = 'preloadedQuizState';

const questionSets: QuestionSet[] = [
  { id: 'regular', name: 'Regular Questions', data: regularQuestionsJson },
  { id: 'more', name: 'More Questions', data: moreQuestionsJson },
  { id: 'challenging', name: 'Challenging Questions', data: challengingQuestionsJson }
];

const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  const shuffledArray = [...array]; 
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex], shuffledArray[currentIndex]];
  }
  return shuffledArray;
};

export default function PreloadedQuiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeSet, setActiveSet] = useState<string>(questionSets[0].id);
  const [score, setScore] = useState(0);
  const [needsReview, setNeedsReview] = useState<number[]>([]);

  const loadQuestions = (setId: string) => {
    const selectedSet = questionSets.find(set => set.id === setId) || questionSets[0];
    const shuffledData = shuffleArray(selectedSet.data);
    const data: QuizQuestion[] = shuffledData.map((q, index) => {
      const options: QuizOption[] = q.options.map((text, optIndex) => ({
        id: String.fromCharCode(65 + optIndex), 
        text: text,
      }));
      const correctOptionId = String.fromCharCode(65 + q.correctIndex);

      return {
        id: `${setId}-${index}`, 
        questionText: q.question,
        options: options,
        correctAnswerId: correctOptionId,
        explanation: q.explanation || '',
      };
    });
    setQuestions(data);
    setCurrentIdx(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setNeedsReview([]); 
  };

  useEffect(() => {
    const savedStateRaw = localStorage.getItem(`${PRELOADED_QUIZ_KEY}_${activeSet}`);
    let initialIdx = 0;
    let initialSelected: string | null = null;
    let initialShowFeedback = false;
    let initialScore = 0;
    let initialNeedsReview: number[] = [];

    if (savedStateRaw) {
      try {
        const savedState = JSON.parse(savedStateRaw);
        initialIdx = savedState.currentIdx || 0;
        initialSelected = typeof savedState.selected === 'string' ? savedState.selected : null;
        initialShowFeedback = savedState.showFeedback || false;
        initialScore = savedState.score || 0;
        initialNeedsReview = savedState.needsReview || [];
      } catch (e) {
        console.error("Error parsing saved quiz state:", e);
        localStorage.removeItem(`${PRELOADED_QUIZ_KEY}_${activeSet}`); 
      }
    }

    setCurrentIdx(initialIdx);
    setSelected(initialSelected);
    setShowFeedback(initialShowFeedback);
    setScore(initialScore);
    setNeedsReview(initialNeedsReview);
    loadQuestions(activeSet); 


  }, [activeSet]);

  useEffect(() => {
    if (questions.length > 0) {
      const stateToSave = {
        currentIdx,
        selected,
        showFeedback,
        score,
        needsReview, 
      };
      localStorage.setItem(`${PRELOADED_QUIZ_KEY}_${activeSet}`, JSON.stringify(stateToSave));
    }
  }, [currentIdx, selected, showFeedback, score, needsReview, activeSet, questions]);

  if (questions.length === 0) return <div>Loading questions...</div>;

  const current = questions[currentIdx];

  const handleSubmit = () => {
    const isCorrect = selected === current.correctAnswerId;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      setNeedsReview(prev => prev.filter(idx => idx !== currentIdx));
    } else {
      setNeedsReview(prev => (prev.includes(currentIdx) ? prev : [...prev, currentIdx]));
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);

    let nextIdx;
    if (needsReview.length > 0) {
      const randomIndexInNeedsReview = Math.floor(Math.random() * needsReview.length);
      nextIdx = needsReview[randomIndexInNeedsReview];
    } else {
      nextIdx = Math.min(currentIdx + 1, questions.length - 1);
    }

    if (nextIdx === currentIdx && needsReview.length === 0 && currentIdx < questions.length - 1) {
       nextIdx = currentIdx + 1;
    }

    setCurrentIdx(nextIdx);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your progress for this quiz set?')) {
      setCurrentIdx(0);
      setSelected(null);
      setShowFeedback(false);
      setScore(0);
      setNeedsReview([]);
      localStorage.removeItem(`${PRELOADED_QUIZ_KEY}_${activeSet}`);
      loadQuestions(activeSet); 
    }
  };

  const handleSetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveSet(event.target.value);
  };

  return (
    <div className="preloaded-quiz">
      <div className="question-set-selector">
        <label>
          Question Set:
          <select
            value={activeSet}
            onChange={handleSetChange}
            className="question-set-dropdown"
          >
            {questionSets.map(set => (
              <option key={set.id} value={set.id}>
                {set.name} ({set.data.length} questions)
              </option>
            ))}
          </select>
        </label>
         <button onClick={handleReset} className="reset-button">Reset Progress</button> 
      </div>

      {current && (
        <QuestionCard question={current} selectedAnswer={selected} onSelect={setSelected} />
      )}

      {!showFeedback ? (
        <button disabled={selected === null} onClick={handleSubmit}>Submit Answer</button>
      ) : (
        <div className="review">
          {current && (
            <>
              <p className={selected === current.correctAnswerId ? 'correct-answer' : 'incorrect-answer'}>
                {selected === current.correctAnswerId ? ' Correct' : ' Incorrect'}
              </p>
              <p><strong>Answer:</strong> <span className="correct-answer">{current.options.find(opt => opt.id === current.correctAnswerId)?.text}</span></p>
              {current.explanation && <div className="explanation">{current.explanation}</div>}
            </>
          )}
          <button onClick={handleNext} disabled={currentIdx === questions.length - 1 && needsReview.length === 0}>Next</button>
        </div>
      )}

      <div className="progress">
        <div>Question {currentIdx + 1} of {questions.length}</div>
        <div className="score-info">Score: <span className="score-highlight">{score}</span></div>
         {needsReview.length > 0 && (
          <div className="needs-review-info">Needs Review: {needsReview.length}</div>
        )}
      </div>
    </div>
  );
}
