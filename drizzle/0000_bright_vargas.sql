CREATE TABLE "foodia"."foods" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foodia"."reviews" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"google_place_id" varchar(255) NOT NULL,
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
	"google_place_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foodia"."stores" (
	"google_place_id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" varchar(50) NOT NULL,
	"address" varchar(255) NOT NULL,
	"distance" integer,
	"price_range" varchar(20),
	"img_url" varchar(255),
	"description" text,
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
	"google_place_id" varchar(255) NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" varchar(300) NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "together_posts_status_check" CHECK ("foodia"."together_posts"."status" IN ('open', 'closed'))
);
--> statement-breakpoint
ALTER TABLE "foodia"."reviews" ADD CONSTRAINT "reviews_google_place_id_stores_google_place_id_fk" FOREIGN KEY ("google_place_id") REFERENCES "foodia"."stores"("google_place_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foodia"."store_foods" ADD CONSTRAINT "store_foods_food_id_foods_id_fk" FOREIGN KEY ("food_id") REFERENCES "foodia"."foods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foodia"."store_foods" ADD CONSTRAINT "store_foods_google_place_id_stores_google_place_id_fk" FOREIGN KEY ("google_place_id") REFERENCES "foodia"."stores"("google_place_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foodia"."together_participants" ADD CONSTRAINT "together_participants_together_post_id_together_posts_id_fk" FOREIGN KEY ("together_post_id") REFERENCES "foodia"."together_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foodia"."together_posts" ADD CONSTRAINT "together_posts_google_place_id_stores_google_place_id_fk" FOREIGN KEY ("google_place_id") REFERENCES "foodia"."stores"("google_place_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "foods_idx_name" ON "foodia"."foods" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "foods_unique_name" ON "foodia"."foods" USING btree ("name");--> statement-breakpoint
CREATE INDEX "reviews_idx_google_place_id" ON "foodia"."reviews" USING btree ("google_place_id");--> statement-breakpoint
CREATE INDEX "reviews_idx_nickname" ON "foodia"."reviews" USING btree ("nickname");--> statement-breakpoint
CREATE INDEX "store_foods_idx_food_id" ON "foodia"."store_foods" USING btree ("food_id");--> statement-breakpoint
CREATE INDEX "store_foods_idx_google_place_id" ON "foodia"."store_foods" USING btree ("google_place_id");--> statement-breakpoint
CREATE UNIQUE INDEX "store_foods_unique_google_place_food" ON "foodia"."store_foods" USING btree ("google_place_id","food_id");--> statement-breakpoint
CREATE INDEX "stores_idx_category" ON "foodia"."stores" USING btree ("category");--> statement-breakpoint
CREATE INDEX "stores_idx_name" ON "foodia"."stores" USING btree ("name");--> statement-breakpoint
CREATE INDEX "together_participants_idx_post_id" ON "foodia"."together_participants" USING btree ("together_post_id");--> statement-breakpoint
CREATE INDEX "together_participants_idx_user_id" ON "foodia"."together_participants" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "together_participants_unique_post_user" ON "foodia"."together_participants" USING btree ("together_post_id","user_id");--> statement-breakpoint
CREATE INDEX "together_posts_idx_google_place_id" ON "foodia"."together_posts" USING btree ("google_place_id");--> statement-breakpoint
CREATE INDEX "together_posts_idx_status" ON "foodia"."together_posts" USING btree ("status");