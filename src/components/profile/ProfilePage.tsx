"use client";

import { User, Star, Bookmark, MessageCircle, Settings } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">마이페이지</h1>
          <p className="text-sm text-gray-600">내 활동 내역을 확인하세요</p>
        </div>
      </div>
      <div className="flex-grow">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-orange-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-1">익명 사용자</h2>
              <p className="text-sm text-gray-600">맛집 탐험가</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 mb-1">3</p>
              <p className="text-xs text-gray-600">저장한 맛집</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 mb-1">5</p>
              <p className="text-xs text-gray-600">작성한 리뷰</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 mb-1">2</p>
              <p className="text-xs text-gray-600">같이먹기</p>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="space-y-3">
          <button className="w-full bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between hover:border-orange-300 transition-colors">
            <div className="flex items-center gap-3">
              <Bookmark size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">저장한 맛집</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between hover:border-orange-300 transition-colors">
            <div className="flex items-center gap-3">
              <Star size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">내 리뷰</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between hover:border-orange-300 transition-colors">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">내 같이먹기 글</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between hover:border-orange-300 transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">설정</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 bg-orange-50 rounded-lg p-4 border border-orange-100">
          <p className="text-sm text-orange-900 font-medium mb-2">🎉 서비스 안내</p>
          <p className="text-xs text-orange-800">
            Foodia는 현재 베타 서비스입니다. 더 나은 서비스를 위해 여러분의 피드백을 기다립니다!
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
