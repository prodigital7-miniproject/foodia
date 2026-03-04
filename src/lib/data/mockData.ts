// Mock data for Foodia - 성수역 인근 맛집

import { Restaurant, TogetherPost } from "../types";

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "성수연방",
    category: "한식",
    imageUrl: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=80",
    rating: 4.5,
    reviewCount: 234,
    distance: "250m",
    priceRange: "1-2만원",
    tags: ["분위기좋음", "데이트"],
    address: "서울 성동구 성수동2가 289-5",
    hours: "11:00 - 22:00",
    menuItems: [
      { name: "제육볶음", price: "12,000원" },
      { name: "김치찌개", price: "10,000원" },
      { name: "된장찌개", price: "10,000원" }
    ],
    reviews: [
      {
        id: "r1",
        author: "맛집탐험가",
        rating: 5,
        content: "분위기도 좋고 음식도 맛있어요. 데이트 코스로 추천합니다!",
        tags: ["분위기좋음", "데이트"],
        date: "2026-02-25"
      },
      {
        id: "r2",
        author: "성수주민",
        rating: 4,
        content: "제육볶음이 진짜 맛있어요. 양도 푸짐합니다.",
        tags: ["가성비", "양많음"],
        date: "2026-02-24"
      }
    ]
  },
  {
    id: "2",
    name: "테라로사 커피",
    category: "카페",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    rating: 4.7,
    reviewCount: 456,
    distance: "180m",
    priceRange: "1만원 이하",
    tags: ["조용함", "혼밥"],
    address: "서울 성동구 성수동1가 685-370",
    hours: "09:00 - 21:00",
    menuItems: [
      { name: "아메리카노", price: "5,500원" },
      { name: "카페라떼", price: "6,000원" },
      { name: "케이크 세트", price: "9,000원" }
    ],
    reviews: [
      {
        id: "r3",
        author: "커피애호가",
        rating: 5,
        content: "성수에서 최고의 커피 맛! 분위기도 좋아요.",
        tags: ["조용함", "분위기좋음"],
        date: "2026-02-26"
      }
    ]
  },
  {
    id: "3",
    name: "나폴레옹 파스타바",
    category: "양식",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    rating: 4.3,
    reviewCount: 189,
    distance: "320m",
    priceRange: "1-2만원",
    tags: ["가성비", "친구모임"],
    address: "서울 성동구 성수동2가 319-14",
    hours: "11:30 - 21:30",
    menuItems: [
      { name: "알리오올리오", price: "13,000원" },
      { name: "크림파스타", price: "14,000원" },
      { name: "토마토파스타", price: "13,500원" }
    ],
    reviews: [
      {
        id: "r4",
        author: "파스타러버",
        rating: 4,
        content: "가격대비 맛이 좋아요. 양도 넉넉합니다.",
        tags: ["가성비", "양많음"],
        date: "2026-02-25"
      },
      {
        id: "r5",
        author: "성수직장인",
        rating: 5,
        content: "점심 먹기 좋은 곳입니다. 회사 동료들과 자주 가요.",
        tags: ["친구모임"],
        date: "2026-02-23"
      }
    ]
  },
  {
    id: "4",
    name: "성수돈까스",
    category: "일식",
    imageUrl: "https://images.unsplash.com/photo-1628191081676-8f40d6b5c187?w=800&q=80",
    rating: 4.6,
    reviewCount: 312,
    distance: "420m",
    priceRange: "1만원 이하",
    tags: ["가성비", "혼밥"],
    address: "서울 성동구 성수동1가 656-340",
    hours: "11:00 - 20:30",
    menuItems: [
      { name: "등심돈까스", price: "9,000원" },
      { name: "치즈돈까스", price: "10,000원" },
      { name: "카레돈까스", price: "9,500원" }
    ],
    reviews: [
      {
        id: "r6",
        author: "돈까스덕후",
        rating: 5,
        content: "가성비 최고! 돈까스가 정말 바삭하고 맛있어요.",
        tags: ["가성비", "맛있음"],
        date: "2026-02-27"
      }
    ]
  },
  {
    id: "5",
    name: "청기와 중국집",
    category: "중식",
    imageUrl: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=800&q=80",
    rating: 4.2,
    reviewCount: 167,
    distance: "550m",
    priceRange: "1-2만원",
    tags: ["양많음", "친구모임"],
    address: "서울 성동구 성수동2가 277-120",
    hours: "11:00 - 21:00",
    menuItems: [
      { name: "짜장면", price: "7,000원" },
      { name: "짬뽕", price: "8,000원" },
      { name: "탕수육(소)", price: "18,000원" }
    ],
    reviews: [
      {
        id: "r7",
        author: "중식좋아",
        rating: 4,
        content: "탕수육이 진짜 맛있어요. 소스도 직접 만드신다고.",
        tags: ["양많음", "맛있음"],
        date: "2026-02-26"
      }
    ]
  },
  {
    id: "6",
    name: "더 하이엔드",
    category: "양식",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    rating: 4.8,
    reviewCount: 523,
    distance: "680m",
    priceRange: "2만원 이상",
    tags: ["분위기좋음", "데이트"],
    address: "서울 성동구 성수동2가 320-37",
    hours: "17:00 - 23:00",
    menuItems: [
      { name: "안심 스테이크", price: "35,000원" },
      { name: "랍스터 파스타", price: "32,000원" },
      { name: "와인 세트", price: "28,000원" }
    ],
    reviews: [
      {
        id: "r8",
        author: "데이트고수",
        rating: 5,
        content: "특별한 날 가기 좋아요. 분위기 최고!",
        tags: ["분위기좋음", "데이트"],
        date: "2026-02-24"
      }
    ]
  },
  {
    id: "7",
    name: "소담 한정식",
    category: "한식",
    imageUrl: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&q=80",
    rating: 4.4,
    reviewCount: 245,
    distance: "720m",
    priceRange: "2만원 이상",
    tags: ["조용함", "분위기좋음"],
    address: "서울 성동구 성수동1가 685-412",
    hours: "12:00 - 21:00",
    menuItems: [
      { name: "소담 정식", price: "25,000원" },
      { name: "특선 한정식", price: "35,000원" },
      { name: "계절 특선", price: "30,000원" }
    ],
    reviews: [
      {
        id: "r9",
        author: "한식러버",
        rating: 4,
        content: "한상 가득 나오는 반찬이 정갈하고 맛있어요.",
        tags: ["조용함", "분위기좋음"],
        date: "2026-02-25"
      }
    ]
  },
  {
    id: "8",
    name: "성수베이글",
    category: "카페",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    rating: 4.5,
    reviewCount: 678,
    distance: "290m",
    priceRange: "1만원 이하",
    tags: ["혼밥", "가성비"],
    address: "서울 성동구 성수동1가 656-25",
    hours: "08:00 - 20:00",
    menuItems: [
      { name: "플레인 베이글", price: "3,500원" },
      { name: "크림치즈 베이글", price: "5,000원" },
      { name: "아메리카노", price: "4,500원" }
    ],
    reviews: [
      {
        id: "r10",
        author: "베이글마니아",
        rating: 5,
        content: "갓 구운 베이글이 정말 맛있어요. 아침 먹기 좋아요!",
        tags: ["가성비", "맛있음"],
        date: "2026-02-27"
      }
    ]
  }
];

export const mockTogetherPosts: TogetherPost[] = [
  {
    id: "t1",
    restaurantId: "1",
    restaurantName: "성수연방",
    author: "익명 A",
    content: "오늘 점심 같이 드실 분 구해요! 제육볶음 먹고 싶어요",
    timeTag: "오늘 점심",
    situationTag: "혼밥 탈출",
    peopleCount: 1,
    interestCount: 3,
    date: "2026-02-27"
  },
  {
    id: "t2",
    restaurantId: "3",
    restaurantName: "나폴레옹 파스타바",
    author: "익명 B",
    content: "파스타 먹으러 같이 갈 사람! 지금 바로 갈 수 있어요",
    timeTag: "지금",
    situationTag: "점심메이트",
    peopleCount: 2,
    interestCount: 5,
    date: "2026-02-27",
    openChatLink: "https://open.kakao.com/example"
  },
  {
    id: "t3",
    restaurantId: "2",
    restaurantName: "테라로사 커피",
    author: "익명 C",
    content: "카페에서 공부하실 분 있나요? 조용히 각자 할 일 하면서",
    timeTag: "오늘 오후",
    situationTag: "카페",
    peopleCount: 1,
    interestCount: 2,
    date: "2026-02-27"
  }
];
