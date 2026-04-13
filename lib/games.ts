import { and, asc, eq, ne } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  games as gamesTable,
  gamesHubSettings as gamesHubSettingsTable,
} from "@/lib/db/schema"

export type Game = {
  id: number
  title: string
  slug: string
  slugColor: string
  heroImageUrl: string
  gameUrl: string
  isNew: boolean
  featuredSlot: 1 | 2 | null
  position: number
}

export type GamesResult = {
  games: Game[]
  dbConfigured: boolean
  schemaReady: boolean
  error: string | null
}

export type GamesHubSettings = {
  headerTitle: string
}

export type GamesHubSettingsResult = {
  settings: GamesHubSettings
  dbConfigured: boolean
  schemaReady: boolean
  error: string | null
}

export const DEFAULT_SLUG_COLOR = "#2B2B2B"

export const DEFAULT_GAMES_HUB_HEADER_TITLE = "आज का चैलेंज"

const slugColorPattern = /^#[0-9A-Fa-f]{6}$/

export function normalizeSlugColor(value: string | null | undefined): string {
  const trimmed = value?.trim()
  return trimmed && slugColorPattern.test(trimmed)
    ? trimmed.toUpperCase()
    : DEFAULT_SLUG_COLOR
}

const defaultGamesHubSettings: GamesHubSettings = {
  headerTitle: DEFAULT_GAMES_HUB_HEADER_TITLE,
}

const defaultGames: Game[] = [
  {
    id: 1,
    title: "फन का डेली डोज जो बढ़ाएगा आपका IQ",
    slug: "क्विज मास्टर",
    slugColor: DEFAULT_SLUG_COLOR,
    heroImageUrl: "/games-hub/promo-quiz-master.png",
    gameUrl: "#",
    isNew: true,
    featuredSlot: 1,
    position: 1,
  },
  {
    id: 2,
    title: "एक जैसे मिलते-जुलते शब्दों को खोजें",
    slug: "Wordखोज",
    slugColor: "#22B6E4",
    heroImageUrl: "/games-hub/promo-wordkhoj-b.png",
    gameUrl: "#",
    isNew: false,
    featuredSlot: 2,
    position: 2,
  },
  {
    id: 3,
    title: "हर दिन पायें एक",
    slug: "अंतर पहचानो",
    slugColor: "#9D46F3",
    heroImageUrl: "/games-hub/list-antar-pahchano.svg",
    gameUrl: "#",
    isNew: true,
    featuredSlot: null,
    position: 3,
  },
  {
    id: 4,
    title: "हर दिन पायें एक",
    slug: "नंबर निंजा",
    slugColor: "#FF554B",
    heroImageUrl: "/games-hub/list-number-ninja-d.svg",
    gameUrl: "#",
    isNew: false,
    featuredSlot: null,
    position: 4,
  },
  {
    id: 5,
    title: "हर दिन पायें एक",
    slug: "Wordमाला",
    slugColor: "#CA9600",
    heroImageUrl: "/games-hub/list-wordmala-e.svg",
    gameUrl: "#",
    isNew: false,
    featuredSlot: null,
    position: 5,
  },
  {
    id: 6,
    title: "हर दिन पायें एक",
    slug: "पाइप पजल",
    slugColor: "#3E9E3E",
    heroImageUrl: "/games-hub/list-pipe-puzzle-f.svg",
    gameUrl: "#",
    isNew: true,
    featuredSlot: null,
    position: 6,
  },
]

function requireDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is missing. Configure Neon to enable CMS writes."
    )
  }
}

function readErrorField(error: unknown, field: string): unknown {
  if (!error || typeof error !== "object") {
    return null
  }

  return field in error ? error[field as keyof typeof error] : null
}

function isMissingTableError(error: unknown, tableName: string): boolean {
  const code = readErrorField(error, "code")
  const message = readErrorField(error, "message")
  const cause = readErrorField(error, "cause")

  return (
    code === "42P01" ||
    (typeof message === "string" &&
      new RegExp(`relation\\s+"${tableName}"\\s+does not exist`, "i").test(
        message
      )) ||
    (cause !== error && isMissingTableError(cause, tableName))
  )
}

function isMissingGamesTableError(error: unknown): boolean {
  return isMissingTableError(error, "games")
}

function isMissingGamesHubSettingsTableError(error: unknown): boolean {
  return isMissingTableError(error, "games_hub_settings")
}

function schemaNotReadyResult(): GamesResult {
  return {
    games: defaultGames,
    dbConfigured: true,
    schemaReady: false,
    error:
      "Games table is not available yet. Open CMS Migrations and apply the pending migration.",
  }
}

function settingsSchemaNotReadyResult(): GamesHubSettingsResult {
  return {
    settings: defaultGamesHubSettings,
    dbConfigured: true,
    schemaReady: false,
    error:
      "Games Hub settings table is not available yet. Open CMS Migrations and apply the pending migration.",
  }
}

function assertSchemaReady(error: unknown): never {
  if (isMissingGamesTableError(error)) {
    throw new Error(
      "Games table is not available yet. Apply the pending migration from /cms/migrations."
    )
  }

  throw error instanceof Error ? error : new Error("Database request failed")
}

