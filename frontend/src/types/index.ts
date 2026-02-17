export enum Category {
  HUMOR = "HUMOR",
  NEWS = "NEWS",
  DOG = "DOG",
  CAT = "CAT",
}

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  category: Category;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  commentCount: number;
}

export interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number;
}
