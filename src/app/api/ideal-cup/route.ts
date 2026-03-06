import { db } from "@/lib/db/client";
import response from "@/lib/http/response";
import { NextRequest } from "next/server";
import { foodTable } from "@/lib/db/schema"; 

export async function GET(request: NextRequest) {
  const result = await db
    .select()
    .from(foodTable);

  return response.ok(result, { status: 200 });
}