DROP TABLE IF EXISTS "survey_responses";
--> statement-breakpoint
DROP TABLE IF EXISTS "todos";
--> statement-breakpoint
DROP TABLE IF EXISTS "posts";
--> statement-breakpoint

CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL,
	"game_url" text NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "games_position_idx" ON "games" USING btree ("position");
--> statement-breakpoint
CREATE INDEX "games_is_featured_idx" ON "games" USING btree ("is_featured");
--> statement-breakpoint
INSERT INTO "games" (
	"title",
	"image_url",
	"game_url",
	"is_new",
	"position",
	"is_featured"
) VALUES
	('Wordमाला', '/games/wordmala-hero.png', '#', false, 1, true),
	('क्रिकेट मास्टर', '/games/cricket-master.png', '#', true, 2, false),
	('Word खोज', '/games/word-guess.png', '#', false, 3, false),
	('नंबर निंजा', '/games/number-ninja.png', '#', false, 4, false),
	('Wordमाला Classic', '/games/wordmala-card.png', '#', true, 5, false);
