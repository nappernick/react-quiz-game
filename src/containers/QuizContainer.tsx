// src/containers/QuizContainer.tsx
import React from 'react';
import { useQuizPresenter } from '../adapters/presenters/QuizPresenter';
import QuestionCard from '../components/QuestionCard';
import ConfidenceSlider from '../components/ConfidenceSlider';


export default function QuizContainer() {

  const viewModel = useQuizPresenter();
  const {
    state: {
      questions,
      currentQuestionIndex,
      selectedAnswerId,
      confidence,
      stage,
      score,
      streak,
      isLoading,
      error
    },
    selectAnswer,
    setConfidence,
    submitAnswer,
    nextQuestion,
    restartQuiz
  } = viewModel;


  const currentQuestion = questions[currentQuestionIndex];


  if (isLoading) {
    return <div className="quiz-container">Loading questions...</div>;
  }


  if (error) {
    return (
      <div className="quiz-container error">
        <p>Error: {error}</p>
        <button onClick={() => restartQuiz()}>Try Again</button>
      </div>
    );
  }


  if (questions.length === 0) {
    return <div className="quiz-container">No questions available.</div>;
  }


  if (stage === 'complete') {
    return (
      <div className="quiz-container complete">
        <h2>Quiz Complete!</h2>
        <p>Your final score: {score}</p>
        <button onClick={() => restartQuiz()}>Play Again</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="quiz-score">
          Score: {score} | Streak: {streak}
        </div>
      </div>

      <div className="quiz-content">

        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswerId}
          onSelect={selectAnswer}
          disabled={stage === 'explanation'}
        />


        {stage === 'explanation' && currentQuestion.explanation && (
          <div className="explanation">
            <h3>Explanation:</h3>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}


        <div className="quiz-controls">
          {stage === 'question' ? (
            <>
              <ConfidenceSlider value={confidence} onChange={setConfidence} />
              <button 
                onClick={submitAnswer} 
                disabled={!selectedAnswerId}
                className="submit-button"
              >
                Submit Answer
              </button>
            </>
          ) : (
            <button 
              onClick={nextQuestion} 
              className="next-button"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
