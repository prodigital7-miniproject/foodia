"use client";

import { Star, MapPin, Bookmark } from "lucide-react";
import Link from "next/link";
import { Restaurant } from "@/lib/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onBookmark?: (id: string) => void;
}

export function RestaurantCard({ restaurant, onBookmark }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onBookmark?.(restaurant.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Bookmark
              size={18}
              className={restaurant.isBookmarked ? "fill-orange-600 text-orange-600" : "text-gray-600"}
            />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{restaurant.name}</h3>
              <p className="text-sm text-gray-500">{restaurant.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-orange-400 text-orange-400" />
              <span className="text-sm font-medium text-gray-900">{restaurant.rating}</span>
              <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
            </div>
            <span className="text-xs text-gray-400">•</span>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{restaurant.distance}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {restaurant.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            <span className="text-xs text-gray-500">{restaurant.priceRange}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
