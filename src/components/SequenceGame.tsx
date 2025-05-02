// src/components/SequenceGame.tsx
import React, { useState, useRef, useEffect } from 'react';
import sequences from '../data/sequences.json';
import '../styles/SequenceGame.css';

export default function SequenceGame() {
  type SeqDef = { id: string; title: string; steps: string[] };

  const [seqIndex, setSeqIndex] = useState(0);
  const shuffle = (arr: string[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const currentSteps = (sequences as SeqDef[])[seqIndex].steps;
  const [order, setOrder] = useState<string[]>(() => shuffle(currentSteps));
  const [result, setResult] = useState<boolean[] | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    setOrder(shuffle(currentSteps));
    setResult(null);
  }, [seqIndex, currentSteps]);

  const handleDragStart = (i: number) => (dragItem.current = i);
  const handleDragEnter = (i: number) => (dragOverItem.current = i);
  const handleDragEnd = () => {
    const from = dragItem.current, to = dragOverItem.current;
    if (from == null || to == null) return;
    const updated = [...order];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setOrder(updated);
    dragItem.current = dragOverItem.current = null;
  };

  const checkOrder = () => {
    setResult(order.map((step, i) => step === currentSteps[i]));
  };
  const reset = () => {
    setOrder(shuffle(currentSteps));
    setResult(null);
  };

  return (
    <div className="sequence-container">
      <div className="sequence-selector">
        <label>
          Pick sequence:
          <select
            value={seqIndex}
            onChange={e => setSeqIndex(Number(e.target.value))}
          >
            {(sequences as SeqDef[]).map((s, i) => (
              <option key={s.id} value={i}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="sequence-list">
        {order.map((step, idx) => (
          <li
            key={`${step}-${idx}`}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragEnter={() => handleDragEnter(idx)}
            onDragEnd={handleDragEnd}
            className={`sequence-item ${
              result ? (result[idx] ? 'correct' : 'incorrect') : ''
            }`}
          >
            {step}
          </li>
        ))}
      </ul>

      <div className="sequence-buttons">
        <button onClick={checkOrder}>Check Order</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}