import { ZodError } from "zod";

export type ErrorOptions = {
  errorCode?: number;
  errorName?: string;
  context?: ZodError | string | { [key: string]: unknown };
};

interface ErrorData {
  defaultMessage: string;
}

export abstract class ResponseError extends Error implements ErrorData {
  public status = 500;
  public serviceName!: string;
  public errorOptions: ErrorOptions = {};
  public defaultMessage = "unhandled error";

  constructor(
    message?: string | null,
    serviceName?: string | null,
    options?: ErrorOptions
  ) {
    super(message || undefined);
    if (serviceName) this.serviceName = serviceName;
    if (options) Object.assign(this.errorOptions, options);
  }

  public getErrorMessage() {
    return this.message || this.defaultMessage;
  }

  public getErrorCtx() {
    return this.errorOptions.context;
  }

  public getErrorCode() {
    return this.errorOptions.errorCode || undefined;
  }
}

export class BadRequest extends ResponseError {
  public status: number = 400;
  public defaultMessage: string = "Bad Request";
  public rawError: unknown;

  constructor(
    message?: string | null,
    serviceName?: string | null,
    options?: ErrorOptions
  ) {
    super(message, serviceName, options);
    if (typeof options?.context === "string") {
      this.errorOptions.context = options.context;
    } else if (options?.context instanceof ZodError) {
      this.rawError = options.context;
      this.errorOptions.context = options.context.flatten().fieldErrors;
    } else if (options?.context) {
      this.errorOptions.context = options.context;
    }
  }
}

export class NotFound extends ResponseError {
  public status = 404;
  public defaultMessage = "Not Found";
}

export class NotAuthenticated extends ResponseError {
  public status = 401;
  public defaultMessage = "Authentication failed, invalid token";
}
export class NotAuthorized extends ResponseError {
  public status = 401;
  public defaultMessage = "User not authorized for this action";
}

export class Conflict extends ResponseError {
  public status = 409;
  public defaultMessage = "Conflict";
}

export class TooManyRequest extends ResponseError {
  public status = 429;
  public defaultMessage = "Too many request";
}

export class InternalError extends ResponseError {
  public status = 500;
  public defaultMessage = "Internal server error";
}
