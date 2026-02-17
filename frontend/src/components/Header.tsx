import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          VGC
        </Link>
        <Link
          href="/posts/new"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          새 글 쓰기
        </Link>
      </div>
    </header>
  );
}
