export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    summary?: {
      revenueCompleted: number;
      countCompleted: number;
      countPending: number;
      countFailed: number;
      countRefunded: number;
    };
  };
}

export interface ApiError {
  success: false;
  message: string;
  errorSources?: { path: string; message: string }[];
}
