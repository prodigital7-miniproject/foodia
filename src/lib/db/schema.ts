import { sql, relations } from "drizzle-orm";
import {
  bigserial,
  bigint,
  boolean,
  check,
  index,
  integer,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

const appSchema = pgSchema("foodia");

/**
 * stores
 */
export const storeTable = appSchema.table(
  "stores",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    distance: integer("distance"),
    priceRange: varchar("price_range", { length: 20 }),
    imgUrl: varchar("img_url", { length: 255 }),
    description: text("description"),
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
  ],
);

/**
 * reviews
 */
export const reviewTable = appSchema.table(
  "reviews",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    storeId: bigint("store_id", { mode: "number" })
      .notNull()
      .references(() => storeTable.id, { onDelete: "cascade" }),
    authorId: varchar("author_id", { length: 50 }).notNull(),
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
    index("reviews_idx_store_id").on(table.storeId),
    index("reviews_idx_author_id").on(table.authorId),
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
    storeId: bigint("store_id", { mode: "number" })
      .notNull()
      .references(() => storeTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table: Parameters<Parameters<typeof appSchema.table>[2]>[0]) => [
    index("store_foods_idx_food_id").on(table.foodId),
    index("store_foods_idx_store_id").on(table.storeId),
    uniqueIndex("store_foods_unique_store_food").on(
      table.storeId,
      table.foodId,
    ),
  ],
);

/**
 * together_posts
 */
export const togetherPostTable = appSchema.table(
  "together_posts",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    storeId: bigint("store_id", { mode: "number" })
      .notNull()
      .references(() => storeTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 100 }).notNull(),
    content: varchar("content", { length: 300 }).notNull(),
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
    index("together_posts_idx_store_id").on(table.storeId),
    index("together_posts_idx_status").on(table.status),
  ],
);

/**
 * together_participants
 * - id: 별도 PK + auto increment
 * - togetherPostId: together_posts.id FK
 * - 같은 게시글에 같은 userId 중복 참여 방지
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
      fields: [reviewTable.storeId],
      references: [storeTable.id],
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
      fields: [storeFoodTable.storeId],
      references: [storeTable.id],
    }),
  }),
);

export const togetherPostRelations = relations(
  togetherPostTable,
  ({ one, many }: RelationHelpers) => ({
    store: one(storeTable, {
      fields: [togetherPostTable.storeId],
      references: [storeTable.id],
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
