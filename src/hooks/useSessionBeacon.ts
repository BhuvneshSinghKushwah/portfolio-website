"use client";

import { useEffect } from "react";

/** Sends a beacon to record exit time when the user navigates away or closes the tab. */
export function useSessionBeacon(visitId: string | null) {
  useEffect(() => {
    if (!visitId) return;

    function sendBeacon() {
      const data = JSON.stringify({ visit_id: visitId });
      navigator.sendBeacon("/api/visit/beacon", data);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        sendBeacon();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", sendBeacon);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", sendBeacon);
    };
  }, [visitId]);
}
