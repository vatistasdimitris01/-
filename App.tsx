import React, { useState, useEffect } from 'react';
import type { Row } from './types';
import { supabase } from './supabaseClient';
import { DataTable } from './components/DataTable';
import { FilterAndAddForm } from './components/FilterAndAddForm';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pallets')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      if (data) {
        setRows(data);
      }
    } catch (error) {
      console.error("Error fetching rows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleAddRow = async (newRowData: Omit<Row, 'id'>) => {
    try {
      const { error } = await supabase.from('pallets').insert([newRowData]);
      if (error) throw error;
      // Refetch to get the latest data including the new row with its generated ID
      fetchRows(); 
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };
  
  const handleDeleteRow = async (id: string, row: Row) => {
    try {
      const { error } = await supabase.from('pallets').delete().match({ id });
      if (error) throw error;
      setRows(currentRows => currentRows.filter(r => r.id !== id));
    } catch (error) {
       console.error("Error deleting row:", error);
    }
  }

  const handleUpdateRow = async (id: string, updatedData: Partial<Omit<Row, 'id'>>) => {
     try {
      const { data, error } = await supabase
        .from('pallets')
        .update(updatedData)
        .match({ id })
        .select();

      if (error) throw error;
      
      if(data) {
        setRows(currentRows =>
          currentRows.map(row => (row.id === id ? data[0] : row))
        );
      }
    } catch (error) {
      console.error("Error updating row:", error);
    }
  };

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
        <Header />
        <main className="max-w-lg mx-auto px-4 pb-12">
          <div className="py-6 space-y-6">
              <FilterAndAddForm 
                onAddRow={handleAddRow}
              />
              {loading ? (
                <div className="text-center py-16 px-4">
                  <p className="text-gray-500 dark:text-gray-400">Φόρτωση δεδομένων...</p>
                </div>
              ) : (
                <DataTable 
                    rows={rows} 
                    onDeleteRow={handleDeleteRow}
                    onUpdateRow={handleUpdateRow}
                />
              )}
          </div>
        </main>
      </div>
    </>
  );
};

export default App;