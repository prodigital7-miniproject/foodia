CREATE TABLE "foodia"."foods" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foodia"."reviews" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"rid" varchar(255) NOT NULL,
	"nickname" varchar(50) NOT NULL,
	"img_url" varchar(255),
	"rating" integer NOT NULL,
	"content" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_rating_check" CHECK ("foodia"."reviews"."rating" >= 1 AND "foodia"."reviews"."rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "foodia"."store_foods" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"food_id" bigint NOT NULL,
	"rid" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foodia"."stores" (
	"rid" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"categories" jsonb,
	"diningcode_score" integer,
	"address_jibun" varchar(255),
	"phone" varchar(30),
	"hours_summary" text,
	"hours_detail" jsonb,
	"purpose_tags" jsonb,
	"feature_tags" jsonb,
	"menu" jsonb,
	"distance" integer,
	"price_range" varchar(20),
	"img_url" varchar(255),
	"description" text,
	"distance_m" integer,
	"lat" double precision,
	"lng" double precision,
	"food_price_range" varchar(30),
	"cuisine_type" varchar(30),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foodia"."together_participants" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"together_post_id" bigint NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foodia"."together_posts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"rid" varchar(255) NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" varchar(300) NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "together_posts_status_check" CHECK ("foodia"."together_posts"."status" IN ('open', 'closed'))
);
--> statement-breakpoint
ALTER TABLE "foodia"."reviews" ADD CONSTRAINT "reviews_rid_stores_rid_fk" FOREIGN KEY ("rid") REFERENCES "foodia"."stores"("rid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foodia"."store_foods" ADD CONSTRAINT "store_foods_food_id_foods_id_fk" FOREIGN KEY ("food_id") REFERENCES "foodia"."foods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foodia"."store_foods" ADD CONSTRAINT "store_foods_rid_stores_rid_fk" FOREIGN KEY ("rid") REFERENCES "foodia"."stores"("rid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foodia"."together_participants" ADD CONSTRAINT "together_participants_together_post_id_together_posts_id_fk" FOREIGN KEY ("together_post_id") REFERENCES "foodia"."together_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foodia"."together_posts" ADD CONSTRAINT "together_posts_rid_stores_rid_fk" FOREIGN KEY ("rid") REFERENCES "foodia"."stores"("rid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "foods_idx_name" ON "foodia"."foods" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "foods_unique_name" ON "foodia"."foods" USING btree ("name");--> statement-breakpoint
CREATE INDEX "reviews_idx_rid" ON "foodia"."reviews" USING btree ("rid");--> statement-breakpoint
CREATE INDEX "reviews_idx_nickname" ON "foodia"."reviews" USING btree ("nickname");--> statement-breakpoint
CREATE INDEX "store_foods_idx_food_id" ON "foodia"."store_foods" USING btree ("food_id");--> statement-breakpoint
CREATE INDEX "store_foods_idx_rid" ON "foodia"."store_foods" USING btree ("rid");--> statement-breakpoint
CREATE UNIQUE INDEX "store_foods_unique_rid_food" ON "foodia"."store_foods" USING btree ("rid","food_id");--> statement-breakpoint
CREATE INDEX "stores_idx_category" ON "foodia"."stores" USING btree ("category");--> statement-breakpoint
CREATE INDEX "stores_idx_name" ON "foodia"."stores" USING btree ("name");--> statement-breakpoint
CREATE INDEX "stores_idx_diningcode_score" ON "foodia"."stores" USING btree ("diningcode_score");--> statement-breakpoint
CREATE INDEX "together_participants_idx_post_id" ON "foodia"."together_participants" USING btree ("together_post_id");--> statement-breakpoint
CREATE INDEX "together_participants_idx_user_id" ON "foodia"."together_participants" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "together_participants_unique_post_user" ON "foodia"."together_participants" USING btree ("together_post_id","user_id");--> statement-breakpoint
CREATE INDEX "together_posts_idx_rid" ON "foodia"."together_posts" USING btree ("rid");--> statement-breakpoint
CREATE INDEX "together_posts_idx_status" ON "foodia"."together_posts" USING btree ("status");