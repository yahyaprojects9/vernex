export const logger = {
  error(message: string, error?: unknown) {
    if (process.env.NODE_ENV !== "production") console.error(`[Vernex] ${message}`, error);
  },
  info(message: string, context?: unknown) {
    if (process.env.NODE_ENV === "development") console.info(`[Vernex] ${message}`, context);
  }
};
