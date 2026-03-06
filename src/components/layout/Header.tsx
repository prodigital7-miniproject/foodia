"use client";

import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-screen-lg mx-auto px-5 h-14 flex items-center">
        <button onClick={() => router.push("/")}>
          <img src="/logo.svg" className="w-24 h-auto" alt="foodia 로고" />
        </button>
      </div>
    </header>
  );
}