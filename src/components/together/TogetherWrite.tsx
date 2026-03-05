"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [openChatLink, setOpenChatLink] = useState("");

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      setError("잘못된 경로입니다.");
      return;
    }

    const fetchStore = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/store/${restaurantId}`, {
          method: "GET",
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok || !json?.success) {
          setError(json?.message ?? "식당 정보를 불러오지 못했습니다.");
          setRestaurant(null);
          return;
        }

        const data = json.data as {
          rid: string;
          name: string;
          category: string;
          imgUrl: string | null;
        };

        setRestaurant({
          rid: data.rid,
          name: data.name,
          category: data.category,
          imgUrl: data.imgUrl,
        });
      } catch {
        setError("식당 정보를 불러오지 못했습니다.");
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [restaurantId]);

  const handleSubmit = async () => {
    if (!restaurant) {
      alert("식당 정보를 불러오지 못했습니다.");
      return;
    }

    if (!authorName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("모집글 내용을 입력해주세요");
      return;
    }

    const finalContent = [
      content.trim(),
      openChatLink && `[오픈채팅] ${openChatLink}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/together-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rid: restaurant.rid,
          content: finalContent,
          authorName: authorName.trim(),
          maxParticipants: peopleCount,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json?.success) {
        alert(json?.error?.message ?? "모집글 등록에 실패했습니다.");
        return;
      }

      alert("같이먹기 글이 등록되었습니다!");
      router.push(`/restaurant/${restaurant.rid}`);
    } catch {
      alert("모집글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-red-500 text-center">
          {error ?? "식당 정보를 찾을 수 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="font-semibold text-gray-900">같이먹기 글 작성</h1>
            <p className="text-sm text-gray-600">{restaurant.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Restaurant Info */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex gap-3">
            <img
              src={restaurant.imgUrl || "/images/default-restaurant.jpg"}
              alt={restaurant.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.category}</p>
            </div>
          </div>
        </div>

        {/* Author name */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">이름</h2>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="실명을 입력해 주세요"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-400"
            maxLength={50}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">모집글 작성</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="같이 식사할 분을 모집하는 글을 작성해주세요&#10;예: 오늘 점심 같이 드실 분 구해요!"
            className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-400"
            maxLength={200}
          />
          <div className="flex justify-end mt-2">
            <span className="text-sm text-gray-500">{content.length}/200</span>
          </div>
        </div>

        {/* People Count */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">모집 인원</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              -
            </button>
            <span className="text-xl font-semibold text-gray-900 w-12 text-center">
              {peopleCount}명
            </span>
            <button
              onClick={() => setPeopleCount(Math.min(10, peopleCount + 1))}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Open Chat Link (Optional) */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">
            오픈채팅 링크 <span className="text-sm text-gray-500">(선택사항)</span>
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            카카오톡 오픈채팅 링크를 입력하면 참여자가 바로 연락할 수 있어요
          </p>
          <input
            type="url"
            value={openChatLink}
            onChange={(e) => setOpenChatLink(e.target.value)}
            placeholder="https://open.kakao.com/..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition-colors"
        >
          모집글 등록하기
        </button>
      </div>
    </div>
  );
}
