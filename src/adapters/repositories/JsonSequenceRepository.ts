// src/adapters/repositories/JsonSequenceRepository.ts
import { SequenceRepository } from '../../core/ports/SequenceRepository';
import { Sequence, SequenceStep } from '../../core/domain/Sequence';
import sequencesData from '../../data/sequences.json';


type RawSequence = {
  id: string;
  title: string;
  steps: string[];
};

export class JsonSequenceRepository implements SequenceRepository {
  private sequences: Sequence[];

  constructor() {

    this.sequences = (sequencesData as RawSequence[]).map(rawSeq => ({
      id: rawSeq.id,
      title: rawSeq.title,
      steps: rawSeq.steps.map((step, index) => ({
        id: `${rawSeq.id}-step-${index}`,
        text: step,
        order: index
      }))
    }));
  }

  async getAllSequences(): Promise<Sequence[]> {
    return this.sequences;
  }

  async getSequenceById(id: string): Promise<Sequence | null> {
    const sequence = this.sequences.find(seq => seq.id === id);
    return sequence || null;
  }
}
