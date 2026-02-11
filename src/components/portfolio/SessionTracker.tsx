"use client";

import { useSessionBeacon } from "@/hooks/useSessionBeacon";

interface SessionTrackerProps {
  visitId: string | null;
}

/** Client component that activates sendBeacon tracking for session duration. */
export function SessionTracker({ visitId }: SessionTrackerProps) {
  useSessionBeacon(visitId);
  return null;
}
