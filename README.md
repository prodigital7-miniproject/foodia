# Foodia - 오늘 뭐먹지 근처맛집

> 빠른 맛집 탐색과 식사 메이트 모집을 위한 모바일 우선 반응형 웹 서비스

![Foodia](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop)

## 🎯 프로젝트 개요

**Foodia**는 프로디지털아카데미 교육생들이 점심시간에 빠르게 근처 맛집을 찾고, 간단하게 식사 메이트를 구할 수 있도록 돕는 서비스입니다.

### 핵심 가치

- ⚡ **빠른 탐색:** 복잡한 정보 없이 필터로 원하는 맛집만 빠르게 찾기
- 🎯 **직관적 비교:** 카드 UI로 핵심 정보만 한눈에 비교
- 💾 **음식 이상형 월드컵:** 토너먼트 방식을 이용한 메뉴 추천 서비스
- 👥 **같이먹기:** 익명으로 간단하게 식사 메이트 모집

### MVP 범위

- **개발 기간:** 5일
- **개발 인원:** 4명
- **플랫폼:** 반응형 웹 (모바일 우선)
- **타겟 지역:** 성수역 인근 맛집

---

## 🚀 주요 기능

### 1. 지역 기반 맛집 탐색

- 식당 이름 또는 메뉴명 검색
- 음식 종류/가격대/상황별 필터
- 거리순/평점순 정렬

### 2. 맛집 상세 정보

- 기본 정보 (주소, 영업시간, 평점)
- 음식점 특징 태그
- 메뉴
- 사용자 리뷰
- 같이먹기 모집글 미리보기

### 3. 간단 리뷰 작성

- 닉네임 작
- 별점 선택
- 한줄 리뷰

### 4. 같이먹기 모집 게시판

- 닉네임을 사용한 모집글 작성
- 자세한 소개를 위한 모집글 작성
- 관심 표시 및 오픈채팅 참여

---

# Foodia 프로젝트 구조 & 기술 스택

## 기술 스택

### Frontend

| 구분            | 기술                                                                  |
| --------------- | --------------------------------------------------------------------- |
| **프레임워크**  | Next.js 15.1.0 (App Router)                                           |
| **UI**          | React 18.3                                                            |
| **언어**        | TypeScript 5.7                                                        |
| **스타일**      | Tailwind CSS 4.x                                                      |
| **아이콘**      | Lucide React                                                          |
| **UI 컴포넌트** | Radix UI, shadcn/ui 계열 (Button, Dialog, Sheet 등), MUI 7.x, Emotion |

### Backend / Data

| 구분             | 기술                                    |
| ---------------- | --------------------------------------- |
| **API**          | Next.js Route Handlers (`src/app/api/`) |
| **DB**           | PostgreSQL - Supabase                   |
| **ORM**          | Drizzle ORM                             |
| **마이그레이션** | Drizzle Kit                             |

### 기타

| 구분              | 기술                                         |
| ----------------- | -------------------------------------------- |
| **검증**          | Zod                                          |
| **패키지 매니저** | pnpm                                         |
| **환경 변수**     | `.env` (DATABASE_URL, GOOGLE_MAP_API_KEY 등) |

---

## 프로젝트 구조

```
foodia/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈 (/)
│   │   ├── api/                # API 라우트
│   │   │   ├── ideal-cup/      # 이상형 컵 (추천)
│   │   │   ├── restaurants/    # 맛집 목록·상세·등록
│   │   │   ├── review/         # 리뷰 CRUD
│   │   │   ├── search/         # 검색·자동완성
│   │   │   └── together-posts/ # 같이먹기 게시글
│   │   ├── restaurant/[id]/    # 맛집 상세 페이지
│   │   ├── review/write/[id]/  # 리뷰 작성
│   │   ├── search/             # 검색 페이지
│   │   ├── saved/              # 저장한 맛집
│   │   ├── profile/            # 프로필
│   │   ├── ideal-cup/          # 이상형 컵
│   │   └── together/           # 같이먹기 (목록·작성·상세)
│   │
│   ├── components/
│   │   ├── ui/                 # 공통 UI (Button, Dialog, Input 등)
│   │   ├── layout/             # Header, BottomNav
│   │   ├── home/               # 홈 (HomePage, TogetherSlider 등)
│   │   ├── search/             # SearchBar, SearchResults, FilterChips
│   │   ├── restaurant/         # RestaurantCard, RestaurantDetail
│   │   ├── saved/              # SavedList
│   │   ├── review/             # ReviewWrite
│   │   ├── together/           # TogetherBoard, TogetherWrite, TogetherPostDetail
│   │   ├── ideal-cup/          # IdealCupPage, Icons
│   │   ├── profile/            # ProfilePage
│   │   └── figma/              # ImageWithFallback 등
│   │
│   ├── lib/
│   │   ├── db/                 # DB 스키마, 클라이언트 (Drizzle)
│   │   ├── http/               # API 응답 헬퍼 (response.ok, response.fail)
│   │   ├── restaurant/         # map-store-to-restaurant, stores-by-food
│   │   ├── validators/         # Zod 스키마 (store, review, together-post)
│   │   └── types.ts            # Restaurant, Store, Review 등 공통 타입
│   │
│   └── styles/
│       └── tailwind.css
│
├── drizzle/                   # Drizzle 마이그레이션 SQL
├── public/                    # 정적 파일 (이미지, 아이콘)
├── scripts/                   # 시드 스크립트 (run-seed.ts 등)
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts (또는 postcss)
├── tsconfig.json
└── package.json
```

