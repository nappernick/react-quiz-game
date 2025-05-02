// src/tests/codingChallenges.test.ts
import { describe, it, expect, beforeEach } from 'bun:test';
import { CodingChallenge } from '../core/domain/CodingChallenge';
import { CodingChallengeService, CodingChallengePresenter, CodingChallengeState } from '../core/application/CodingChallengeService';
import { ChallengeRepository } from '../core/ports/ChallengeRepository';
import { CodeExecutor } from '../core/ports/CodeExecutor';

declare global {
  var mockAdvancedChallenges: CodingChallenge[] | undefined;
}

const mockChallenges: CodingChallenge[] = [
  {
    id: 'test-challenge',
    title: 'Test Challenge',
    description: 'A simple test challenge',
    starterCode: 'function solve(a, b) {\n  return a + b;\n}',
    testCases: [
      { input: [1, 2], expectedOutput: 3 },
      { input: [5, -3], expectedOutput: 2 }
    ]
  }
];

beforeEach(() => {
  global.mockAdvancedChallenges = mockChallenges;
});

describe('Coding Challenge Tests', () => {
  it('has valid challenge structure', () => {
    const challenge = mockChallenges[0];
    expect(challenge.id).toBe('test-challenge');
    expect(challenge.title).toBe('Test Challenge');
    expect(challenge.description).toBe('A simple test challenge');
    expect(challenge.starterCode).toContain('function solve(a, b)');
  });

  it('has correct test cases', () => {
    const testCases = mockChallenges[0].testCases;
    expect(testCases.length).toBe(2);
    
    expect(testCases[0].input).toEqual([1, 2]);
    expect(testCases[0].expectedOutput).toBe(3);
    
    expect(testCases[1].input).toEqual([5, -3]);
    expect(testCases[1].expectedOutput).toBe(2);
  });
  
  it('can evaluate a correct solution', () => {
    const solution = new Function('return ' + mockChallenges[0].starterCode)();
    const testCases = mockChallenges[0].testCases;
    
    testCases.forEach(testCase => {
      const args = testCase.input as [number, number];
      const result = solution(args[0], args[1]);
      expect(result).toBe(testCase.expectedOutput);
    });
  });

  it('can detect an incorrect solution', () => {
    const incorrectSolution = function(a: number, b: number) {
      return a - b;
    };
    
    const testCases = mockChallenges[0].testCases;
    
    const someTestFails = testCases.some(testCase => {
      const args = testCase.input as [number, number];
      const result = incorrectSolution(args[0], args[1]);
      return result !== testCase.expectedOutput;
    });
    
    expect(someTestFails).toBe(true);
  });

  it('shows error when no challenge is selected', async () => {
    let capturedState: Partial<CodingChallengeState> = {};
    const mockPresenter: CodingChallengePresenter = {
      updateState(state: Partial<CodingChallengeState>) {
        capturedState = { ...capturedState, ...state };
      }
    };

    const mockRepository: ChallengeRepository = {
      getAllChallenges: async () => [],
      getChallengeById: async () => null
    };

    const mockExecutor: CodeExecutor = {
      executeCode: async () => ({ success: false, output: '', testResults: [] })
    };

    const service = new CodingChallengeService(mockPresenter, mockRepository, mockExecutor);
    
    await service.runCode();
    
    expect(capturedState.output).toBe('Error: No challenge selected');
    expect(capturedState.error).toBe('No challenge selected');
  });
});
