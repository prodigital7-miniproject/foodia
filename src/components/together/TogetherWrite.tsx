"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Footer } from "../layout/Footer";

type StoreSummary = {
  rid: string;
  name: string;
  category: string;
  imgUrl: string | null;
};

export function TogetherWrite() {
  const params = useParams();
  const restaurantId = params.restaurantId as string | undefined;
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<StoreSummary | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent]       = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [openChatLink, setOpenChatLink] = useState("");

  useEffect(() => {
    if (!restaurantId) { setLoading(false); setError("잘못된 경로입니다."); return; }
    const fetchStore = async () => {
      try {
        setLoading(true); setError(null);
        const res  = await fetch(`/api/restaurants/${restaurantId}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json?.success) { setError(json?.message ?? "식당 정보를 불러오지 못했습니다."); setRestaurant(null); return; }
        setRestaurant({ rid: json.data.rid, name: json.data.name, category: json.data.category, imgUrl: json.data.imgUrl });
      } catch { setError("식당 정보를 불러오지 못했습니다."); setRestaurant(null); }
      finally  { setLoading(false); }
    };
    fetchStore();
  }, [restaurantId]);

  const handleSubmit = async () => {
    if (!restaurant) { alert("식당 정보를 불러오지 못했습니다."); return; }
    if (!authorName.trim()) { alert("이름을 입력해주세요."); return; }
    if (!content.trim())    { alert("모집글 내용을 입력해주세요."); return; }
    const finalContent = [content.trim(), openChatLink && `[오픈채팅] ${openChatLink}`].filter(Boolean).join("\n");
    try {
      const res  = await fetch("/api/together-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rid: restaurant.rid, content: finalContent, authorName: authorName.trim(), maxParticipants: peopleCount }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) { alert(json?.error?.message ?? "모집글 등록에 실패했습니다."); return; }
      alert("같이먹기 글이 등록되었습니다!");
      router.push(`/restaurant/${restaurant.rid}`);
    } catch { alert("모집글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요."); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    </div>
  );

  if (error || !restaurant) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-2xl">😢</p>
      <p className="text-gray-500 font-medium">{error ?? "식당 정보를 찾을 수 없습니다."}</p>
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
          <h1 className="text-base font-bold text-gray-900 truncate">같이먹기 글 작성</h1>
          <span className="text-sm text-gray-400 truncate">· {restaurant.name}</span>
        </div>
      </header>
      <div className="flex-grow">
      <div className="max-w-screen-lg mx-auto px-4 pt-4 pb-28 space-y-3">

        {/* ── 식당 정보 ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
            <img
              src={restaurant.imgUrl || "/images/default-restaurant.jpg"}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate">{restaurant.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{restaurant.category}</p>
          </div>
        </div>

        {/* ── 이름 ── */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
          <label className="text-sm font-bold text-gray-900 block mb-2">이름</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="실명을 입력해 주세요"
            maxLength={50}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:bg-white transition-all"
          />
        </div>

        {/* ── 모집글 내용 ── */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
          <label className="text-sm font-bold text-gray-900 block mb-2">모집글 내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"같이 식사할 분을 모집하는 글을 작성해주세요\n예: 오늘 점심 같이 드실 분 구해요!"}
            maxLength={200}
            className="w-full h-32 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl resize-none text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:bg-white transition-all"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-400">{content.length}/200</span>
          </div>
        </div>

        {/* ── 모집 인원 ── */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
          <label className="text-sm font-bold text-gray-900 block mb-3">모집 인원</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-600 transition-colors active:scale-95"
            >
              −
            </button>
            <span className="text-xl font-black text-gray-900 w-14 text-center">
              {peopleCount}명
            </span>
            <button
              onClick={() => setPeopleCount(Math.min(10, peopleCount + 1))}
              className="w-10 h-10 bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center text-lg font-bold text-orange-500 transition-colors active:scale-95"
            >
              +
            </button>
          </div>
          {/* 인원 프로그레스 */}
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  i < peopleCount ? "bg-orange-400" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-right">최대 10명</p>
        </div>

        {/* ── 오픈채팅 링크 ── */}
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
          <label className="text-sm font-bold text-gray-900 block mb-0.5">
            오픈채팅 링크
            <span className="ml-1.5 text-xs font-medium text-gray-400">(선택사항)</span>
          </label>
          <p className="text-xs text-gray-400 mb-3">카카오톡 오픈채팅 링크를 입력하면 참여자가 바로 연락할 수 있어요</p>
          <input
            type="url"
            value={openChatLink}
            onChange={(e) => setOpenChatLink(e.target.value)}
            placeholder="https://open.kakao.com/..."
            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:bg-white transition-all"
          />
        </div>

        {/* ── 등록 버튼 ── */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-2xl font-bold text-sm shadow-md shadow-orange-200 transition-all"
        >
          모집글 등록하기
        </button>

      </div>
      </div>
    <Footer/>
    </div>
  );
}