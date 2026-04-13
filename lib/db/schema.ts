import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const games = pgTable(
  "games",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    slugColor: text("slug_color").default("#2B2B2B").notNull(),
    heroImageUrl: text("hero_image_url").notNull(),
    gameUrl: text("game_url").notNull(),
    isNew: boolean("is_new").default(false).notNull(),
    featuredSlot: integer("featured_slot"),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    positionIdx: index("games_position_idx").on(table.position),
    featuredSlotIdx: index("games_featured_slot_idx").on(table.featuredSlot),
  })
)

export const gamesHubSettings = pgTable("games_hub_settings", {
  id: integer("id").primaryKey(),
  headerTitle: text("header_title").notNull(),
  featuredSectionTitle: text("featured_section_title").notNull(),
  otherGamesSectionTitle: text("other_games_section_title").notNull(),
  showFeaturedSection: boolean("show_featured_section").default(true).notNull(),
  showOtherGamesSection: boolean("show_other_games_section")
    .default(true)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type GameRow = typeof games.$inferSelect
export type NewGameRow = typeof games.$inferInsert
export type GamesHubSettingsRow = typeof gamesHubSettings.$inferSelect
export type NewGamesHubSettingsRow = typeof gamesHubSettings.$inferInsert
