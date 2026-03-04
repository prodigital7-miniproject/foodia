import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <SearchResults />
    </Suspense>
  );
}
