// src/core/application/SequenceService.ts

import { Sequence, SequenceResult } from '../domain/Sequence';
import { SequenceRepository } from '../ports/SequenceRepository';


export interface SequenceState {
  sequences: Sequence[];
  currentSequenceIndex: number;
  currentOrder: string[];
  result: SequenceResult | null;
  isLoading: boolean;
  error: string | null;
}


export interface SequencePresenter {
  updateState(state: Partial<SequenceState>): void;
}

export class SequenceService {
  private state: SequenceState;
  private presenter: SequencePresenter;
  private repository: SequenceRepository;

  constructor(
    presenter: SequencePresenter,
    repository: SequenceRepository
  ) {
    this.presenter = presenter;
    this.repository = repository;
    this.state = {
      sequences: [],
      currentSequenceIndex: 0,
      currentOrder: [],
      result: null,
      isLoading: true,
      error: null
    };
  }


  async initialize(): Promise<void> {
    try {
      this.updateState({ isLoading: true });
      const sequences = await this.repository.getAllSequences();
      
      if (sequences.length > 0) {
        // Initialize with the first sequence
        const shuffledSteps = this.shuffle(sequences[0].steps.map(step => step.text));
        
        this.updateState({
          sequences,
          currentSequenceIndex: 0,
          currentOrder: shuffledSteps,
          result: null,
          isLoading: false,
          error: null
        });
      } else {
        this.updateState({
          sequences: [],
          isLoading: false,
          error: 'No sequences available'
        });
      }
    } catch (error) {
      this.updateState({
        error: `Failed to load sequences: ${error instanceof Error ? error.message : String(error)}`,
        isLoading: false
      });
    }
  }


  selectSequence(index: number): void {
    if (index < 0 || index >= this.state.sequences.length) {
      this.updateState({
        error: `Invalid sequence index: ${index}`
      });
      return;
    }

    const sequence = this.state.sequences[index];
    const shuffledSteps = this.shuffle(sequence.steps.map(step => step.text));
    
    this.updateState({
      currentSequenceIndex: index,
      currentOrder: shuffledSteps,
      result: null,
      error: null
    });
  }


  reorderSteps(fromIndex: number, toIndex: number): void {
    const newOrder = [...this.state.currentOrder];
    const temp = newOrder[fromIndex];
    newOrder[fromIndex] = newOrder[toIndex];
    newOrder[toIndex] = temp;
    
    this.updateState({
      currentOrder: newOrder,
      result: null
    });
  }


  checkOrder(): void {
    const { sequences, currentSequenceIndex, currentOrder } = this.state;
    const currentSequence = sequences[currentSequenceIndex];
    
    // Get the correct order of steps
    const correctOrder = currentSequence.steps
      .sort((a, b) => a.order - b.order)
      .map(step => step.text);
    
    // Compare each step with the correct order
    const stepResults = currentOrder.map((step, index) => step === correctOrder[index]);
    const isCorrect = stepResults.every(Boolean);
    
    // Create a proper SequenceResult domain object
    const result: SequenceResult = {
      sequenceId: currentSequence.id,
      orderedSteps: currentOrder,
      isCorrect: isCorrect,
      score: isCorrect ? 100 : Math.floor((stepResults.filter(Boolean).length / stepResults.length) * 100)
    };
    
    this.updateState({ result });
  }


  resetSequence(): void {
    const { sequences, currentSequenceIndex } = this.state;
    const currentSequence = sequences[currentSequenceIndex];
    const shuffledSteps = this.shuffle(currentSequence.steps.map(step => step.text));
    
    this.updateState({
      currentOrder: shuffledSteps,
      result: null
    });
  }


  getState(): SequenceState {
    return { ...this.state };
  }


  private updateState(partialState: Partial<SequenceState>): void {
    this.state = { ...this.state, ...partialState };
    this.presenter.updateState(partialState);
  }


  private shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
