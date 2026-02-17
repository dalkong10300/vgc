"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Post } from "@/types";
import { getPosts } from "@/lib/api";
import CategoryFilter from "./CategoryFilter";
import SortSelector from "./SortSelector";
import GridItem from "./GridItem";
import SkeletonGrid from "./SkeletonGrid";

export default function GridFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("latest");
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(
    async (pageNum: number, append: boolean) => {
      setLoading(true);
      try {
        const data = await getPosts(category ?? undefined, sort, pageNum, 12);
        if (append) {
          setPosts((prev) => [...prev, ...data.content]);
        } else {
          setPosts(data.content);
        }
        setHasMore(!data.last);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [category, sort]
  );

  // Reset when category or sort changes
  useEffect(() => {
    setPage(0);
    setPosts([]);
    setHasMore(true);
    fetchPosts(0, false);
  }, [fetchPosts]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchPosts(nextPage, true);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchPosts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <CategoryFilter selected={category} onSelect={setCategory} />
        <SortSelector value={sort} onChange={setSort} />
      </div>

      {loading && posts.length === 0 ? (
        <SkeletonGrid />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <GridItem key={post.id} post={post} />
            ))}
          </div>

          {loading && posts.length > 0 && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-teal-600 rounded-full animate-spin" />
            </div>
          )}
        </>
      )}

      <div ref={sentinelRef} className="h-4" />
    </div>
  );
}
