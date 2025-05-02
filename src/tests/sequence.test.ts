// src/tests/sequence.test.ts
import { describe, it, expect, beforeEach } from 'bun:test';
import { Sequence, SequenceStep, SequenceResult } from '../core/domain/Sequence';
import { SequenceService, SequencePresenter, SequenceState } from '../core/application/SequenceService';

// Mock presenter implementation for testing
class MockSequencePresenter implements SequencePresenter {
  public state: Partial<SequenceState> = {};
  
  updateState(partialState: Partial<SequenceState>): void {
    this.state = { ...this.state, ...partialState };
  }
}

// Mock repository implementation that returns predefined sequences
class MockSequenceRepository {
  private sequences: Sequence[] = [];
  
  constructor(sequences: Sequence[]) {
    this.sequences = sequences;
  }
  
  async getAllSequences() {
    return this.sequences;
  }
  
  async getSequenceById(id: string) {
    return this.sequences.find(seq => seq.id === id) || null;
  }
}

// Test data: mock sequences with known correct order
const mockSequences: Sequence[] = [
  {
    id: 'seq1',
    title: 'JavaScript Event Loop',
    description: 'Order the steps of the JavaScript event loop',
    steps: [
      { id: 's1', text: 'Call Stack Execution', order: 0 },
      { id: 's2', text: 'Microtask Queue Processing', order: 1 },
      { id: 's3', text: 'Render Queue', order: 2 },
      { id: 's4', text: 'Macrotask Queue Processing', order: 3 }
    ]
  },
  {
    id: 'seq2',
    title: 'React Component Lifecycle',
    description: 'Order the lifecycle methods of a React component',
    steps: [
      { id: 's1', text: 'Constructor', order: 0 },
      { id: 's2', text: 'Render', order: 1 },
      { id: 's3', text: 'ComponentDidMount', order: 2 },
      { id: 's4', text: 'ComponentDidUpdate', order: 3 },
      { id: 's5', text: 'ComponentWillUnmount', order: 4 }
    ]
  }
];

describe('Sequence Service Tests', () => {
  let presenter: MockSequencePresenter;
  let repository: MockSequenceRepository;
  let service: SequenceService;
  
  beforeEach(() => {
    presenter = new MockSequencePresenter();
    repository = new MockSequenceRepository(mockSequences);
    service = new SequenceService(presenter, repository);
    
    // Add a test-only method to set the current order directly for testing
    // This allows us to test specific sequence orders without relying on the shuffle method
    (service as any).testSetCurrentOrder = function(order: string[]) {
      this.state.currentOrder = order;
    };
  });
  
  it('initializes with correct default state', () => {
    const state = service.getState();
    expect(state.sequences).toEqual([]);
    expect(state.currentSequenceIndex).toBe(0);
    expect(state.currentOrder).toEqual([]);
    expect(state.result).toBe(null);
    expect(state.isLoading).toBe(true);
  });
  
  it('loads sequences on initialize', async () => {
    await service.initialize();
    const state = service.getState();
    
    expect(state.sequences.length).toBe(2);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.currentOrder.length).toBe(4); // First sequence has 4 steps
  });
  
  it('selects a sequence correctly', async () => {
    await service.initialize();
    service.selectSequence(1); // Select the second sequence
    
    const state = service.getState();
    expect(state.currentSequenceIndex).toBe(1);
    expect(state.currentOrder.length).toBe(5); // Second sequence has 5 steps
  });
  
  it('reorders steps correctly', async () => {
    await service.initialize();
    
    const initialOrder = [...service.getState().currentOrder];
    
    service.reorderSteps(0, 1);
    
    const newOrder = service.getState().currentOrder;
    expect(newOrder[0]).toBe(initialOrder[1]);
    expect(newOrder[1]).toBe(initialOrder[0]);
  });
  
  it('checks correct order and creates proper result', async () => {
    await service.initialize();
    
    const state = service.getState();
    const currentSequence = state.sequences[state.currentSequenceIndex];
    
    const correctOrder = currentSequence.steps
      .sort((a, b) => a.order - b.order)
      .map(step => step.text);
    
    // We need to manually set up the state for testing
    // Instead of directly using updateState, we'll use a workaround
    // by exposing a test-only method in our mock class
    (service as any).testSetCurrentOrder(correctOrder);
    
    service.checkOrder();
    
    const result = service.getState().result;
    expect(result).not.toBe(null);
    expect(result?.isCorrect).toBe(true);
    expect(result?.sequenceId).toBe(currentSequence.id);
    expect(result?.score).toBe(100);
  });
  
  it('checks incorrect order and creates proper result', async () => {
    await service.initialize();
    
    const state = service.getState();
    const currentSequence = state.sequences[state.currentSequenceIndex];
    
    const correctOrder = currentSequence.steps
      .sort((a, b) => a.order - b.order)
      .map(step => step.text);
    const incorrectOrder = [...correctOrder].reverse();
    
    // We need to manually set up the state for testing
    // Instead of directly using updateState, we'll use a workaround
    // by exposing a test-only method in our mock class
    (service as any).testSetCurrentOrder(incorrectOrder);
    
    service.checkOrder();
    
    const result = service.getState().result;
    expect(result).not.toBe(null);
    expect(result?.isCorrect).toBe(false);
    expect(result?.sequenceId).toBe(currentSequence.id);
    expect(result?.score).toBeLessThan(100);
  });
  
  it('resets sequence correctly', async () => {
    await service.initialize();
    service.checkOrder();
    expect(service.getState().result).not.toBe(null);
    service.resetSequence();
    const state = service.getState();
    expect(state.result).toBe(null);
    expect(state.currentOrder.length).toBe(4); // First sequence has 4 steps
  });
});
