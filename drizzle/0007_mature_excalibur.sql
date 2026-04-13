ALTER TABLE "games_hub_settings" ADD COLUMN "featured_section_title" text;--> statement-breakpoint
ALTER TABLE "games_hub_settings" ADD COLUMN "other_games_section_title" text;--> statement-breakpoint
ALTER TABLE "games_hub_settings" ADD COLUMN "show_featured_section" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "games_hub_settings" ADD COLUMN "show_other_games_section" boolean DEFAULT true NOT NULL;--> statement-breakpoint
UPDATE "games_hub_settings"
SET
  "featured_section_title" = '🔥 आज का चैलेंज',
  "other_games_section_title" = '🎮 अन्य गेम्स'
WHERE
  "featured_section_title" IS NULL
  OR "other_games_section_title" IS NULL;--> statement-breakpoint
ALTER TABLE "games_hub_settings" ALTER COLUMN "featured_section_title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "games_hub_settings" ALTER COLUMN "other_games_section_title" SET NOT NULL;
