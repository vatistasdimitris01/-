import React, { useState, useRef, useEffect } from 'react';
import type { Row } from '../types';

// --- Helper for inline editing ---
const EditableCell: React.FC<{ value: string | number, onSave: (newValue: string | number) => void, inputType?: 'text' | 'number' }> = ({ value, onSave, inputType = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (currentValue !== value) {
      if (inputType === 'number') {
        const numValue = parseInt(String(currentValue), 10);
        if (!isNaN(numValue) && numValue >= 0) {
            onSave(numValue);
        } else {
            setCurrentValue(value); // Reset if invalid
        }
      } else {
        onSave(String(currentValue).trim());
      }
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);
  
  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={inputType}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        className="w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-1 m-0 border-indigo-500 rounded-md focus:ring-1 focus:ring-indigo-500"
      />
    );
  }

  return (
    <div onClick={() => setIsEditing(true)} className="min-h-[24px] w-full cursor-pointer rounded-md -m-1 p-1 text-center hover:bg-gray-100 dark:hover:bg-gray-700">
      {value}
    </div>
  );
};


// --- DataCard Component ---
interface DataCardProps {
  row: Row;
  onUpdateRow: (id: string, updatedData: Partial<Omit<Row, 'id'>>) => void;
  onDeleteRow: (id:string, row: Row) => void;
  isOnline: boolean;
}

const displayDate = (dateStr: string) => {
    if (!dateStr || typeof dateStr !== 'string') return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
};

const DataCard: React.FC<DataCardProps> = ({ row, onUpdateRow, onDeleteRow, isOnline }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between space-x-4 transition-all duration-300 ease-in-out">
        <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-gray-800 dark:text-gray-100 truncate">{row.supplier}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{displayDate(row.date)}</p>
        </div>
        <div className="w-16 flex-shrink-0 text-center">
            {isOnline ? (
                <EditableCell value={row.pallets} onSave={(newVal) => onUpdateRow(row.id, { pallets: Number(newVal) })} inputType="number" />
            ) : (
                <span className="p-1">{row.pallets}</span>
            )}
        </div>
        <button 
            onClick={() => onDeleteRow(row.id, row)} 
            disabled={!isOnline}
            className="flex-shrink-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full transition-colors disabled:text-gray-500 dark:disabled:text-gray-600 disabled:cursor-not-allowed" 
            aria-label={`Διαγραφή εγγραφής για ${row.supplier}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        </button>
    </div>
  );
}

const formatDateGroup = (dateStr: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const date = new Date(`${dateStr}T00:00:00`);
    
    if (date.toDateString() === today.toDateString()) {
        return "Σήμερα";
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return "Χθες";
    }

    return new Intl.DateTimeFormat('el-GR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(date);
};


// --- DataTable (now DataList) Component ---
interface DataTableProps {
    rows: Row[];
    onUpdateRow: (id: string, updatedData: Partial<Omit<Row, 'id'>>) => void;
    onDeleteRow: (id:string, row: Row) => void;
    isOnline: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ rows, onUpdateRow, onDeleteRow, isOnline }) => {
    const groupedRows = rows.reduce((acc, row) => {
        (acc[row.date] = acc[row.date] || []).push(row);
        return acc;
    }, {} as Record<string, Row[]>);

    const sortedDates = Object.keys(groupedRows).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const grandTotal = rows.reduce((sum, row) => sum + row.pallets, 0);

  return (
    <div className="space-y-6">
       {rows.length > 0 && (
         <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
           <div className="flex justify-between items-center">
             <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Σύνολο</span>
             <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{grandTotal} παλέτες</span>
           </div>
         </div>
       )}

      {rows.length > 0 ? (
        sortedDates.map(date => {
            const dailyTotal = groupedRows[date].reduce((sum, row) => sum + row. pallets, 0);
            return (
                <div key={date} className="animate-fade-in">
                    <div className="flex justify-between items-baseline px-1 mb-2">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                            {formatDateGroup(date)}
                        </h3>
                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                            Σύνολο: {dailyTotal}
                        </p>
                    </div>
                    <div className="space-y-3">
                        {groupedRows[date].map(row => (
                            <DataCard
                                key={row.id}
                                row={row}
                                onUpdateRow={onUpdateRow}
                                onDeleteRow={onDeleteRow}
                                isOnline={isOnline}
                            />
                        ))}
                    </div>
                </div>
            )
        })
      ) : (
        <div className="text-center py-16 px-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Δεν υπάρχουν εγγραφές</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Ξεκινήστε προσθέτοντας μια νέα εγγραφή παλέτας.</p>
        </div>
      )}
    </div>
  );
};