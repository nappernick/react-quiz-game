// src/core/domain/Sequence.ts
/**
 * Core domain model for sequence games
 */

export interface SequenceStep {
  id: string;
  text: string;
  order: number;
}

export interface Sequence {
  id: string;
  title: string;
  description?: string;
  steps: SequenceStep[];
}

export interface SequenceResult {
  sequenceId: string;
  orderedSteps: string[];
  isCorrect: boolean;
  score: number;
}
