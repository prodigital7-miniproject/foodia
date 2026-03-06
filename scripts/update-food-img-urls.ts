/**
 * foods 테이블의 img_url을 /images/food-icons/[name].png 로 일괄 업데이트
 * 사용: npx tsx scripts/update-food-img-urls.ts
 */
import "dotenv/config";
import { db } from "../src/lib/db/client";
import { foodTable } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const foods = await db
    .select({ id: foodTable.id, name: foodTable.name })
    .from(foodTable);

  let updated = 0;
  for (const food of foods) {
    const imgUrl = `/images/food-icons/${food.name}.png`;
    await db
      .update(foodTable)
      .set({ imgUrl })
      .where(eq(foodTable.id, food.id));
    updated++;
    console.log(`[${updated}/${foods.length}] ${food.name} → ${imgUrl}`);
  }

  console.log("\n✅ img_url 업데이트 완료. 총", updated, "건");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
