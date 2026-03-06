"use client";

import { Home, Search, Bookmark, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 ${
            isActive("/") ? "text-orange-600" : "text-gray-500"
          }`}
        >
          <Home size={24} />
          <span className="text-xs">홈</span>
        </Link>
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center gap-1 ${
            isActive("/search") ? "text-orange-600" : "text-gray-500"
          }`}
        >
          <Search size={24} />
          <span className="text-xs">탐색</span>
        </Link>
        <Link
          href="/saved"
          className={`flex flex-col items-center justify-center gap-1 ${
            isActive("/saved") ? "text-orange-600" : "text-gray-500"
          }`}
        >
          <Bookmark size={24} />
          <span className="text-xs">저장</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 ${
            isActive("/profile") ? "text-orange-600" : "text-gray-500"
          }`}
        >
          <User size={24} />
          <span className="text-xs">마이</span>
        </Link>
      </div>
    </nav>
  );
}
