# Foodia - 오늘 뭐먹지 근처맛집

> 빠른 맛집 탐색과 식사 메이트 모집을 위한 모바일 우선 반응형 웹 서비스

![Foodia](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop)

## 🎯 프로젝트 개요

**Foodia**는 사용자가 점심/저녁 시간에 빠르게 근처 맛집을 찾고, 간단하게 식사 메이트를 구할 수 있도록 돕는 서비스입니다.

### 핵심 가치

- ⚡ **빠른 탐색:** 복잡한 정보 없이 필터로 원하는 맛집만 빠르게 찾기
- 🎯 **직관적 비교:** 카드 UI로 핵심 정보만 한눈에 비교
- 💾 **저장 기능:** 마음에 드는 맛집을 저장해서 나중에 방문
- 👥 **같이먹기:** 익명으로 간단하게 식사 메이트 모집

### MVP 범위

- **개발 기간:** 5일
- **개발 인원:** 4명
- **플랫폼:** 반응형 웹 (모바일 우선)
- **타겟 지역:** 성수역 인근 맛집

---

## 🚀 주요 기능

### 1. 지역 기반 맛집 탐색

- 내 주변 또는 지역명 검색
- 음식 종류/가격대/상황별 필터
- 거리순/평점순 정렬

### 2. 맛집 상세 정보

- 기본 정보 (주소, 영업시간, 평점)
- 대표 메뉴
- 사용자 리뷰
- 같이먹기 모집글 미리보기

### 3. 간단 리뷰 작성

- 별점 선택
- 한줄 리뷰
- 태그 선택 (가성비, 분위기좋음 등)

### 4. 저장 목록

- 북마크한 맛집 모아보기
- 상황별 필터
- 빠른 재방문

### 5. 같이먹기 모집 게시판

- 익명 모집글 작성
- 시간대/상황 태그 선택
- 관심 표시 및 오픈채팅 참여

---

## 🛠️ 기술 스택

### Frontend

- **React 18.3.1** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **React Router 7.13.0** - 클라이언트 사이드 라우팅
- **Tailwind CSS 4.1** - 유틸리티 기반 스타일링

### UI Components

- **Radix UI** - 접근성 높은 기본 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### State Management

- **React Hooks** - 로컬 상태 관리
- **LocalStorage** - 북마크 영속성

---

## 📂 프로젝트 구조

```
/src
  /app
    /components
      Header.tsx             # 상단 헤더
      SearchBar.tsx          # 검색 입력창
      FilterChips.tsx        # 필터 칩 리스트
      RestaurantCard.tsx     # 맛집 카드
      CategoryButton.tsx     # 카테고리 버튼
    /pages
      Home.tsx               # 홈 화면
      SearchResults.tsx      # 검색 결과
      RestaurantDetail.tsx   # 맛집 상세
      ReviewWrite.tsx        # 리뷰 작성
      SavedList.tsx          # 저장 목록
      TogetherBoard.tsx      # 같이먹기 게시판
      TogetherWrite.tsx      # 같이먹기 글 작성
      Profile.tsx            # 마이페이지
    /data
      mockData.ts            # 목 데이터 (성수역 맛집)
    routes.ts                # 라우팅 설정
    types.ts                 # 타입 정의
    App.tsx                  # 메인 앱
```

---

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

- 지역 검색 입력창
- "내 주변 맛집 찾기" CTA
- 자주 찾는 지역 빠른 선택
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
- 태그 선택

### 5. 저장 목록 (/saved)

- 북마크한 맛집 리스트
- 상황별 필터

### 6. 같이먹기 게시판 (/together/:restaurantId)

- 모집글 리스트
- 관심 표시 버튼

### 7. 같이먹기 글 작성 (/together/write/:restaurantId)

- 모집글 입력
- 시간대/상황 선택
- 모집 인원 선택

### 8. 마이페이지 (/profile)

- 활동 통계
- 메뉴 (저장, 리뷰, 같이먹기)

---

## 👥 개발 분업 구조

### Developer 1: 검색/위치/필터

- 홈 화면
- 검색 결과
- 필터 로직

### Developer 2: 상세/리뷰

- 맛집 상세
- 리뷰 작성
- 리뷰 리스트

### Developer 3: 저장 기능

- 저장 목록
- 북마크 상태 관리

### Developer 4: 같이먹기 + 공통 UI

- 같이먹기 게시판
- 같이먹기 글 작성
- 공통 레이아웃

---

## 🔄 사용자 플로우

### 기본 탐색 플로우

```
홈 → 검색 → 필터 적용 → 상세 확인 → 저장 or 리뷰 작성
```

### 같이먹기 플로우

```
상세 → 같이먹기 게시판 → 관심 표시 or 글 작성
```

---

## ⏱️ 5일 개발 일정

### Day 1: 기본 구조

- 프로젝트 초기 설정
- 라우팅 구조
- 공통 컴포넌트

### Day 2: 핵심 탐색

- 홈 화면
- 검색 결과
- 필터/정렬

### Day 3: 상세/리뷰

- 맛집 상세
- 리뷰 작성

### Day 4: 저장/같이먹기

- 저장 목록
- 같이먹기 게시판

### Day 5: 통합/완성도

- 전체 플로우 테스트
- 반응형 검증
- UI 개선

---

## 📊 성능 및 접근성

### 성능

- 목 데이터로 빠른 응답
- 이미지 최적화 (Unsplash)
- 컴포넌트 메모이제이션

### 접근성

- Semantic HTML
- ARIA 레이블
- 키보드 네비게이션
- 충분한 색상 대비

### 반응형

- 모바일 우선 (320px~)
- 최대 너비 제한 (448px)
- 태블릿/데스크톱 대응

---

## 📝 다음 단계 (MVP 이후)

### Phase 2: 백엔드 연동

- Supabase 인증 및 데이터베이스
- 실제 맛집 데이터 API
- 서버 저장 (리뷰, 북마크)

### Phase 3: 고도화

- 카카오맵 API 연동
- 실시간 위치 기반 검색
- 이미지 업로드
- 푸시 알림

### Phase 4: 확장

- 다른 지역 추가
- 추천 알고리즘
- 포인트 시스템

---

## 📄 문서

더 자세한 설계 문서는 [FOODIA_DESIGN_SPEC.md](./FOODIA_DESIGN_SPEC.md)를 참고하세요.

---

## 🎉 MVP 완성!

이 프로젝트는 **4명의 개발자가 5일 안에 구현 가능한 현실적인 MVP**로 설계되었습니다.

### 핵심 포인트

✅ 빠른 탐색 중심의 단순한 구조  
✅ 재사용 가능한 컴포넌트  
✅ 명확한 기능 분업 구조  
✅ 모바일 우선 반응형 디자인  
✅ 목 데이터로 즉시 동작

---

**Made with ❤️ by Foodia Team**

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
