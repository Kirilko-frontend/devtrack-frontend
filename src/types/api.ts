export interface ApiError {
  status: number;
  data?: {
    statusCode?: number;
    message?: string | string[];
    error?: string;
    timestamp?: string;
    path?: string;
  } | null;
}
