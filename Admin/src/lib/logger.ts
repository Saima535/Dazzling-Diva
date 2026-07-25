const sensitiveKeys = ["password", "token", "authorization", "cookie", "secret"];

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))
          ? "[REDACTED]"
          : redactValue(nestedValue),
      ]),
    );
  }
  return value;
}

export function logEvent(level: "info" | "warn" | "error", event: Record<string, unknown>) {
  const redactedEvent = redactValue(event) as Record<string, unknown>;
  const payload = {
    level,
    timestamp: new Date().toISOString(),
    ...redactedEvent,
  };
  // Structured console logging for server events.
  console[level === "error" ? "error" : "log"](JSON.stringify(payload));
}
