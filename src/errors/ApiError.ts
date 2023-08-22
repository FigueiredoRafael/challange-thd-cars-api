export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    cause?: Error
  ) {
    super(message, { cause });
  }
}
