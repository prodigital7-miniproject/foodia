import { sql, relations } from "drizzle-orm";
import {
  bigserial,
  bigint,
  boolean,
  check,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

const appSchema = pgSchema("foodia");

export const storeTable = appSchema.table(
  "stores",
  {
    rid: varchar("rid", { length: 255 }).primaryKey(),

    // 필수값
    name: varchar("name", { length: 100 }).notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    address: varchar("address", { length: 255 }).notNull(),

    // 원본 보관용
    categories: jsonb("categories").$type<string[]>(),
    diningcodeScore: integer("diningcode_score"),
    addressJibun: varchar("address_jibun", { length: 255 }),
    phone: varchar("phone", { length: 30 }),
    hoursSummary: text("hours_summary"),
    hoursDetail: jsonb("hours_detail").$type<unknown[]>(),
    purposeTags: jsonb("purpose_tags").$type<string[]>(),
    featureTags: jsonb("feature_tags").$type<string[]>(),
    menu: jsonb("menu").$type<
      {
        name: string;
        price: string;
        rank: string;
        order_pct: string;
      }[]
    >(),

    // 기존 컬럼
    distance: integer("distance"),
    priceRange: varchar("price_range", { length: 20 }),
    imgUrl: varchar("img_url", { length: 255 }),
    description: text("description"),

    // 크롤링 원본
    distanceM: integer("distance_m"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),

    foodPriceRange: varchar("food_price_range", { length: 30 }),
    cuisineType: varchar("cuisine_type", { length: 30 }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),

    isDeleted: boolean("is_deleted").notNull().default(false),
  },
  (table: Parameters<Parameters<typeof appSchema.table>[2]>[0]) => [
    index("stores_idx_category").on(table.category),
    index("stores_idx_name").on(table.name),
    index("stores_idx_diningcode_score").on(table.diningcodeScore),
  ],
);

/**
 * foods
 */
export const foodTable = appSchema.table(
  "foods",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    name: varchar("name", { length: 30 }).notNull(),
  },
  (table: Parameters<Parameters<typeof appSchema.table>[2]>[0]) => [
    index("foods_idx_name").on(table.name),
    uniqueIndex("foods_unique_name").on(table.name),
  ],
);

/**
 * reviews
 */
export const reviewTable = appSchema.table(
  "reviews",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    rid: varchar("rid", { length: 255 })
      .notNull()
      .references(() => storeTable.rid, { onDelete: "cascade" }),
    nickname: varchar("nickname", { length: 50 }).notNull(),
    imgUrl: varchar("img_url", { length: 255 }),
    rating: integer("rating").notNull(),
    content: varchar("content", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table: Parameters<Parameters<typeof appSchema.table>[2]>[0]) => [
    check(
      "reviews_rating_check",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
    index("reviews_idx_rid").on(table.rid),
    index("reviews_idx_nickname").on(table.nickname),
  ],
);

/**
 * store_foods
 * 음식(food) - 식당(store) 연결 테이블
 */
export const storeFoodTable = appSchema.table(
  "store_foods",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    foodId: bigint("food_id", { mode: "number" })
      .notNull()
      .references(() => foodTable.id, { onDelete: "cascade" }),
    rid: varchar("rid", { length: 255 })
      .notNull()
      .references(() => storeTable.rid, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table: Parameters<Parameters<typeof appSchema.table>[2]>[0]) => [
    index("store_foods_idx_food_id").on(table.foodId),
    index("store_foods_idx_rid").on(table.rid),
    uniqueIndex("store_foods_unique_rid_food").on(table.rid, table.foodId),
  ],
);

/**
 * together_posts
 */
export const togetherPostTable = appSchema.table(
  "together_posts",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    rid: varchar("rid", { length: 255 })
      .notNull()
      .references(() => storeTable.rid, { onDelete: "cascade" }),
    title: varchar("title", { length: 100 }).notNull(),
    content: varchar("content", { length: 300 }).notNull(),
    /** 작성자 실명 (로그인 없이 입력) */
    authorName: varchar("author_name", { length: 50 }).notNull(),
    /** 모집 인원 수 (1 이상) */
    maxParticipants: integer("max_participants").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("open"),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table: Parameters<Parameters<typeof appSchema.table>[2]>[0]) => [
    check(
      "together_posts_status_check",
      sql`${table.status} IN ('open', 'closed')`,
    ),
    check(
      "together_posts_max_participants_check",
      sql`${table.maxParticipants} >= 1`,
    ),
    index("together_posts_idx_rid").on(table.rid),
    index("together_posts_idx_status").on(table.status),
  ],
);

/**
 * together_participants
 */
export const togetherParticipantTable = appSchema.table(
  "together_participants",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    togetherPostId: bigint("together_post_id", { mode: "number" })
      .notNull()
      .references(() => togetherPostTable.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 50 }).notNull(),
    joinedAt: timestamp("joined_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table: Parameters<Parameters<typeof appSchema.table>[2]>[0]) => [
    index("together_participants_idx_post_id").on(table.togetherPostId),
    index("together_participants_idx_user_id").on(table.userId),
    uniqueIndex("together_participants_unique_post_user").on(
      table.togetherPostId,
      table.userId,
    ),
  ],
);

/* =========================
   Relations
========================= */

type RelationHelpers = Parameters<typeof relations>[1] extends (
  h: infer H,
) => unknown
  ? H
  : never;

export const storeRelations = relations(
  storeTable,
  ({ many }: RelationHelpers) => ({
    reviews: many(reviewTable),
    storeFoods: many(storeFoodTable),
    togetherPosts: many(togetherPostTable),
  }),
);

export const foodRelations = relations(
  foodTable,
  ({ many }: RelationHelpers) => ({
    storeFoods: many(storeFoodTable),
  }),
);

export const reviewRelations = relations(
  reviewTable,
  ({ one }: RelationHelpers) => ({
    store: one(storeTable, {
      fields: [reviewTable.rid],
      references: [storeTable.rid],
    }),
  }),
);

export const storeFoodRelations = relations(
  storeFoodTable,
  ({ one }: RelationHelpers) => ({
    food: one(foodTable, {
      fields: [storeFoodTable.foodId],
      references: [foodTable.id],
    }),
    store: one(storeTable, {
      fields: [storeFoodTable.rid],
      references: [storeTable.rid],
    }),
  }),
);

export const togetherPostRelations = relations(
  togetherPostTable,
  ({ one, many }: RelationHelpers) => ({
    store: one(storeTable, {
      fields: [togetherPostTable.rid],
      references: [storeTable.rid],
    }),
    participants: many(togetherParticipantTable),
  }),
);

export const togetherParticipantRelations = relations(
  togetherParticipantTable,
  ({ one }: RelationHelpers) => ({
    togetherPost: one(togetherPostTable, {
      fields: [togetherParticipantTable.togetherPostId],
      references: [togetherPostTable.id],
    }),
  }),
);
