// src/adapters/presenters/SequencePresenter.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { SequencePresenter, SequenceState, SequenceService } from '../../core/application/SequenceService';
import { SequenceRepository } from '../../core/ports/SequenceRepository';
import { JsonSequenceRepository } from '../repositories/JsonSequenceRepository';


export interface SequenceViewModel {
  state: SequenceState;
  selectSequence: (index: number) => void;
  reorderSteps: (fromIndex: number, toIndex: number) => void;
  checkOrder: () => void;
  resetSequence: () => void;
  dragItem: React.MutableRefObject<number | null>;
  dragOverItem: React.MutableRefObject<number | null>;
}


export function useSequencePresenter(): SequenceViewModel {

  const [state, setState] = useState<SequenceState>({
    sequences: [],
    currentSequenceIndex: 0,
    currentOrder: [],
    result: null,
    isLoading: true,
    error: null
  });


  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);


  const presenter: SequencePresenter = {
    updateState(partialState: Partial<SequenceState>) {
      setState(prevState => ({ ...prevState, ...partialState }));
    }
  };


  const repository: SequenceRepository = new JsonSequenceRepository();


  const serviceRef = useCallback(() => {
    return new SequenceService(presenter, repository);
  }, []);


  const selectSequence = useCallback((index: number) => {
    const service = serviceRef();
    service.selectSequence(index);
  }, [serviceRef]);

  const reorderSteps = useCallback((fromIndex: number, toIndex: number) => {
    const service = serviceRef();
    service.reorderSteps(fromIndex, toIndex);
  }, [serviceRef]);

  const checkOrder = useCallback(() => {
    const service = serviceRef();
    service.checkOrder();
  }, [serviceRef]);

  const resetSequence = useCallback(() => {
    const service = serviceRef();
    service.resetSequence();
  }, [serviceRef]);


  useEffect(() => {
    const service = serviceRef();
    service.initialize();
  }, [serviceRef]);


  return {
    state,
    selectSequence,
    reorderSteps,
    checkOrder,
    resetSequence,
    dragItem,
    dragOverItem
  };
}
