// src/containers/CodingChallengeContainer.tsx
import React from 'react';
import { useCodingChallengePresenter } from '../adapters/presenters/CodingChallengePresenter';
import CodeEditor from '../components/CodeEditor';
import '../styles/CodingChallenge.css';

export default function CodingChallengeContainer() {
  const viewModel = useCodingChallengePresenter();
  const {
    state: {
      challenges,
      currentChallenge,
      userCode,
      output,
      isRunning,
      isLoading,
      error
    },
    selectChallenge,
    updateUserCode,
    runCode
  } = viewModel;

  return (
    <div className="coding-challenge-container">
      <div className="challenge-area">
        <div className="challenge-description">
          <h2>{currentChallenge?.title || 'No Challenge Selected'}</h2>
          <p>{currentChallenge?.description || 'Select a challenge to begin.'}</p>
          {challenges.length > 0 && (
            <select 
              value={currentChallenge?.id || ''} 
              onChange={(e) => selectChallenge(e.target.value)}
              disabled={isRunning || isLoading} 
            >
              <option value="" disabled>Select a Challenge</option>
              {challenges.map((challenge) => (
                <option key={challenge.id} value={challenge.id}>{challenge.title}</option>
              ))}
            </select>
          )}
        </div>
        <div className="editor-output-section">
          <div className="editor-area">
            <CodeEditor 
              value={userCode} 
              onChange={updateUserCode} 
            />
            <button onClick={runCode} disabled={isRunning || !currentChallenge}>
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
          <div className="output-area">
            <h3>Output:</h3>
            <pre>{output}</pre>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
