"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { Store } from "@/lib/types";
import { Footer } from "../layout/Footer";

export function ReviewWrite({ rid }: { rid: string }) {
  const router = useRouter();
  const [rating, setRating]           = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent]         = useState("");
  const [restaurant, setRestaurant]   = useState<Store | null>(null);
  const [loading, setLoading]         = useState(true);
  const [nickname, setNickname]       = useState("");
  const [img_url, setImgUrl]          = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`/api/restaurants/${rid}`, { cache: "no-store" });
        const json = await res.json();
        setRestaurant(res.ok ? json.data : null);
      } catch { setRestaurant(null); }
      finally  { setLoading(false); }
    };
    if (rid) fetchStore();
  }, [rid]);

  const handleSubmit = async () => {
    if (rating === 0)        { alert("별점을 선택해주세요"); return; }
    if (!content.trim())     { alert("리뷰 내용을 입력해주세요"); return; }
    const normalizedNickname = nickname.trim() || "익명";
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rid, rating, content, img_url, nickname: normalizedNickname }),
      });
      if (!res.ok) throw new Error();
      alert("리뷰가 등록되었습니다!");
      router.push(`/restaurant/${rid}`);
    } catch { alert("리뷰 등록에 실패했습니다."); }
  };

  const ratingLabels = ["", "별로예요", "그저그래요", "괜찮아요", "좋아요", "최고예요!"];

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    </div>
  );

  if (!restaurant) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-2xl">😢</p>
      <p className="text-gray-500 font-medium">가게 정보를 불러올 수 없습니다.</p>
      <button onClick={() => router.back()} className="text-sm text-orange-500 font-semibold">← 돌아가기</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── 헤더 ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-base font-bold text-gray-900 truncate">리뷰 작성</h1>
          <span className="text-sm text-gray-400 truncate">· {restaurant.name}</span>
        </div>
      </header>
      <div className="flex-grow">
      <div className="max-w-screen-sm mx-auto px-4 pt-4 space-y-3">

        {/* ── 식당 정보 ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
            <img
              src={restaurant.imgUrl || "/lib/data/no-image.jpg"}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate">{restaurant.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{restaurant.category}</p>
          </div>
        </div>

        {/* ── 별점 ── */}
        <div className="bg-white rounded-2xl px-5 py-6 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-900 text-center mb-4">별점을 선택해주세요</p>
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  size={40}
                  className={
                    star <= (hoverRating || rating)
                      ? "fill-orange-400 text-orange-400"
                      : "text-gray-200"
                  }
                />
              </button>
            ))}
          </div>
          <p className={`text-center text-sm font-semibold transition-colors ${
            rating > 0 ? "text-orange-500" : "text-gray-300"
          }`}>
            {rating > 0 ? `${rating}점 · ${ratingLabels[rating]}` : "별을 눌러주세요"}
          </p>
        </div>

        {/* ── 닉네임 ── */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
          <label className="text-sm font-bold text-gray-900 block mb-2">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            maxLength={20}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:bg-white transition-all"
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-gray-400">
              {!nickname.trim() && "미입력 시 익명으로 등록됩니다"}
            </span>
            <span className="text-xs text-gray-400">{nickname.length}/20</span>
          </div>
        </div>

        {/* ── 리뷰 내용 ── */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
          <label className="text-sm font-bold text-gray-900 block mb-2">리뷰 내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"이 식당에 대한 솔직한 리뷰를 남겨주세요\n(최소 10자 이상)"}
            maxLength={500}
            className="w-full h-32 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl resize-none text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:bg-white transition-all"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-400">{content.length}/500</span>
          </div>
        </div>

        {/* ── 등록 버튼 ── */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-2xl font-bold text-sm shadow-md shadow-orange-200 transition-all"
        >
          리뷰 등록하기
        </button>

      </div>
      </div>
      <Footer/>
    </div>
  );
}