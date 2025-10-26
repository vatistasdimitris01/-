import React from 'react';
import type { Row } from '../types';
import type { HistoryEntry } from '../hooks/useHistory';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryEntry<Row[]>[];
    onRevert: (index: number) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onRevert }) => {
    if (!isOpen) return null;

    // We don't show the initial state and we want the latest actions on top
    const actions = history.slice(1).reverse();
    const currentHistoryIndex = history.length - 1;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center" onClick={onClose}>
            <div 
                className="w-full max-w-lg bg-slate-100 dark:bg-gray-900 rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col animate-slide-in-up" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-slate-100 dark:bg-gray-900 rounded-t-2xl">
                    <h2 className="text-lg font-bold">Ιστορικό Ενεργειών</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                <div className="overflow-y-auto p-4">
                    <ul className="space-y-3">
                       {actions.map((entry, index) => {
                          const historyIndex = currentHistoryIndex - index - 1;
                          return (
                            <li key={entry.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{entry.description}</span>
                                <button
                                    onClick={() => onRevert(historyIndex)}
                                    className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                                >
                                    Αναίρεση
                                </button>
                            </li>
                          )
                       })}
                       {actions.length === 0 && (
                            <p className="text-center text-gray-500 py-8">Δεν υπάρχουν πρόσφατες ενέργειες.</p>
                       )}
                    </ul>
                </div>
            </div>
        </div>
    );
};