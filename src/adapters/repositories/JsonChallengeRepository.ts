// src/adapters/repositories/JsonChallengeRepository.ts
import { ChallengeRepository } from '../../core/ports/ChallengeRepository';
import { CodingChallenge } from '../../core/domain/CodingChallenge';
import basicChallenges from '../../data/coding_challenges.json';
import advancedChallenges from '../../data/advanced_coding_challenges.json';

export class JsonChallengeRepository implements ChallengeRepository {
  private challenges: CodingChallenge[];

  constructor() {
    // Combine basic and advanced challenges
    this.challenges = [
      ...basicChallenges as CodingChallenge[],
      ...advancedChallenges as CodingChallenge[]
    ];
  }

  async getAllChallenges(): Promise<CodingChallenge[]> {
    return this.challenges;
  }

  async getChallengeById(id: string): Promise<CodingChallenge | null> {
    const challenge = this.challenges.find(c => c.id === id);
    return challenge || null;
  }
}
