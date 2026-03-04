import { NextResponse } from "next/server";

/**
 * GET /api/restaurants
 * 예: 맛집 목록 조회 API
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const category = searchParams.get("category");

  // TODO: DB 조회 또는 외부 API 호출
  // const data = await db.restaurants.findMany({ where: { ... } });

  return NextResponse.json({
    success: true,
    data: [],
    query: { location, category },
  });
}

/**
 * POST /api/restaurants
 * 예: 맛집 등록 API
 */
export async function POST(request: Request) {
  const body = await request.json();
  // TODO: DB 저장 등
  return NextResponse.json({ success: true, id: "new-id" }, { status: 201 });
}
