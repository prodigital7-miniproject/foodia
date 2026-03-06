"use client";

import { Star, MapPin, Bookmark } from "lucide-react";
import Link from "next/link";
import { Restaurant } from "@/lib/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex overflow-hidden">

       {/* 이미지 — 왼쪽 고정 */}
<div className="relative w-28 sm:w-36 shrink-0 overflow-hidden">
  <img
    src={restaurant.imageUrl}
    alt={restaurant.name}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  />
</div>

{/* 콘텐츠 — 오른쪽 */}
<div className="flex-1 p-3 flex flex-col justify-start min-w-0 gap-1">
          <div>
           {/* 이름 */}
<div className="flex items-start justify-between gap-2 mb-1">
  <h3 className="font-bold text-gray-900 text-sm leading-snug truncate">
    {restaurant.name}
  </h3>
  
</div>

{/* 카테고리 뱃지 — 이름 바로 아래 */}
<span className="inline-block mb-1.5 text-[11px] font-semibold text-gray-400">
  {restaurant.category}
</span>

            {/* 평점 + 거리 */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-0.5">
                <Star size={12} className="fill-orange-400 text-orange-400" />
                <span className="font-semibold text-gray-700">{restaurant.rating}</span>
                <span className="text-gray-400">({restaurant.reviewCount})</span>
              </span>
              <span className="text-gray-200">|</span>
              <span className="flex items-center gap-0.5">
                <MapPin size={11} className="text-gray-400" />
                {restaurant.distance}
              </span>
            </div>
          </div>

          {/* 태그 + 가격 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              {restaurant.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-500 text-[11px] font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-400 shrink-0">{restaurant.priceRange}</span>
          </div>
        </div>

      </div>
    </Link>
  );
}