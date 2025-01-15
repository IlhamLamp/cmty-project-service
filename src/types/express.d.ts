declare namespace Express {
  export interface Request {
    id: number;
    email: string;
  }

  export interface Response {
    success: (
      data: unknown,
      message?: string,
      code?: number | null,
      dev?: unknown
    ) => void;
  }
}
