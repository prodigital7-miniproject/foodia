-- Add author_name and max_participants to together_posts (실명, 모집 인원)
ALTER TABLE "foodia"."together_posts" ADD COLUMN "author_name" varchar(50) NOT NULL DEFAULT '';
ALTER TABLE "foodia"."together_posts" ADD COLUMN "max_participants" integer NOT NULL DEFAULT 1;

-- Constraint: max_participants >= 1
ALTER TABLE "foodia"."together_posts" ADD CONSTRAINT "together_posts_max_participants_check" CHECK ("max_participants" >= 1);
