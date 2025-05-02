// src/core/domain/CodingChallenge.ts


export interface TestCase {
  input: any[];
  expectedOutput: any;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  testResults?: {
    passed: boolean;
    message: string;
    input: any[];
    expected: any;
    actual: any;
  }[];
}
