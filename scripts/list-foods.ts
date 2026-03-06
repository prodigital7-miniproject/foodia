/**
 * foods 테이블의 모든 음식 목록 조회
 * 사용: npx tsx scripts/list-foods.ts
 */
import "dotenv/config";
import { db } from "../src/lib/db/client";
import { foodTable } from "../src/lib/db/schema";

async function main() {
  const foods = await db.select({ id: foodTable.id, name: foodTable.name, category: foodTable.category }).from(foodTable);
  console.log(JSON.stringify(foods, null, 2));
  console.log("\n총", foods.length, "개 음식");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
