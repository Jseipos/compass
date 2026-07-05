// Local storage using IndexedDB
// Mental health data stays on device

const DB_NAME = "compass-journal";
const DB_VERSION = 2;
const STORE_JOURNAL = "entries";
const STORE_ASSESSMENT = "assessment";
const STORE_PLAN = "plan";
const STORE_THERAPIST = "therapist";
const STORE_PREFS = "prefs";

export interface JournalEntry {
  id: string;
  date: string;
  promptId: string;
  promptText: string;
  response: string;
  followUpResponse?: string;
  mood?: number;
  energy?: number;
}

export interface StoredAssessment {
  date: string;
  answers: Record<string, number>;
  results: {
    patterns: Record<string, number>;
    topPatterns: string[];
    totalScore: number;
  };
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_JOURNAL)) {
        const store = db.createObjectStore(STORE_JOURNAL, { keyPath: "id" });
        store.createIndex("date", "date", { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_ASSESSMENT)) {
        db.createObjectStore(STORE_ASSESSMENT, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_PLAN)) {
        db.createObjectStore(STORE_PLAN, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_THERAPIST)) {
        db.createObjectStore(STORE_THERAPIST, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_PREFS)) {
        db.createObjectStore(STORE_PREFS, { keyPath: "id" });
      }
    };
  });
}

// ===== Journal Entries =====
export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_JOURNAL, "readwrite");
    tx.objectStore(STORE_JOURNAL).put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getJournalEntries(limit?: number): Promise<JournalEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_JOURNAL, "readonly");
    const request = tx.objectStore(STORE_JOURNAL).getAll();
    request.onsuccess = () => {
      const entries = request.result as JournalEntry[];
      entries.sort((a, b) => b.date.localeCompare(a.date));
      resolve(limit ? entries.slice(0, limit) : entries);
    };
    request.onerror = () => reject(request.error);
  });
}

// ===== Assessment (partial answers saved as we go) =====
export async function saveAssessmentAnswers(answers: Record<string, number>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ASSESSMENT, "readwrite");
    tx.objectStore(STORE_ASSESSMENT).put({ id: "current", answers, date: new Date().toISOString() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAssessmentAnswers(): Promise<Record<string, number> | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ASSESSMENT, "readonly");
    const request = tx.objectStore(STORE_ASSESSMENT).get("current");
    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.answers as Record<string, number>);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function clearAssessment(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ASSESSMENT, "readwrite");
    tx.objectStore(STORE_ASSESSMENT).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ===== Plan =====
export async function savePlan(plan: { id: string; data: unknown }): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PLAN, "readwrite");
    tx.objectStore(STORE_PLAN).put(plan);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPlan(): Promise<{ id: string; data: unknown } | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PLAN, "readonly");
    const request = tx.objectStore(STORE_PLAN).get("current");
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

// ===== Prefs =====
export async function getPref(key: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PREFS, "readonly");
    const req = tx.objectStore(STORE_PREFS).get(key);
    req.onsuccess = () => resolve(req.result?.value ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function setPref(key: string, value: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PREFS, "readwrite");
    tx.objectStore(STORE_PREFS).put({ id: key, value });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ===== Export / Import =====
export interface ExportData {
  app: "compass";
  version: 1;
  exportedAt: string;
  assessment: { id: string; answers: Record<string, number>; date: string } | null;
  entries: JournalEntry[];
  therapistPlan: { id: string; text: string; date: string } | null;
}

export async function exportAllData(): Promise<ExportData> {
  const db = await openDB();
  const entries = await getJournalEntries();
  const assessment = await new Promise<{ id: string; answers: Record<string, number>; date: string } | null>((resolve, reject) => {
    const tx = db.transaction(STORE_ASSESSMENT, "readonly");
    const req = tx.objectStore(STORE_ASSESSMENT).get("current");
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
  const therapistPlan = await new Promise<{ id: string; text: string; date: string } | null>((resolve, reject) => {
    const tx = db.transaction(STORE_THERAPIST, "readonly");
    const req = tx.objectStore(STORE_THERAPIST).get("current");
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
  return {
    app: "compass",
    version: 1,
    exportedAt: new Date().toISOString(),
    assessment,
    entries,
    therapistPlan,
  };
}

export async function importData(data: ExportData): Promise<{ entries: number; assessment: boolean }> {
  const db = await openDB();
  let importedEntries = 0;
  let importedAssessment = false;

  // Import entries
  if (data.entries && Array.isArray(data.entries)) {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_JOURNAL, "readwrite");
      const store = tx.objectStore(STORE_JOURNAL);
      for (const entry of data.entries) {
        store.put(entry);
        importedEntries++;
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Import assessment
  if (data.assessment && data.assessment.answers) {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_ASSESSMENT, "readwrite");
      tx.objectStore(STORE_ASSESSMENT).put(data.assessment);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    importedAssessment = true;
  }

  // Import therapist plan
  if (data.therapistPlan && data.therapistPlan.text) {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_THERAPIST, "readwrite");
      tx.objectStore(STORE_THERAPIST).put(data.therapistPlan);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  return { entries: importedEntries, assessment: importedAssessment };
}

// ===== Therapist Plan =====
export async function saveTherapistPlan(text: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_THERAPIST, "readwrite");
    tx.objectStore(STORE_THERAPIST).put({ id: "current", text, date: new Date().toISOString() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getTherapistPlan(): Promise<{ id: string; text: string; date: string } | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_THERAPIST, "readonly");
    const request = tx.objectStore(STORE_THERAPIST).get("current");
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

// ===== Nuclear reset =====
export async function deleteAllData(): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve(); // force resolve even if blocked
  });
}
