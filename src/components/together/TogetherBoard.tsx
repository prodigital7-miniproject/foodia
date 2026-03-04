"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Heart, Plus } from "lucide-react";
import { mockRestaurants, mockTogetherPosts } from "@/lib/data/mockData";
import { BottomNav } from "@/components/layout/BottomNav";

export function TogetherBoard() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  const router = useRouter();
  const [interestedPosts, setInterestedPosts] = useState<Set<string>>(new Set());

  const restaurant = mockRestaurants.find((r) => r.id === restaurantId);
  const posts = mockTogetherPosts.filter((p) => p.restaurantId === restaurantId);

  if (!restaurant) {
    return null;
  }

  const handleInterest = (postId: string) => {
    setInterestedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-orange-600" />
                <h1 className="font-semibold text-gray-900">같이먹기 모집</h1>
              </div>
              <p className="text-sm text-gray-600">{restaurant.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Restaurant Info */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 flex gap-3">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{restaurant.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{restaurant.category}</p>
            <p className="text-xs text-gray-500">{restaurant.address}</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-100">
          <p className="text-sm text-orange-900 font-medium mb-1">💡 같이먹기 안내</p>
          <ul className="text-xs text-orange-800 space-y-1">
            <li>• 익명으로 간단하게 식사 메이트를 구할 수 있어요</li>
            <li>• 관심있는 모집글에 참여 의사를 표시하세요</li>
            <li>• 오픈채팅 링크가 있다면 직접 연락할 수 있어요</li>
          </ul>
        </div>

        {/* Post Count */}
        <p className="text-sm text-gray-600 mb-4">
          {posts.length}개의 모집글이 있어요
        </p>

        {/* Posts List */}
        {posts.length > 0 ? (
          <div className="space-y-3 mb-6">
            {posts.map((post) => {
              const isInterested = interestedPosts.has(post.id);
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {post.author}
                      </span>
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      {post.timeTag}
                    </span>
                  </div>

                  <p className="text-gray-900 mb-3">{post.content}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
                      {post.situationTag}
                    </span>
                    <span className="text-xs text-gray-600">
                      {post.peopleCount}명 모집
                    </span>
                  </div>

                  {post.openChatLink && (
                    <a
                      href={post.openChatLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-orange-600 hover:underline mb-3"
                    >
                      📱 오픈채팅 참여하기
                    </a>
                  )}

                  <button
                    onClick={() => handleInterest(post.id)}
                    className={`w-full py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      isInterested
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Heart size={16} className={isInterested ? "fill-white" : ""} />
                    {isInterested ? "관심 표시함" : "관심있어요"}
                    <span className="text-xs">
                      ({post.interestCount + (isInterested ? 1 : 0)})
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 mb-6">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">아직 모집글이 없습니다</p>
            <p className="text-sm text-gray-400">첫 번째 모집글을 작성해보세요!</p>
          </div>
        )}
      </div>

      {/* Floating Write Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <Link
          href={`/together/write/${restaurantId}`}
          className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={24} />
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
