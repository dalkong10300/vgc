import { Post, Comment, PageResponse } from "@/types";

const BASE_URL = "http://localhost:8080/api";
export const IMAGE_BASE_URL = "http://localhost:8080";

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
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function toggleLike(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}/like`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to toggle like");
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
  content: string,
  authorName: string
): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, authorName }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}