function assertSettingsSchemaReady(error: unknown): never {
  if (isMissingGamesHubSettingsTableError(error)) {
    throw new Error(
      "Games Hub settings table is not available yet. Apply the pending migration from /cms/migrations."
    )
  }

  throw error instanceof Error ? error : new Error("Database request failed")
}

function normalizeFeaturedSlot(value: number | null): 1 | 2 | null {
  return value === 1 || value === 2 ? value : null
}

async function clearFeaturedSlot(slot: 1 | 2, excludeId?: number) {
  const predicate =
    excludeId === undefined
      ? eq(gamesTable.featuredSlot, slot)
      : and(eq(gamesTable.featuredSlot, slot), ne(gamesTable.id, excludeId))

  await db
    .update(gamesTable)
    .set({ featuredSlot: null, updatedAt: new Date() })
    .where(predicate)
}

export async function getGames(): Promise<GamesResult> {
  if (!process.env.DATABASE_URL) {
    return {
      games: defaultGames,
      dbConfigured: false,
      schemaReady: false,
      error: null,
    }
  }

  try {
    const games = await db
      .select({
        id: gamesTable.id,
        title: gamesTable.title,
        slug: gamesTable.slug,
        slugColor: gamesTable.slugColor,
        heroImageUrl: gamesTable.heroImageUrl,
        gameUrl: gamesTable.gameUrl,
        isNew: gamesTable.isNew,
        featuredSlot: gamesTable.featuredSlot,
        position: gamesTable.position,
      })
      .from(gamesTable)
      .orderBy(asc(gamesTable.position), asc(gamesTable.id))

    return {
      games: games.map((game) => ({
        ...game,
        slugColor: normalizeSlugColor(game.slugColor),
        featuredSlot: normalizeFeaturedSlot(game.featuredSlot),
      })),
      dbConfigured: true,
      schemaReady: true,
      error: null,
    }
  } catch (error) {
    if (isMissingGamesTableError(error)) {
      return schemaNotReadyResult()
    }

    throw error
  }
}

export async function getGamesHubSettings(): Promise<GamesHubSettingsResult> {
  if (!process.env.DATABASE_URL) {
    return {
      settings: defaultGamesHubSettings,
      dbConfigured: false,
      schemaReady: false,
      error: null,
    }
  }

  try {
    const [settings] = await db
      .select({
        headerTitle: gamesHubSettingsTable.headerTitle,
      })
      .from(gamesHubSettingsTable)
      .where(eq(gamesHubSettingsTable.id, 1))
      .limit(1)

    return {
      settings: settings ?? defaultGamesHubSettings,
      dbConfigured: true,
      schemaReady: true,
      error: null,
    }
  } catch (error) {
    if (isMissingGamesHubSettingsTableError(error)) {
      return settingsSchemaNotReadyResult()
    }

    throw error
  }
}

export async function createGame(input: {
  title: string
  slug: string
  slugColor: string
  heroImageUrl: string
  gameUrl: string
  isNew: boolean
  featuredSlot: 1 | 2 | null
  position: number
}) {
  requireDatabaseUrl()

  try {
    const [createdGame] = await db
      .insert(gamesTable)
      .values({
        title: input.title,
        slug: input.slug,
        slugColor: normalizeSlugColor(input.slugColor),
        heroImageUrl: input.heroImageUrl,
        gameUrl: input.gameUrl,
        isNew: input.isNew,
        featuredSlot: input.featuredSlot,
        position: input.position,
        updatedAt: new Date(),
      })
      .returning({ id: gamesTable.id })

    if (input.featuredSlot && createdGame) {
      await clearFeaturedSlot(input.featuredSlot, createdGame.id)
    }
  } catch (error) {
    assertSchemaReady(error)
  }
}

export async function updateGame(input: {
  id: number
  title: string
  slug: string
  slugColor: string
  heroImageUrl: string
  gameUrl: string
  isNew: boolean
  featuredSlot: 1 | 2 | null
  position: number
}) {
  requireDatabaseUrl()

  try {
    await db
      .update(gamesTable)
      .set({
        title: input.title,
        slug: input.slug,
        slugColor: normalizeSlugColor(input.slugColor),
        heroImageUrl: input.heroImageUrl,
        gameUrl: input.gameUrl,
        isNew: input.isNew,
        featuredSlot: input.featuredSlot,
        position: input.position,
        updatedAt: new Date(),
      })
      .where(eq(gamesTable.id, input.id))

    if (input.featuredSlot) {
      await clearFeaturedSlot(input.featuredSlot, input.id)
    }
  } catch (error) {
    assertSchemaReady(error)
  }
}

export async function deleteGame(id: number) {
  requireDatabaseUrl()

  try {
    await db.delete(gamesTable).where(eq(gamesTable.id, id))
  } catch (error) {
    assertSchemaReady(error)
  }
}

export async function updateGamesHubSettings(input: GamesHubSettings) {
  requireDatabaseUrl()

  try {
    await db
      .insert(gamesHubSettingsTable)
      .values({
        id: 1,
        headerTitle: input.headerTitle,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: gamesHubSettingsTable.id,
        set: {
          headerTitle: input.headerTitle,
          updatedAt: new Date(),
        },
      })
  } catch (error) {
    assertSettingsSchemaReady(error)
  }
}
