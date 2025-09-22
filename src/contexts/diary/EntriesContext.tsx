// src/contexts/EntriesContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Entry = {
  id: string;
  date: string;
  text: string;
};

type EntriesContextType = {
  entries: Entry[];
  addEntry: (payload: { date: string; text: string }) => void;
  updateEntry: (id: string, payload: { date?: string; text?: string }) => void;
  deleteEntry: (id: string) => void;
  clearAll?: () => void;
  loaded: boolean; // indica se os dados já foram carregados do storage
};

const STORAGE_KEY = 'flowy_entries_v1';

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export const EntriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: Entry[] = JSON.parse(raw);
          setEntries(parsed);
        } else {
          // bglh pra enxer linguiça
          setEntries([
            { id: '1', date: getDate(), text: 'Felt lighter after a walk.' },
            { id: '2', date: getDate(), text: 'Challenging day, but I kept going.' },
          ]);
        }
      } catch (err) {
        console.warn('Erro ao carregar entries do storage:', err);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      if (!loaded) return; // evita sobrescrever antes de carregar
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch (err) {
        console.warn('Erro ao salvar entries no storage:', err);
      }
    };
    save();
  }, [entries, loaded]);

  const addEntry = (payload: { date: string; text: string }) => {
    const newEntry: Entry = {
      id: String(Date.now()),
      date: payload.date,
      text: payload.text,
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const updateEntry = (id: string, payload: { date?: string; text?: string }) => {
    setEntries(prev => prev.map(e => (e.id === id ? { ...e, ...payload } : e)));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setEntries([]);
    } catch (err) {
      console.warn('Erro ao limpar storage:', err);
    }
  };

  function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}

  return (
    <EntriesContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry, clearAll, loaded }}>
      {children}
    </EntriesContext.Provider>
  );
};

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error('useEntries must be used within EntriesProvider');
  return ctx;
}