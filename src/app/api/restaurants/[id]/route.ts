import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/restaurants/:id
 * 예: 맛집 상세 조회
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // TODO: DB에서 id로 조회
  return NextResponse.json({ success: true, data: { id, name: "" } });
}

/**
 * PATCH /api/restaurants/:id
 * PUT /api/restaurants/:id
 * DELETE /api/restaurants/:id
 * 등 필요한 메서드도 같은 파일에 export async function 으로 추가하면 됩니다.
 */
