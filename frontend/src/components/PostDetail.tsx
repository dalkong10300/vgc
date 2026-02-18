"use client";

import { useState, useEffect } from "react";
import { Post, CategoryInfo } from "@/types";
import { getPost, getCategories, toggleLike, getLikeStatus, toggleBookmark, getBookmarkStatus, IMAGE_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import CommentSection from "./CommentSection";
import PostContent from "./PostContent";

interface PostDetailProps {
  postId: number;
}

const colorClassMap: Record<string, string> = {
  yellow: "bg-yellow-100 text-yellow-800",
  blue: "bg-blue-100 text-blue-800",
  orange: "bg-orange-100 text-orange-800",
  purple: "bg-purple-100 text-purple-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  pink: "bg-pink-100 text-pink-800",
  indigo: "bg-indigo-100 text-indigo-800",
  teal: "bg-teal-100 text-teal-800",
  gray: "bg-gray-100 text-gray-800",
};

const FALLBACK_CATEGORIES: CategoryInfo[] = [
  { id: 0, name: "HUMOR", label: "유머", color: "yellow" },
  { id: 0, name: "NEWS", label: "시사", color: "blue" },
  { id: 0, name: "DOG", label: "강아지", color: "orange" },
  { id: 0, name: "CAT", label: "고양이", color: "purple" },
  { id: 0, name: "CHAT", label: "잡담", color: "green" },
];

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<CategoryInfo[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    getCategories()
      .then((cats) => { if (cats.length > 0) setCategories(cats); })
      .catch(console.error);
    getPost(postId)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  useEffect(() => {
    if (isLoggedIn) {
      getBookmarkStatus(postId)
        .then((res) => setBookmarked(res.bookmarked))
        .catch(console.error);
      getLikeStatus(postId)
        .then((res) => setPost((prev) => prev ? { ...prev, liked: res.liked } : prev))
        .catch(console.error);
    }
  }, [postId, isLoggedIn]);

  const handleLike = async () => {
    if (!post || !isLoggedIn) return;
    try {
      const updated = await toggleLike(post.id);
      setPost(updated);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await toggleBookmark(postId);
      setBookmarked(res.bookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  const getCategoryInfo = (name: string) => {
    return categories.find((c) => c.name === name);
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

  const catInfo = getCategoryInfo(post.category);
  const colorClass = catInfo ? (colorClassMap[catInfo.color] || "bg-gray-100 text-gray-800") : "bg-gray-100 text-gray-800";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
          {catInfo?.label || post.category}
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

      <PostContent content={post.content} />

      <div className="flex items-center gap-4 pt-4 border-t">
        {isLoggedIn ? (
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
              post.liked
                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            ♥ 좋아요 {post.likeCount}
          </button>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-400 font-medium text-sm">
            ♥ 좋아요 {post.likeCount}
          </span>
        )}
        {isLoggedIn && (
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
              bookmarked
                ? "bg-teal-50 text-teal-600"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {bookmarked ? "🔖 북마크됨" : "🔖 북마크"}
          </button>
        )}
      </div>

      <CommentSection postId={postId} />
    </div>
  );
}
