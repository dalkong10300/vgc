import Link from "next/link";
import { Post } from "@/types";
import { IMAGE_BASE_URL } from "@/lib/api";
import TitleCard from "./TitleCard";

interface GridItemProps {
  post: Post;
}

export default function GridItem({ post }: GridItemProps) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block rounded-xl overflow-hidden transition-transform duration-200 hover:scale-105"
    >
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
