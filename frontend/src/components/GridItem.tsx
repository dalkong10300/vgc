import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
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
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover rounded-xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-xl">
            <p className="text-white text-sm font-medium truncate">{post.title}</p>
            <div className="flex gap-3 text-xs text-gray-300 mt-1">
              <span>♥ {post.likeCount}</span>
              <span>👁 {post.viewCount}</span>
            </div>
          </div>
        </div>
      ) : (
        <TitleCard title={post.title} category={post.category} />
      )}
    </Link>
  );
}
