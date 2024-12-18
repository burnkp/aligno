// Convex-specific logger
const logger = {
  info: (...args: any[]) => {
    console.log('[Convex Info]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[Convex Error]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[Convex Warning]', ...args);
  }
};

export default logger; 