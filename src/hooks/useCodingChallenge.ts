// src/hooks/useCodingChallenge.ts
import { useState, useEffect, useCallback } from 'react';
import { CodingChallenge, TestCase } from '../core/domain/CodingChallenge';
import { CodingChallengeState, CodingChallengeActions } from '../core/domain/UI';
import advancedChallenges from '../data/advanced_coding_challenges.json';

const getInitialChallenges = (): CodingChallenge[] => {
    const basicChallenges: CodingChallenge[] = [
        {
            id: 'basic-1',
            title: 'Sum Two Numbers',
            description: 'Write a function `solve(a, b)` that returns the sum of two numbers `a` and `b`.',
            starterCode: 'function solve(a, b) {\n  // Your code here\n  return 0; \n}',
            testCases: [
                { input: [1, 2], expectedOutput: 3 },
                { input: [5, -3], expectedOutput: 2 },
                { input: [0, 0], expectedOutput: 0 },
            ],
        },
        {
            id: 'basic-2',
            title: 'Implement Custom Hook: useToggle',
            description: 'Implement a custom React hook named `useToggle` that takes an initial boolean state and returns an array containing the current state and a function to toggle it. The `solve` function should *return* the hook itself.',
            starterCode: `import { useState } from 'react';\n\nfunction solve(initialValue) {\n  // Define the useToggle hook here\n  const useToggle = (initialState = false) => {\n    // Your hook logic here\n    const [state, setState] = useState(initialState);\n    const toggle = () => setState(!state);\n    return [state, toggle];\n  };\n  return useToggle; // Return the hook function\n}`, 
            testCases: [
                { input: [true], expectedOutput: 'hookStructure' }, // Placeholder test - wrap boolean in array
            ],
        }
    ];
    
    // @ts-ignore
    const mockChallenges = typeof global !== 'undefined' && global.mockAdvancedChallenges;
    
    if (mockChallenges) {
        return [...basicChallenges, ...mockChallenges];
    } else {
        return [...basicChallenges, ...advancedChallenges as CodingChallenge[]];
    }
};

export function useCodingChallenge(): [CodingChallengeState, CodingChallengeActions] {
  const [challenges, setChallenges] = useState<CodingChallenge[]>([]);
  const [currentChallengeId, setCurrentChallengeId] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    const initialChallenges = getInitialChallenges();
    setChallenges(initialChallenges);
    if (initialChallenges.length > 0 && !currentChallengeId) {
      const firstChallengeId = initialChallenges[0].id;
      setCurrentChallengeId(firstChallengeId);
    
      const firstChallenge = initialChallenges.find(c => c.id === firstChallengeId);
      if (firstChallenge) {
          setUserCode(firstChallenge.starterCode);
      } else {
          setUserCode('');
      }
    }
  }, [currentChallengeId]); // Re-run if currentChallengeId is reset externally


  useEffect(() => {
    const currentChallenge = challenges.find(c => c.id === currentChallengeId);
    if (currentChallenge) {
      setUserCode(currentChallenge.starterCode);
      setOutput('');
    } else if (!currentChallengeId && challenges.length > 0) {

        setCurrentChallengeId(challenges[0].id);
    } else {

        setUserCode('');
    }
  }, [currentChallengeId, challenges]);


  const handleRunCode = useCallback(() => {
    setOutput('');
    setIsRunning(true);
    setOutput('Running code...');

    // Basic security and execution environment setup
    const capturedLogs: any[] = [];
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
        capturedLogs.push(args.map(arg => String(arg)).join(' '));
        originalConsoleLog.apply(console, args);
    };

    setTimeout(() => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(`(function() { ${userCode}; return solve; })()`);
            

            const currentChallenge = challenges.find(c => c.id === currentChallengeId);
            let testResults = 'No tests defined or challenge not found.';

            if (currentChallenge && typeof result === 'function') {
                testResults = currentChallenge.testCases.map((testCase: TestCase, index: number) => {
                    try {

                        if (testCase.expectedOutput === 'reactComponent' || testCase.expectedOutput === 'hookStructure' || testCase.expectedOutput === 'reactHook') {
                            const output = result(...testCase.input);
                            const isFunction = typeof output === 'function';
                            return `Test ${index + 1}: ${isFunction ? '✅ Passed' : `❌ Failed (Expected a function, Got: ${typeof output})`}`;
                        } else {
                            const actualOutput = result(...testCase.input);
                            const passed = JSON.stringify(actualOutput) === JSON.stringify(testCase.expectedOutput);
                            return `Test ${index + 1}: ${passed ? '✅ Passed' : `❌ Failed (Expected: ${JSON.stringify(testCase.expectedOutput)}, Got: ${JSON.stringify(actualOutput)})`}`; 
                        }
                    } catch (testError: any) {
                        return `Test ${index + 1}: 💥 Error during test execution - ${testError.message}`;
                    }
                }).join('\n');
            } else if (typeof result !== 'function') {
                testResults = 'Execution Error: The code did not define or return a function named `solve`.';
            } else if (!currentChallenge) {
                testResults = 'Could not find the current challenge to run tests.'
            }


            const finalOutput = `Console Logs:\n${capturedLogs.join('\n') || '(No logs)'}\n\nTest Results:\n${testResults}`;
            setOutput(finalOutput);

        } catch (error: any) {
            setOutput(`Execution Error: ${error.message}`);
        } finally {
            console.log = originalConsoleLog;
            setIsRunning(false);
        }
    }, 100);
  }, [userCode, currentChallengeId, challenges]);


  const currentChallenge = challenges.find(c => c.id === currentChallengeId) || null;


  const state: CodingChallengeState = {
    challenges,
    currentChallengeIndex: challenges.findIndex(c => c.id === currentChallengeId) || 0,
    currentChallenge,
    userCode,
    output,
    isRunning,
    isExecuting: isRunning,
    isCorrect: null
  };

  const actions: CodingChallengeActions = {
    updateCode: setUserCode,
    executeCode: handleRunCode,
    nextChallenge: () => {
      const currentIndex = challenges.findIndex(c => c.id === currentChallengeId);
      if (currentIndex < challenges.length - 1) {
        setCurrentChallengeId(challenges[currentIndex + 1].id);
      }
    },
    previousChallenge: () => {
      const currentIndex = challenges.findIndex(c => c.id === currentChallengeId);
      if (currentIndex > 0) {
        setCurrentChallengeId(challenges[currentIndex - 1].id);
      }
    },
    setUserCode,
    handleRunCode,
    setCurrentChallengeById: setCurrentChallengeId
  };

  return [state, actions];
}
