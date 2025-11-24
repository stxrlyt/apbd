import React, { createContext, useContext, useState, useEffect } from "react";
import { createDraft as createDraftService, updateDraft, subscribeToDrafts } from "../firebase/draftsService";
import { now } from "../utils/helpers";

// 1. Create the context
const DraftsContext = createContext(null);

// 2. Create the Provider component
export function DraftsProvider({ children }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToDrafts((draftsData) => {
      setDrafts(draftsData);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  async function createDraft(newDraft) {
    try {
      await createDraftService(newDraft);
      // The subscription will automatically update the drafts state
    } catch (error) {
      console.error("Error creating draft:", error);
      throw error;
    }
  }

  async function approveDraft(id) {
    try {
      const draft = drafts.find(d => d.id === id);
      if (!draft) return;
      
      await updateDraft(id, {
        status: "Approved",
        approvedAt: now()
      });
      // The subscription will automatically update the drafts state
    } catch (error) {
      console.error("Error approving draft:", error);
      throw error;
    }
  }

  async function requestChanges(id) {
    try {
      await updateDraft(id, {
        status: "Needs Changes"
      });
      // The subscription will automatically update the drafts state
    } catch (error) {
      console.error("Error requesting changes:", error);
      throw error;
    }
  }

  async function addVersion(draftId, version) {
    try {
      const draft = drafts.find(d => d.id === draftId);
      if (!draft) return;
      
      await updateDraft(draftId, {
        versions: [...draft.versions, version]
      });
      // The subscription will automatically update the drafts state
    } catch (error) {
      console.error("Error adding version:", error);
      throw error;
    }
  }

  const value = {
    drafts,
    loading,
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