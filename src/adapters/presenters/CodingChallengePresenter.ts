// src/adapters/presenters/CodingChallengePresenter.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { CodingChallengePresenter, CodingChallengeState, CodingChallengeService } from '../../core/application/CodingChallengeService';
import { ChallengeRepository } from '../../core/ports/ChallengeRepository';
import { CodeExecutor } from '../../core/ports/CodeExecutor';
import { JsonChallengeRepository } from '../repositories/JsonChallengeRepository';
import { BrowserCodeExecutor } from '../services/BrowserCodeExecutor';
export interface CodingChallengeViewModel {
  state: CodingChallengeState;
  selectChallenge: (challengeId: string) => Promise<void>;
  updateUserCode: (code: string) => void;
  runCode: () => Promise<void>;
}

export function useCodingChallengePresenter(): CodingChallengeViewModel {
  const [state, setState] = useState<CodingChallengeState>({
    challenges: [],
    currentChallenge: null,
    userCode: '',
    output: '',
    isRunning: false,
    isLoading: true,
    error: null
  });

  const presenter: CodingChallengePresenter = {
    updateState(partialState: Partial<CodingChallengeState>) {
      setState(prevState => ({ ...prevState, ...partialState }));
    }
  };

  const repository: ChallengeRepository = new JsonChallengeRepository();
  const executor: CodeExecutor = new BrowserCodeExecutor();

  // Create a ref to hold the service instance
  const serviceRef = useRef<CodingChallengeService | null>(null);
  
  // Create the service once and store it in the ref
  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = new CodingChallengeService(presenter, repository, executor);
      serviceRef.current.initialize();
    }
  }, []);

  const selectChallenge = useCallback(async (challengeId: string) => {
    if (serviceRef.current) {
      await serviceRef.current.selectChallenge(challengeId);
    }
  }, []);

  const updateUserCode = useCallback((code: string) => {
    if (serviceRef.current) {
      serviceRef.current.updateUserCode(code);
    }
  }, []);

  const runCode = useCallback(async () => {
    if (serviceRef.current) {
      await serviceRef.current.runCode();
    }
  }, []);

  return {
    state,
    selectChallenge,
    updateUserCode,
    runCode
  };
}
