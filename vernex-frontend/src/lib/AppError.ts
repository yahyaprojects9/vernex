export class AppError extends Error {
  constructor(
    message: string,
    readonly code = "UNKNOWN_ERROR",
    readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}
