declare namespace Express {
  export interface Request {
    token?: string;
    users?: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
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
