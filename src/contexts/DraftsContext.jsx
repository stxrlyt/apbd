import React, { createContext, useContext, useState } from "react";
import { initialDrafts } from "../data/mockData";
import { uid, now } from "../utils/helpers";

// 1. Create the context
const DraftsContext = createContext(null);

// 2. Create the Provider component
export function DraftsProvider({ children }) {
  const [drafts, setDrafts] = useState(initialDrafts);

  function createDraft(newDraft) {
    setDrafts(prev => [newDraft, ...prev]);
  }

  function approveDraft(id) {
    setDrafts(prev => prev.map(d => d.id === id ? ({ ...d, status: "Approved", approvedAt: now() }) : d));
  }

  function requestChanges(id) {
    setDrafts(prev => prev.map(d => d.id === id ? ({ ...d, status: "Needs Changes" }) : d));
  }

  function addVersion(draftId, version) {
    setDrafts(prev => prev.map(d => d.id === draftId ? ({ ...d, versions: [...d.versions, version] }) : d));
  }

  const value = {
    drafts,
    createDraft,
    approveDraft,
    requestChanges,
    addVersion
  };

  return (
    <DraftsContext.Provider value={value}>
      {children}
    </DraftsContext.Provider>
  );
}

// 3. Create a custom hook for easy access
export function useDrafts() {
  const context = useContext(DraftsContext);
  if (!context) {
    throw new Error("useDrafts must be used within a DraftsProvider");
  }
  return context;
}