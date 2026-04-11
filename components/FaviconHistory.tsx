"use client";

import { useEffect, useState } from "react";
import { History, Trash2, RotateCcw } from "lucide-react";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  dataUrl: string;
  label: string;
  config: Record<string, unknown>;
}

const STORAGE_KEY = "faviconkit-history";
const MAX_HISTORY = 12;

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveToHistory(
  dataUrl: string,
  label: string,
  config: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  try {
    const prev = loadHistory();
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      dataUrl,
      label,
      config,
    };
    const next = [entry, ...prev].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

interface Props {
  onRestore: (config: Record<string, unknown>) => void;
}

export function FaviconHistory({ onRestore }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, [open]);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const fmt = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (history.length === 0 && !open) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-zinc-400" strokeWidth={2} />
          <span className="text-sm font-semibold text-zinc-900">
            History
          </span>
          {history.length > 0 && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">
              {history.length}
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-400">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open && (
        <div className="border-t border-zinc-100 p-4">
          {history.length === 0 ? (
            <p className="py-4 text-center text-xs text-zinc-400">
              No history yet — generate a favicon to start saving.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-3">
                {history.map((entry) => (
                  <div key={entry.id} className="group relative">
                    <button
                      onClick={() => onRestore(entry.config)}
                      className="flex w-full flex-col items-center gap-1.5"
                      title={`Restore — ${entry.label}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={entry.dataUrl}
                        alt={entry.label}
                        className="h-12 w-12 rounded-xl border border-zinc-200 shadow-sm transition group-hover:border-zinc-400 group-hover:shadow-md"
                      />
                      <span className="text-[10px] text-zinc-400">
                        {fmt(entry.timestamp)}
                      </span>
                    </button>
                    <div className="absolute -right-1 -top-1 hidden group-hover:flex">
                      <button
                        onClick={() => {
                          const next = history.filter(
                            (h) => h.id !== entry.id
                          );
                          localStorage.setItem(
                            STORAGE_KEY,
                            JSON.stringify(next)
                          );
                          setHistory(next);
                        }}
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm hover:bg-red-50 hover:border-red-200"
                        title="Remove"
                      >
                        <Trash2
                          className="h-2.5 w-2.5 text-zinc-400 hover:text-red-500"
                          strokeWidth={2.5}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleClear}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-700"
              >
                <Trash2 className="h-3 w-3" strokeWidth={2} />
                Clear history
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}