"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { IMAGE_BASE_URL, toggleBookmark } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import TitleCard from "./TitleCard";

interface GridItemProps {
  post: Post;
  onBookmarkChange?: (postId: number, bookmarked: boolean) => void;
}

export default function GridItem({ post, onBookmarkChange }: GridItemProps) {
  const { isLoggedIn } = useAuth();
  const [bookmarked, setBookmarked] = useState(post.bookmarked ?? false);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await toggleBookmark(post.id);
      setBookmarked(res.bookmarked);
      onBookmarkChange?.(post.id, res.bookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block rounded-xl overflow-hidden transition-transform duration-200 hover:scale-105 relative"
    >
      {isLoggedIn && (
        <button
          onClick={handleBookmarkClick}
          className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all text-sm ${
            bookmarked
              ? "bg-teal-500 text-white opacity-100"
              : "bg-black/50 text-white opacity-0 group-hover:opacity-100"
          }`}
        >
          🔖
        </button>
      )}
      {post.imageUrl ? (
        <div className="relative aspect-square">
          <img
            src={`${IMAGE_BASE_URL}${post.imageUrl}`}
            alt={post.title}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute bottom-2 right-2 flex gap-2 text-[10px] sm:text-xs text-white bg-black/50 rounded-full px-2 py-0.5">
            <span>♥ {post.likeCount}</span>
            <span>👁 {post.viewCount}</span>
          </div>
        </div>
      ) : (
        <TitleCard title={post.title} postId={post.id} likeCount={post.likeCount} viewCount={post.viewCount} />
      )}
    </Link>
  );
}
