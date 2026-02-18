"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { nickname, isLoggedIn, isAdmin, handleLogout } = useAuth();

  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          VGC
        </Link>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="text-sm text-gray-300 hover:text-white transition-colors">
                {nickname}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  관리자
                </Link>
              )}
              <Link
                href="/posts/new"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                새 글 쓰기
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
