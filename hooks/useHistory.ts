import { useState, useCallback } from 'react';

export interface HistoryEntry<T> {
  state: T;
  description: string;
  id: number;
}

export const useHistory = <T,>(initialState: T) => {
  const [history, setHistory] = useState<HistoryEntry<T>[]>([
    { state: initialState, description: 'Αρχική κατάσταση', id: Date.now() }
  ]);
  const [index, setIndex] = useState(0);

  const state = history[index].state;

  const setState = useCallback((action: T | ((prevState: T) => T), description: string) => {
    const resolvedState = typeof action === 'function' 
      ? (action as (prevState: T) => T)(state) 
      : action;
    
    if (JSON.stringify(resolvedState) === JSON.stringify(state)) {
      return;
    }

    const newHistory = history.slice(0, index + 1);
    newHistory.push({ state: resolvedState, description, id: Date.now() });

    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  }, [history, index, state]);

  const revertToState = useCallback((revertIndex: number) => {
    if (revertIndex >= 0 && revertIndex < history.length) {
      const newHistory = history.slice(0, revertIndex + 1);
      setHistory(newHistory);
      setIndex(revertIndex);
    }
  }, [history]);
  
  const fullHistory = history;

  return {
    state,
    setState,
    revertToState,
    fullHistory,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
};