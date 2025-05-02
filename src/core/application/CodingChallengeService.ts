// src/core/application/CodingChallengeService.ts
import { CodingChallenge, ExecutionResult } from '../domain/CodingChallenge';
import { ChallengeRepository } from '../ports/ChallengeRepository';
import { CodeExecutor } from '../ports/CodeExecutor';
export interface CodingChallengeState {
  challenges: CodingChallenge[];
  currentChallenge: CodingChallenge | null;
  userCode: string;
  output: string;
  isRunning: boolean;
  isLoading: boolean;
  error: string | null;
}


export interface CodingChallengePresenter {
  updateState(state: Partial<CodingChallengeState>): void;
}

export class CodingChallengeService {
  private state: CodingChallengeState;
  private presenter: CodingChallengePresenter;
  private repository: ChallengeRepository;
  private executor: CodeExecutor;

  constructor(
    presenter: CodingChallengePresenter,
    repository: ChallengeRepository,
    executor: CodeExecutor
  ) {
    this.presenter = presenter;
    this.repository = repository;
    this.executor = executor;
    this.state = {
      challenges: [],
      currentChallenge: null,
      userCode: '',
      output: '',
      isRunning: false,
      isLoading: true,
      error: null
    };
  }

  async initialize(): Promise<void> {
    try {
      this.updateState({ isLoading: true });
      const challenges = await this.repository.getAllChallenges();
      
      this.updateState({ 
        challenges,
        isLoading: false
      });

      if (challenges.length > 0) {
        await this.selectChallenge(challenges[0].id);
      }
    } catch (error) {
      this.updateState({ 
        error: `Failed to load challenges: ${error instanceof Error ? error.message : String(error)}`,
        isLoading: false
      });
    }
  }

  async selectChallenge(challengeId: string): Promise<void> {
    try {
      const challenge = await this.repository.getChallengeById(challengeId);
      
      if (challenge) {
        this.updateState({
          currentChallenge: challenge,
          userCode: challenge.starterCode,
          output: '',
          error: null
        });
      } else {
        this.updateState({
          error: `Challenge with ID ${challengeId} not found`
        });
      }
    } catch (error) {
      this.updateState({
        error: `Failed to select challenge: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }

  updateUserCode(code: string): void {
    this.updateState({ userCode: code });
  }

  async runCode(): Promise<void> {
    const { currentChallenge, userCode } = this.state;
    
    if (!currentChallenge) {
      this.updateState({
        output: 'Error: No challenge selected',
        error: 'No challenge selected'
      });
      return;
    }

    try {
      this.updateState({ 
        isRunning: true,
        output: 'Running tests...',
        error: null
      });

      const result = await this.executor.executeCode(userCode, currentChallenge.testCases);
      
      this.updateState({
        output: result.output,
        isRunning: false
      });
    } catch (error) {
      this.updateState({
        output: `Error: ${error instanceof Error ? error.message : String(error)}`,
        error: `Failed to run code: ${error instanceof Error ? error.message : String(error)}`,
        isRunning: false
      });
    }
  }

  getState(): CodingChallengeState {
    return { ...this.state };
  }

  private updateState(partialState: Partial<CodingChallengeState>): void {
    this.state = { ...this.state, ...partialState };
    this.presenter.updateState(partialState);
  }
}
