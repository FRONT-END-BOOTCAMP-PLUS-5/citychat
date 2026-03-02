export interface ApiResponse<T> {
  total: number;
  hasMore: boolean;
  items: T[];
  // 나중에 필요하면 추가하기...
  // limit: number;
  // next: string | null;
  // offset: number;
}

