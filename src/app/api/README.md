# 백엔드 API (Route Handlers)

Next.js App Router에서는 **`src/app/api/`** 아래에 백엔드 API를 구현합니다.

## 구조

- **경로 = URL 경로**
  - `api/restaurants/route.ts` → `GET/POST /api/restaurants`
  - `api/restaurants/[id]/route.ts` → `GET/PATCH/DELETE /api/restaurants/:id`
  - `api/reviews/route.ts` → `GET/POST /api/reviews`

## 규칙

- 파일 이름은 반드시 **`route.ts`** (또는 `route.js`)
- HTTP 메서드별로 **export async function GET/POST/PATCH/DELETE** 등 작성
- `NextRequest` / `NextResponse` 사용 (next/server)

## 예시

```ts
// src/app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(body, { status: 201 });
}
```

프론트에서는 `fetch('/api/hello')` 로 호출하면 됩니다.
