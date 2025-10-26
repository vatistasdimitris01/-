import React, { useState } from 'react';
import type { Row } from './types';
import { INITIAL_ROWS } from './constants';
import { useHistory } from './hooks/useHistory';
import { DataTable } from './components/DataTable';
import { FilterAndAddForm } from './components/FilterAndAddForm';
import { Header } from './components/Header';
import { HistoryModal } from './components/HistoryModal';

const App: React.FC = () => {
  const { state: rows, setState: setRows, revertToState, fullHistory } = useHistory<Row[]>(INITIAL_ROWS);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleAddRow = (newRowData: Omit<Row, 'id'>) => {
    const newRow: Row = {
      id: `row-${Date.now()}`,
      ...newRowData
    };
    const description = `Προσθήκη: ${newRow.pallets} παλέτες για ${newRow.supplier}`;
    setRows(currentRows => [newRow, ...currentRows], description);
  };
  
  const handleDeleteRow = (id: string, row: Row) => {
    const description = `Διαγραφή: ${row.pallets} παλέτες από ${row.supplier}`;
    setRows(currentRows => currentRows.filter(r => r.id !== id), description);
  }

  const handleUpdateRow = (id: string, updatedData: Partial<Omit<Row, 'id'>>) => {
    let description = "Ενημέρωση εγγραφής";
    setRows(currentRows =>
      currentRows.map(row => {
        if (row.id === id) {
          description = `Αλλαγή παλετών για ${row.supplier} από ${row.pallets} σε ${updatedData.pallets}`;
          return { ...row, ...updatedData };
        }
        return row;
      }),
      description
    );
  };

  const handleRevert = (index: number) => {
    revertToState(index);
    setIsHistoryOpen(false);
  }

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      <div className="min-h-screen bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header onOpenHistory={() => setIsHistoryOpen(true)} />
        <main className="max-w-lg mx-auto px-4 pb-12">
          <div className="py-6 space-y-6">
              <FilterAndAddForm 
                onAddRow={handleAddRow}
              />
              <DataTable 
                  rows={rows} 
                  onDeleteRow={handleDeleteRow}
                  onUpdateRow={handleUpdateRow}
              />
          </div>
        </main>
        <HistoryModal 
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={fullHistory}
          onRevert={handleRevert}
        />
      </div>
    </>
  );
};

export default App;