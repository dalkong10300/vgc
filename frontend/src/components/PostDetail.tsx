"use client";

import { useState, useEffect } from "react";
import { Post, Category } from "@/types";
import { getPost, toggleLike, IMAGE_BASE_URL } from "@/lib/api";
import CommentSection from "./CommentSection";

interface PostDetailProps {
  postId: number;
}

const categoryLabel: Record<Category, string> = {
  [Category.HUMOR]: "유머",
  [Category.NEWS]: "시사",
  [Category.DOG]: "강아지",
  [Category.CAT]: "고양이",
};

const categoryColor: Record<Category, string> = {
  [Category.HUMOR]: "bg-yellow-100 text-yellow-800",
  [Category.NEWS]: "bg-blue-100 text-blue-800",
  [Category.DOG]: "bg-orange-100 text-orange-800",
  [Category.CAT]: "bg-purple-100 text-purple-800",
};

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPost(postId)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  const handleLike = async () => {
    if (!post) return;
    try {
      const updated = await toggleLike(post.id);
      setPost(updated);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-gray-500">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColor[post.category]}`}
        >
          {categoryLabel[post.category]}
        </span>
        <h1 className="text-2xl font-bold mt-3">{post.title}</h1>
        <div className="flex gap-4 text-sm text-gray-500 mt-2">
          <span>조회 {post.viewCount}</span>
          <span>좋아요 {post.likeCount}</span>
          <span>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
        </div>
      </div>

      {post.imageUrl && (
        <div className="w-full rounded-xl overflow-hidden">
          <img
            src={`${IMAGE_BASE_URL}${post.imageUrl}`}
            alt={post.title}
            className="w-full rounded-xl"
          />
        </div>
      )}

      <div className="prose max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
        {post.content}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors font-medium text-sm"
        >
          ♥ 좋아요 {post.likeCount}
        </button>
      </div>

      <CommentSection postId={postId} />
    </div>
  );
}
