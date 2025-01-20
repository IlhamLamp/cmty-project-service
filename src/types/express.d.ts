declare namespace Express {
  export interface Request {
    token: string;
    user: {
      id: number;
      email: string;
    };
  }

  export interface Response {
    success: (
      content: unknown,
      message?: string,
      code?: number | null,
      dev?: unknown
    ) => void;
  }
}
