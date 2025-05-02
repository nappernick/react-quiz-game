// src/core/ports/ChallengeRepository.ts

import { CodingChallenge } from '../domain/CodingChallenge';

export interface ChallengeRepository {

  getAllChallenges(): Promise<CodingChallenge[]>;
  

  getChallengeById(id: string): Promise<CodingChallenge | null>;
}
