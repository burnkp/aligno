/**
 * Structured logger for Convex backend
 * Provides consistent logging format and levels
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

function createLog(level: LogLevel, message: string, data?: any): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    data
  };
}

function formatLog(entry: LogEntry): string {
  const base = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
  return entry.data ? `${base}\n${JSON.stringify(entry.data, null, 2)}` : base;
}

const logger = {
  info: (message: string, data?: any) => {
    const entry = createLog("info", message, data);
    console.log(formatLog(entry));
  },

  warn: (message: string, data?: any) => {
    const entry = createLog("warn", message, data);
    console.warn(formatLog(entry));
  },

  error: (message: string, data?: any) => {
    const entry = createLog("error", message, data);
    console.error(formatLog(entry));
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== "production") {
      const entry = createLog("debug", message, data);
      console.debug(formatLog(entry));
    }
  }
};

export default logger; 