"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { TogetherPostDetail } from "@/components/together/TogetherPostDetail";
import type { TogetherPostDetailData } from "@/components/together/TogetherPostDetail";

export default function TogetherPostPage() {
  const params = useParams();
  const postId = params?.postId as string | undefined;
  const [data, setData] = useState<TogetherPostDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/together-posts/${id}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "게시글을 불러오지 못했습니다.");
        setData(null);
        return;
      }
      setData(json.data ?? null);
    } catch {
      setError("게시글을 불러오지 못했습니다.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      setError("잘못된 경로입니다.");
      return;
    }
    fetchPost(postId);
  }, [postId, fetchPost]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-red-500 text-center">{error ?? "게시글을 찾을 수 없습니다."}</p>
      </div>
    );
  }

  return <TogetherPostDetail data={data} />;
}
