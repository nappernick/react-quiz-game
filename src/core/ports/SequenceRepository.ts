// src/core/ports/SequenceRepository.ts
/**
 * Port for accessing sequence games
 */
import { Sequence } from '../domain/Sequence';

export interface SequenceRepository {
  /**
   * Get all available sequences
   */
  getAllSequences(): Promise<Sequence[]>;
  
  /**
   * Get a specific sequence by ID
   */
  getSequenceById(id: string): Promise<Sequence | null>;
}
