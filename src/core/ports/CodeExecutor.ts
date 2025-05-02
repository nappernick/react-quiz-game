// src/core/ports/CodeExecutor.ts

import { TestCase, ExecutionResult } from '../domain/CodingChallenge';

export interface CodeExecutor {

  executeCode(code: string, testCases: TestCase[]): Promise<ExecutionResult>;
}
