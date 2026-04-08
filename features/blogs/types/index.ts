export interface Blog {
  id: number;
  category_name: string;
  title: string;
  description: string;
  image: string | null;
  publisher_name: string;
  created_at: string;
}

export interface Pagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  errors: string[];
  pagination?: Pagination;
}

export type BlogsResponse = ApiResponse<Blog[]>;
export type BlogDetailResponse = ApiResponse<Blog>;

