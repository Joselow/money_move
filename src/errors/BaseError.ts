export class BaseError extends Error {
    constructor(message: string, public statusCode: number = 500, public errors: any = null) {
      super(message);
    }
  }