---

## 주요 API

| 경로                                       | 메서드       | 설명                                                    |
| ------------------------------------------ | ------------ | ------------------------------------------------------- |
| `/api/restaurants`                         | GET          | 맛집 목록 (필터: category, priceRange, situation, sort) |
| `/api/restaurants`                         | POST         | 맛집 등록                                               |
| `/api/restaurants/[id]`                    | GET          | 맛집 상세 (rid 기준)                                    |
| `/api/review`                              | GET          | 리뷰 목록 (rid)                                         |
| `/api/review`                              | POST         | 리뷰 작성                                               |
| `/api/search`                              | GET          | 검색 (q: 검색어, 식당명·음식명)                         |
| `/api/search/suggest`                      | GET          | 검색 자동완성                                           |
| `/api/together-posts`                      | GET          | 같이먹기 목록                                           |
| `/api/together-posts/[postId]`             | GET/PATCH 등 | 게시글 상세·수정                                        |
| `/api/together-posts/[postId]/participate` | POST         | 참여                                                    |
| `/api/ideal-cup`                           | GET          | 이상형 컵                                               |
| `/api/ideal-cup/result`                    | GET          | 이상형 컵 결과                                          |

---

## DB (Drizzle)

- **스키마**: `src/lib/db/schema.ts`
- **클라이언트**: `src/lib/db/client.ts` (pg Pool + Drizzle)
- **주요 테이블**: `stores`, `reviews`, `foods`, `store_foods`, `together_posts`, `together_participants` (스키마명: `foodia`)
## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary:** Orange (#EA580C) - 주요 CTA, 활성 상태
- **Background:** White/Gray 50 - 페이지 배경
- **Accent:** Orange 50/100 - 강조 배경
- **Text:** Gray 900/700/600/500 - 텍스트 계층

### 주요 컴포넌트

- **카드:** 그림자 + 라운드 코너 + 호버 효과
- **버튼:** 라운드 풀 + 색상 구분 (Primary/Secondary)
- **칩:** 선택/비선택 상태 명확한 구분
- **탭바:** 하단 고정 네비게이션

---

## 📱 화면 구성

### 1. 홈 (/)

- 식당 이름 및 음식 검색
- 음식 이상형 월드컵
- 음식 종류별 카테고리 버튼

### 2. 검색 결과 (/search)

- 필터 (음식 종류, 가격대, 상황)
- 정렬 (거리순, 평점순)
- 맛집 카드 리스트

### 3. 맛집 상세 (/restaurant/:id)

- 대표 이미지 + 기본 정보
- 대표 메뉴
- 리뷰 목록
- 같이먹기 게시판 미리보기

### 4. 리뷰 작성 (/review/write/:id)

- 별점 선택 (1-5점)
- 한줄 리뷰 입력

### 5. 같이먹기 게시판 (/together/:restaurantId)

- 모집글 리스트
- 관심 표시 버튼

### 6. 같이먹기 글 작성 (/together/write/:restaurantId)

- 닉네임 입력
- 모집글 입력
- 모집 인원 선택
- 오픈채팅방 링크 입력

### 8. 마이페이지 (/profile)

- 활동 통계
- 메뉴 (저장, 리뷰, 같이먹기)

---

## 👥 개발 분업 구조

### Developer 1: 검색/위치/필터

- 식당 리스트
- 식당 상세 개선
- 데이터 크롤링
- 검색 및 필터

### Developer 2: DB/리뷰

- 리뷰 작성
- 리뷰 리스트
- DB 스키마 작성
- 식당 상세 초안

### Developer 3: 음식 이상형 월드컵

- 홈 화면 및 UI
- 음식 이상형 월드컵
- 우승 메뉴 식당 추천

### Developer 4: 같이먹기

- 같이먹기 모집 게시판 조회 기능
- 같이먹기 모집 공고 글 작성 기능
- 같이먹기 모집 공고 글에 참여하기 기능

---

## 🔄 사용자 플로우

### 기본 탐색 플로우

```
홈 → 검색 → 필터 적용 → 상세 확인 → 리뷰 작성
```

### 같이먹기 플로우

```
상세 → 같이먹기 게시판 → 관심 표시 or 글 작성
```

### 같이먹기 참여 플로우

```
홈 → 같이먹기 모집 공고 → 참여하기
```

### 이상형 월드컵 플로우

```
홈 → 음식 이상형 월드컵 → 추천 음식점
```


---

## 📊 성능 및 접근성

### 성능

- 평균 별점 및 리뷰 수 기능 메모이제이션 활용

### 반응형

- 모바일 우선 반응형 웹
- 태블릿/데스크톱 대응

---

## 📝 다음 단계 (MVP 이후)

### Phase 3: 고도화

- 지도 API 연동
- 실시간 위치 기반 검색
- 이미지 업로드
- 푸시 알림

### Phase 4: 확장

- 추천 알고리즘
- 포인트 시스템

---

## 📄 문서

더 자세한 설계 문서는 [FOODIA_DESIGN_SPEC.md](./FOODIA_DESIGN_SPEC.md)를 참고하세요.

---

### 핵심 포인트

✅ 빠른 탐색 중심의 단순한 구조  
✅ 재사용 가능한 컴포넌트  
✅ 명확한 기능 분업 구조  
✅ 모바일 우선 반응형 디자인  

---

# Getting Started

pnpm i

---
