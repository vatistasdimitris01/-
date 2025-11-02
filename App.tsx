import React, { useState, useEffect, useCallback } from 'react';
import type { Row } from './types';
import { supabase } from './supabaseClient';
import { DataTable } from './components/DataTable';
import { FilterAndAddForm } from './components/FilterAndAddForm';
import { Header } from './components/Header';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);


  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPromptEvent) {
      return;
    }
    installPromptEvent.prompt();
    installPromptEvent.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setInstallPromptEvent(null);
    });
  };
  
  const fetchRows = useCallback(async () => {
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
      // Don't log errors if offline, as it's expected
      if (navigator.onLine) {
        console.error("Error fetching rows:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      fetchRows(); // Refetch data when coming online
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchRows]);

  const handleAddRow = async (newRowData: Omit<Row, 'id'>) => {
    try {
      const { error } = await supabase.from('pallets').insert([newRowData]);
      if (error) throw error;
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
        <Header 
          isInstallable={!!installPromptEvent}
          onInstallClick={handleInstallClick}
        />
        <main className="max-w-lg mx-auto px-4 pb-24">
          <div className="py-6 space-y-6">
              <FilterAndAddForm 
                onAddRow={handleAddRow}
                isOnline={isOnline}
              />
              {loading && rows.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <p className="text-gray-500 dark:text-gray-400">Φόρτωση δεδομένων...</p>
                </div>
              ) : (
                <DataTable 
                    rows={rows} 
                    onDeleteRow={handleDeleteRow}
                    onUpdateRow={handleUpdateRow}
                    isOnline={isOnline}
                />
              )}
          </div>
        </main>
        {!isOnline && (
            <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-yellow-900 text-center p-3 text-sm font-semibold shadow-lg animate-slide-in-up z-20">
                Είστε εκτός σύνδεσης. Η λειτουργικότητα είναι περιορισμένη.
            </div>
        )}
      </div>
    </>
  );
};

export default App;