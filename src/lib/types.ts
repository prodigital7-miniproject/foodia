// Type definitions for Foodia

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  distance: string;
  priceRange: string;
  tags: string[];
  address: string;
  hours: string;
  menuItems: MenuItem[];
  reviews: Review[];
  isBookmarked?: boolean;
}

export interface MenuItem {
  name: string;
  price: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  tags: string[];
  date: string;
}

export interface TogetherPost {
  id: string;
  restaurantId: string;
  restaurantName: string;
  author: string;
  content: string;
  timeTag: string;
  situationTag: string;
  peopleCount: number;
  interestCount: number;
  date: string;
  openChatLink?: string;
}

export type FoodCategory = "전체" | "한식" | "중식" | "일식" | "양식" | "카페";
export type PriceRange = "전체" | "1만원 이하" | "1-2만원" | "2만원 이상";
export type SituationTag = "전체" | "혼밥" | "데이트" | "친구모임";
export type SortOption = "distance" | "rating";
