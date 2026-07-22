export type HistoryItem = {
  id: string;
  feature: "ticket" | "email" | "meeting" | "research" | "planner" | "chat";
  title: string;
  prompt: string;
  response: string;
  createdAt: number;
};

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: { role: "user" | "assistant"; content: string; id: string }[];
};

const HKEY = "opspilot.history";
const TKEY = "opspilot.threads";
const SKEY = "opspilot.settings";
const CKEY = "opspilot.counters";
const PKEY = "opspilot.profile";

export type Settings = { theme: "light" | "dark" | "system"; language: string; model: string; notifications: boolean };
export type Counters = { ticket: number; email: number; meeting: number; research: number; planner: number; chat: number };

const isBrowser = () => typeof window !== "undefined";

export function loadHistory(): HistoryItem[] {
  if (!isBrowser()) return [];
  try { return JSON.parse(localStorage.getItem(HKEY) || "[]"); } catch { return []; }
}
export function saveHistoryItem(item: HistoryItem) {
  if (!isBrowser()) return;
  const list = [item, ...loadHistory()].slice(0, 200);
  localStorage.setItem(HKEY, JSON.stringify(list));
  bumpCounter(item.feature);
  window.dispatchEvent(new Event("opspilot:update"));
}
export function deleteHistoryItem(id: string) {
  if (!isBrowser()) return;
  localStorage.setItem(HKEY, JSON.stringify(loadHistory().filter((i) => i.id !== id)));
  window.dispatchEvent(new Event("opspilot:update"));
}

export function loadThreads(): ChatThread[] {
  if (!isBrowser()) return [];
  try { return JSON.parse(localStorage.getItem(TKEY) || "[]"); } catch { return []; }
}
export function saveThreads(threads: ChatThread[]) {
  if (!isBrowser()) return;
  localStorage.setItem(TKEY, JSON.stringify(threads));
  window.dispatchEvent(new Event("opspilot:update"));
}
export function upsertThread(thread: ChatThread) {
  const all = loadThreads().filter((t) => t.id !== thread.id);
  saveThreads([thread, ...all]);
}
export function deleteThread(id: string) {
  saveThreads(loadThreads().filter((t) => t.id !== id));
}

export function loadSettings(): Settings {
  if (!isBrowser()) return { theme: "system", language: "en", model: "gemini-flash", notifications: true };
  try { return { theme: "system", language: "en", model: "gemini-flash", notifications: true, ...JSON.parse(localStorage.getItem(SKEY) || "{}") }; } catch { return { theme: "system", language: "en", model: "gemini-flash", notifications: true }; }
}
export function saveSettings(s: Settings) {
  if (!isBrowser()) return;
  localStorage.setItem(SKEY, JSON.stringify(s));
  window.dispatchEvent(new Event("opspilot:settings"));
}

export function loadCounters(): Counters {
  if (!isBrowser()) return { ticket: 0, email: 0, meeting: 0, research: 0, planner: 0, chat: 0 };
  try { return { ticket: 0, email: 0, meeting: 0, research: 0, planner: 0, chat: 0, ...JSON.parse(localStorage.getItem(CKEY) || "{}") }; } catch { return { ticket: 0, email: 0, meeting: 0, research: 0, planner: 0, chat: 0 }; }
}
export function bumpCounter(k: keyof Counters) {
  if (!isBrowser()) return;
  const c = loadCounters();
  c[k] = (c[k] || 0) + 1;
  localStorage.setItem(CKEY, JSON.stringify(c));
}

export type Profile = { name: string; avatar: string | null };
export function loadProfile(): Profile {
  if (!isBrowser()) return { name: "Tebello", avatar: null };
  try { return { name: "Tebello", avatar: null, ...JSON.parse(localStorage.getItem(PKEY) || "{}") }; } catch { return { name: "Tebello", avatar: null }; }
}
export function saveProfile(p: Profile) {
  if (!isBrowser()) return;
  localStorage.setItem(PKEY, JSON.stringify(p));
  window.dispatchEvent(new Event("opspilot:profile"));
}

export function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }