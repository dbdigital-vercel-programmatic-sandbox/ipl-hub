DROP TABLE IF EXISTS "games";
--> statement-breakpoint
CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"slug_color" text DEFAULT '#2B2B2B' NOT NULL,
	"hero_image_url" text NOT NULL,
	"game_url" text NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"featured_slot" integer,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "games_position_idx" ON "games" USING btree ("position");
--> statement-breakpoint
CREATE INDEX "games_featured_slot_idx" ON "games" USING btree ("featured_slot");
--> statement-breakpoint
INSERT INTO "games" (
	"title",
	"slug",
	"slug_color",
	"hero_image_url",
	"game_url",
	"is_new",
	"featured_slot",
	"position"
) VALUES
	('फन का डेली डोज जो बढ़ाएगा आपका IQ', 'क्विज मास्टर', '#2B2B2B', '/games-hub/promo-quiz-master.png', '#', true, 1, 1),
	('एक जैसे मिलते-जुलते शब्दों को खोजें', 'Wordखोज', '#22B6E4', '/games-hub/promo-wordkhoj-b.png', '#', false, 2, 2),
	('हर दिन पायें एक', 'अंतर पहचानो', '#9D46F3', '/games-hub/list-antar-pahchano.svg', '#', true, null, 3),
	('हर दिन पायें एक', 'नंबर निंजा', '#FF554B', '/games-hub/list-number-ninja-d.svg', '#', false, null, 4),
	('हर दिन पायें एक', 'Wordमाला', '#CA9600', '/games-hub/list-wordmala-e.svg', '#', false, null, 5),
	('हर दिन पायें एक', 'पाइप पजल', '#3E9E3E', '/games-hub/list-pipe-puzzle-f.svg', '#', true, null, 6);
