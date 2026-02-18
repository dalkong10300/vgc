import { Post, Comment, PageResponse, CategoryInfo, CategoryRequestInfo } from "@/types";
import { getToken } from "@/lib/auth";

const BASE_URL = "http://localhost:8080/api";
export const IMAGE_BASE_URL = "http://localhost:8080";

function authHeaders(): HeadersInit {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function getPosts(
  category?: string,
  sort?: string,
  page?: number,
  size?: number
): Promise<PageResponse<Post>> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  if (page !== undefined) params.set("page", String(page));
  if (size !== undefined) params.set("size", String(size));

  const res = await fetch(`${BASE_URL}/posts?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export async function createPost(formData: FormData): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function toggleLike(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}/like`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to toggle like");
  return res.json();
}

export async function getLikeStatus(
  postId: number
): Promise<{ liked: boolean }> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to get like status");
  return res.json();
}

export async function getComments(postId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function addComment(
  postId: number,
  content: string
): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function toggleBookmark(
  postId: number
): Promise<{ bookmarked: boolean }> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/bookmark`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to toggle bookmark");
  return res.json();
}

export async function getBookmarkStatus(
  postId: number
): Promise<{ bookmarked: boolean }> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/bookmark`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to get bookmark status");
  return res.json();
}

export async function getMyPosts(
  page: number = 0,
  size: number = 12
): Promise<PageResponse<Post>> {
  const res = await fetch(
    `${BASE_URL}/profile/posts?page=${page}&size=${size}`,
    { headers: authHeaders(), cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch my posts");
  return res.json();
}

export async function getMyBookmarks(
  page: number = 0,
  size: number = 12
): Promise<PageResponse<Post>> {
  const res = await fetch(
    `${BASE_URL}/profile/bookmarks?page=${page}&size=${size}`,
    { headers: authHeaders(), cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch bookmarks");
  return res.json();
}

export async function getCategories(): Promise<CategoryInfo[]> {
  const res = await fetch(`${BASE_URL}/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function requestCategory(data: {
  name: string;
  label: string;
  color: string;
}): Promise<CategoryRequestInfo> {
  const res = await fetch(`${BASE_URL}/categories/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to request category");
  return res.json();
}

export async function getPendingCategoryRequests(): Promise<
  CategoryRequestInfo[]
> {
  const res = await fetch(`${BASE_URL}/admin/category-requests`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch category requests");
  return res.json();
}

export async function approveCategoryRequest(
  id: number
): Promise<CategoryInfo> {
  const res = await fetch(`${BASE_URL}/admin/category-requests/${id}/approve`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to approve category request");
  return res.json();
}

export async function rejectCategoryRequest(
  id: number,
  reason: string
): Promise<CategoryRequestInfo> {
  const res = await fetch(`${BASE_URL}/admin/category-requests/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error("Failed to reject category request");
  return res.json();
}
