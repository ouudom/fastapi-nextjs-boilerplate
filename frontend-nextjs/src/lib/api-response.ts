export interface BaseResponse<T = unknown> {
  success: boolean;
  status_code: number;
  message: string | null;
  data: T | null;
}

export interface Pagination {
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: Pagination;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
