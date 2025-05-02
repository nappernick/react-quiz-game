// src/App.tsx
import { useState } from 'react';
import QuizContainer from './containers/QuizContainer';
import PreloadedQuiz from './components/PreloadedQuiz';
import SequenceGameContainer from './containers/SequenceGameContainer';
import CodingChallengeContainer from './containers/CodingChallengeContainer';
import './App.css';
import './index.css';

export default function App() {
  const [mode, setMode] = useState<'quiz' | 'sequence' | 'preloaded' | 'codingChallenge'>('codingChallenge');


  if (mode === 'sequence' || mode === 'preloaded') {
    return (
      <div className="container">
        <nav className="game-nav">
          <button onClick={() => setMode('quiz')}>Quiz</button>
          <button onClick={() => setMode('sequence')} className={mode === 'sequence' ? 'active' : ''}>Sequence Game</button>
          <button onClick={() => setMode('preloaded')} className={mode === 'preloaded' ? 'active' : ''}>Preloaded Quiz</button>
          <button onClick={() => setMode('codingChallenge')}>Coding Challenge</button> 
        </nav>
        {mode === 'sequence' && <SequenceGameContainer />}
        {mode === 'preloaded' && <PreloadedQuiz />}
      </div>
    )
  }


  if (mode === 'codingChallenge') {
    return (
      <div className="coding-container">
        <nav className="game-nav">
          <button onClick={() => setMode('quiz')}>Quiz</button>
          <button onClick={() => setMode('sequence')}>Sequence Game</button>
          <button onClick={() => setMode('preloaded')}>Preloaded Quiz</button>
          <button onClick={() => setMode('codingChallenge')} className={mode === 'codingChallenge' ? 'active' : ''}>Coding Challenge</button>
        </nav>

        <CodingChallengeContainer />
      </div>
    );
  }
  

  if (mode === 'quiz') {
    return (
      <div className="container">
        <nav className="game-nav">
          <button onClick={() => setMode('quiz')} className={mode === 'quiz' ? 'active' : ''}>Quiz</button>
          <button onClick={() => setMode('sequence')}>Sequence Game</button>
          <button onClick={() => setMode('preloaded')}>Preloaded Quiz</button>
          <button onClick={() => setMode('codingChallenge')}>Coding Challenge</button> 
        </nav>

        <QuizContainer />
      </div>
    );
  }
}