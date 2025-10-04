// src/contexts/diary/EntriesContext.tsx

import { todayLocalISO } from "@/src/utils/date";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Entry = {
  id: string;
  createdAt: string; // YYYY-MM-DD (imutável)
  text: string;
  mood?: "happy" | "neutral" | "sad" | "angry" | "anxious";
  createdAtIso?: string;
};

type EntriesContextType = {
  entries: Entry[];
  addEntry: (payload: {
    text: string;
    createdAt?: string;
    mood?: Entry["mood"];
  }) => Promise<void>; // <-- payload aceita mood
  updateEntry: (
    id: string,
    payload: { text?: string; mood?: Entry["mood"] }
  ) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  clearAll?: () => Promise<void>;
  loaded: boolean;
};

const STORAGE_KEY = "flowy_entries_v1";
const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export const EntriesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);

  const normalizeLoaded = (raw: any[]): Entry[] => {
    return raw.map((e) => {
      const id = e && e.id ? String(e.id) : String(Date.now());

      // se já existe createdAt no formato YMD, preserve
      if (
        e &&
        e.createdAt &&
        typeof e.createdAt === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(e.createdAt)
      ) {
        return {
          id,
          createdAt: e.createdAt,
          text: String(e.text ?? ""),
          mood: e.mood ? (String(e.mood) as Entry["mood"]) : undefined,
          createdAtIso: e.createdAtIso ? String(e.createdAtIso) : undefined,
        };
      }

      // se existe createdAt em outro formato, tente extrair YMD
      if (e && e.createdAt && typeof e.createdAt === "string") {
        try {
          const d = new Date(e.createdAt);
          if (!isNaN(d.getTime())) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return {
              id,
              createdAt: `${y}-${m}-${day}`,
              text: String(e.text ?? ""),
              createdAtIso: e.createdAt,
            };
          }
        } catch {}
      }

      // se tem campo date (MM/DD/YYYY ou similar) -> tenta parse e converter
      if (e && e.date && typeof e.date === "string") {
        const parsed = new Date(e.date);
        if (!isNaN(parsed.getTime())) {
          const y = parsed.getFullYear();
          const m = String(parsed.getMonth() + 1).padStart(2, "0");
          const day = String(parsed.getDate()).padStart(2, "0");
          return {
            id,
            createdAt: `${y}-${m}-${day}`,
            text: String(e.text ?? ""),
            createdAtIso: parsed.toISOString(),
          };
        }
      }

      // fallback — só aqui, quando realmente não existe data extraível
      return {
        id,
        createdAt: todayLocalISO(),
        text: String(e && e.text ? e.text : ""),
        createdAtIso: new Date().toISOString(),
      };
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setEntries(Array.isArray(parsed) ? normalizeLoaded(parsed) : []);
        } else {
          setEntries([]);
        }
      } catch (err) {
        console.warn("Erro ao carregar entries do storage:", err);
        setEntries([]);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  const persist = async (next: Entry[]) => {
    setEntries(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn("Erro ao persistir entries no storage:", err);
      throw err;
    }
  };

  const addEntry = async (payload: {
    text: string;
    createdAt?: string;
    mood?: Entry["mood"];
  }) => {
    const createdAt =
      payload.createdAt && /^\d{4}-\d{2}-\d{2}$/.test(payload.createdAt)
        ? payload.createdAt
        : todayLocalISO();
    const newEntry: Entry = {
      id: String(Date.now()),
      text: payload.text,
      createdAt,
      mood: payload.mood, // <-- guarda o mood
      createdAtIso: new Date().toISOString(),
    };

    setEntries((prev) => {
      const next = [newEntry, ...prev];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((err) => {
        console.warn("Erro ao persistir entries no storage (addEntry):", err);
      });
      return next;
    });
  };

  const updateEntry = async (
    id: string,
    payload: { text?: string; mood?: Entry["mood"] }
  ) => {
    const next = entries.map((e) =>
      e.id === id
        ? { ...e, text: payload.text ?? e.text, mood: payload.mood ?? e.mood }
        : e
    );
    await persist(next);
  };

  const deleteEntry = async (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    await persist(next);
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setEntries([]);
    } catch (err) {
      console.warn("Erro ao limpar storage:", err);
      throw err;
    }
  };

  return (
    <EntriesContext.Provider
      value={{ entries, addEntry, updateEntry, deleteEntry, clearAll, loaded }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error("useEntries must be used within EntriesProvider");
  return ctx;
}
