# 기능/도메인 기반 컴포넌트 구조

도메인별로 컴포넌트를 그룹화한 구조입니다.

## 디렉터리 구조

```
components/
├── home/           # 홈 (메인)
│   ├── HomePage.tsx
│   └── CategoryButton.tsx
├── search/        # 검색
│   ├── SearchResults.tsx
│   ├── SearchBar.tsx
│   └── FilterChips.tsx
├── restaurant/    # 맛집
│   ├── RestaurantDetail.tsx
│   └── RestaurantCard.tsx
├── review/        # 리뷰
│   └── ReviewWrite.tsx
├── saved/         # 저장 목록
│   └── SavedList.tsx
├── together/      # 같이먹기
│   ├── TogetherBoard.tsx
│   └── TogetherWrite.tsx
├── profile/       # 마이페이지
│   └── ProfilePage.tsx
├── layout/        # 공통 레이아웃
│   └── Header.tsx
├── ui/            # 공통 UI 프리미티브 (버튼, 카드 등)
└── figma/         # Figma 연동 컴포넌트
```

## app/ 라우트와의 매핑

- `app/page.tsx` → `components/home/HomePage`
- `app/search/page.tsx` → `components/search/SearchResults`
- `app/restaurant/[id]/page.tsx` → `components/restaurant/RestaurantDetail`
- `app/review/write/[id]/page.tsx` → `components/review/ReviewWrite`
- `app/saved/page.tsx` → `components/saved/SavedList`
- `app/together/[restaurantId]/page.tsx` → `components/together/TogetherBoard`
- `app/together/write/[restaurantId]/page.tsx` → `components/together/TogetherWrite`
- `app/profile/page.tsx` → `components/profile/ProfilePage`

공통 타입/데이터는 `lib/types.ts`, `lib/data/` 에서 import 하세요.
