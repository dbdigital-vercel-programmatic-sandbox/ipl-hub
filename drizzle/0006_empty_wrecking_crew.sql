CREATE TABLE "games_hub_settings" (
	"id" integer PRIMARY KEY NOT NULL,
	"header_title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
