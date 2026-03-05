/**
 * scripts/seed-together-posts.sql 실행
 * 사용: npm run db:seed
 */
import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL이 .env에 없습니다.");
  process.exit(1);
}

const sqlPath = join(__dirname, "seed-together-posts.sql");
let sql = readFileSync(sqlPath, "utf-8");

// 주석 제거 후 문장 단위로 분리 (node-pg는 한 번에 여러 문 미지원)
sql = sql.replace(/^\s*--[^\n]*\n?/gm, "").trim();
const statements = sql
  .split(/\s*;\s*\n/)
  .map((s) => s.trim())
  .filter(Boolean);

async function run() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  try {
    for (const statement of statements) {
      await pool.query(statement);
    }
    console.log("✅ seed-together-posts.sql 실행 완료. (총 %d개 문장)", statements.length);
  } catch (e) {
    console.error("❌ 실행 실패:", e);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
