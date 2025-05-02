// src/adapters/services/BrowserCodeExecutor.ts
import { CodeExecutor } from '../../core/ports/CodeExecutor';
import { TestCase, ExecutionResult } from '../../core/domain/CodingChallenge';

export class BrowserCodeExecutor implements CodeExecutor {
  async executeCode(code: string, testCases: TestCase[]): Promise<ExecutionResult> {
    const testResults = [];
    let success = true;
    let output = '';

    try {
      const userFunction = new Function('return ' + code)();
      
      for (const testCase of testCases) {
        try {
          const args = testCase.input as any[];
          const result = userFunction(...args);
          
          const passed = this.deepEquals(result, testCase.expectedOutput);
          
          testResults.push({
            passed,
            message: passed ? 'Test passed' : 'Test failed',
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: result
          });
          
          if (!passed) success = false;
          
          output += `Test with input ${JSON.stringify(testCase.input)}: ${passed ? 'PASSED' : 'FAILED'}\n`;
          output += `Expected: ${JSON.stringify(testCase.expectedOutput)}\n`;
          output += `Actual: ${JSON.stringify(result)}\n\n`;
          
        } catch (error) {
          testResults.push({
            passed: false,
            message: `Error: ${error instanceof Error ? error.message : String(error)}`,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: null
          });
          
          success = false;
          output += `Error running test with input ${JSON.stringify(testCase.input)}: ${error instanceof Error ? error.message : String(error)}\n\n`;
        }
      }
      
      const passedCount = testResults.filter(r => r.passed).length;
      output += `Summary: ${passedCount}/${testCases.length} tests passed.\n`;
      
    } catch (error) {
      success = false;
      output = `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
    
    return {
      success,
      output,
      testResults
    };
  }
  
  private deepEquals(a: any, b: any): boolean {
    if (a === b) return true;
    
    if (a === null || b === null) return false;
    if (typeof a !== 'object' || typeof b !== 'object') return false;
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!this.deepEquals(a[key], b[key])) return false;
    }
    
    return true;
  }
}
