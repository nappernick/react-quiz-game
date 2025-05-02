// src/containers/SequenceGameContainer.tsx
import React from 'react';
import { useSequencePresenter } from '../adapters/presenters/SequencePresenter';
import '../styles/SequenceGame.css';


export default function SequenceGameContainer() {

  const viewModel = useSequencePresenter();
  const {
    state: {
      sequences,
      currentSequenceIndex,
      currentOrder,
      result,
      isLoading,
      error
    },
    selectSequence,
    reorderSteps,
    checkOrder,
    resetSequence,
    dragItem,
    dragOverItem
  } = viewModel;


  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };


  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };


  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      reorderSteps(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };


  if (isLoading) {
    return <div className="sequence-container">Loading sequences...</div>;
  }


  if (error) {
    return (
      <div className="sequence-container error">
        <p>Error: {error}</p>
        <button onClick={() => resetSequence()}>Try Again</button>
      </div>
    );
  }


  if (sequences.length === 0) {
    return <div className="sequence-container">No sequences available.</div>;
  }


  const currentSequence = sequences[currentSequenceIndex];

  return (
    <div className="sequence-container">
      <h2>{currentSequence.title}</h2>
      

      <div className="sequence-selector">
        <label htmlFor="sequence-select">Select Sequence:</label>
        <select
          id="sequence-select"
          value={currentSequenceIndex}
          onChange={(e) => selectSequence(Number(e.target.value))}
        >
          {sequences.map((seq, index) => (
            <option key={seq.id} value={index}>
              {seq.title}
            </option>
          ))}
        </select>
      </div>


      <div className="sequence-steps">
        {currentOrder.map((step, index) => {
          const isCorrectPosition = result ? 
            currentSequence.steps
              .sort((a, b) => a.order - b.order)
              .map(s => s.text)[index] === step :
            false;
            
          return (
            <div
              key={index}
              className={`sequence-step ${result ? (isCorrectPosition ? 'correct' : 'incorrect') : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              {step}
            </div>
          );
        })}
      </div>


      <div className="sequence-controls">
        <button onClick={checkOrder} disabled={result !== null}>
          Check Order
        </button>
        <button onClick={resetSequence}>
          Reset
        </button>
      </div>


      {result && (
        <div className="sequence-result">
          <p>
            {result.isCorrect
              ? 'Correct! All steps are in the right order.'
              : 'Some steps are in the wrong order. Try again!'}
          </p>
          <p>Score: {result.score}</p>
        </div>
      )}
    </div>
  );
}
