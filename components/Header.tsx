import React from 'react';

// --- Header Component ---
export const Header: React.FC = () => {
  return (
    <header className="py-4 sticky top-0 bg-slate-100/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-gray-800 -mx-4 px-4">
        <div className="flex justify-between items-center max-w-lg mx-auto">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 0v10l8 4m0-14L4 7"></path></svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Παλέτες
                </h1>
            </div>
        </div>
    </header>
  );
};