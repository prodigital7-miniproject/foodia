import { db } from "@/lib/db/client";
import response from "@/lib/http/response";
import { NextRequest } from "next/server";
import { z } from "zod";
import { storeTable } from "@/lib/db/schema";
import { createStoreSchema } from "@/lib/validators/store/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createStoreSchema.safeParse(body);
  if (!result.success) {
    return response.fail(JSON.stringify(z.treeifyError(result.error)));
  }
  const store = await db.insert(storeTable).values(result.data).returning();
  return response.ok(store, { status: 201 });
}
