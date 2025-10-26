import React, { useState } from 'react';
import type { Row } from '../types';
import { SUPPLIERS, formatDate } from '../constants';

interface AddFormProps {
    onAddRow: (newRowData: Omit<Row, 'id'>) => void;
}

export const FilterAndAddForm: React.FC<AddFormProps> = ({ onAddRow }) => {
  const [supplier, setSupplier] = useState(SUPPLIERS[0]);
  const [pallets, setPallets] = useState<number | ''>('');

  const canSubmit = pallets !== '' && Number(pallets) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    onAddRow({ supplier, pallets: Number(pallets), date: formatDate(new Date()) });
    
    // Reset form but keep the selected supplier for easier multi-entry
    setPallets('');
  };

  const inputClass = "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-lg";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-3">
          <label htmlFor="supplier-name" className={labelClass}>Προμηθευτής</label>
          <select
            id="supplier-name"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className={inputClass}
          >
            {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-span-2">
            <label htmlFor="pallets" className={labelClass}>Παλέτες</label>
            <input
              type="number"
              id="pallets"
              value={pallets}
              onChange={(e) => setPallets(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              placeholder="0"
              min="1"
              className={`${inputClass} text-center`}
              required
            />
          </div>
      </div>
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Προσθήκη
      </button>
    </form>
  );
};