// src/components/QuestionCard.tsx
import React from 'react';
import { QuizQuestion, QuizOption } from '../core/domain/Quiz';
import { QuestionCardProps } from '../core/domain/UI';
import '../styles/QuestionCard.css';

/**
 * Component for displaying a quiz question with selectable options
 * Uses the QuizQuestion and QuizOption domain models directly
 */
export default function QuestionCard({ question, selectedAnswer, onSelect, disabled = false }: QuestionCardProps) {
  return (
    <div className="question-card">
      <h2>{question.questionText}</h2>
      <ul>
        {question.options.map((option: QuizOption) => (
          <li
            key={option.id}
            className={selectedAnswer === option.id ? 'selected' : ''}
            onClick={() => !disabled && onSelect(option.id)}
          >
            <label>
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={selectedAnswer === option.id}
                onChange={() => !disabled && onSelect(option.id)}
                disabled={disabled}
              />
              {option.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}