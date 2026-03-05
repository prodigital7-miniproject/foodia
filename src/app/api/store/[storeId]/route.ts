import { db } from "@/lib/db/client";
import { storeTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { storeId: string } },
) {
  const { storeId } = await params;
  const store = await db.query.storeTable.findFirst({
    where: eq(storeTable.rid, storeId),
  });

  if (!store) {
    return NextResponse.json(
      { success: false, message: "맛집을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: store }, { status: 200 });
}
