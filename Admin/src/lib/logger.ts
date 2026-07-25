export function logEvent(level: "info" | "warn" | "error", event: Record<string, unknown>) {
  const payload = {
    level,
    timestamp: new Date().toISOString(),
    ...event,
  };
  // Structured console logging for server events.
  console[level === "error" ? "error" : "log"](JSON.stringify(payload));
}
