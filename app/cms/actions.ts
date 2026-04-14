"use server"

import { revalidatePath } from "next/cache"

import {
  errorState,
  successState,
  type CmsActionState,
} from "@/app/cms/action-state"
import {
  DEFAULT_GAMES_HUB_FEATURED_SECTION_TITLE,
  DEFAULT_GAMES_HUB_OTHER_GAMES_TITLE,
  DEFAULT_SLUG_COLOR,
  createGame,
  deleteGame,
  DEFAULT_GAMES_HUB_HEADER_TITLE,
  normalizeSlugColor,
  updateGame,
  updateGamesHubSettings,
} from "@/lib/games"

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function asText(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback
}

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  if (typeof value !== "string") {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function asFeaturedSlot(value: FormDataEntryValue | null): 1 | 2 | null {
  if (typeof value !== "string") {
    return null
  }

  const parsed = Number(value)
  return parsed === 1 || parsed === 2 ? parsed : null
}

function asChecked(value: FormDataEntryValue | null) {
  return value === "on"
}

export async function createGameAction(formData: FormData) {
  await createGame({
    title: asText(formData.get("title"), "Untitled game"),
    slug: asText(formData.get("slug"), "Game"),
    slugColor: normalizeSlugColor(
      asText(formData.get("slugColor"), DEFAULT_SLUG_COLOR)
    ),
    heroImageUrl: asText(formData.get("heroImageUrl")),
    gameUrl: asText(formData.get("gameUrl"), "#"),
    isNew: formData.get("isNew") === "on",
    featuredSlot: asFeaturedSlot(formData.get("featuredSlot")),
    position: asNumber(formData.get("position")),
  })

  revalidatePath("/webview")
  revalidatePath("/cms")
}

export async function updateGameAction(
  _previousState: CmsActionState,
  formData: FormData
): Promise<CmsActionState> {
  try {
    await updateGame({
      id: asNumber(formData.get("id"), -1),
      title: asText(formData.get("title"), "Untitled game"),
      slug: asText(formData.get("slug"), "Game"),
      slugColor: normalizeSlugColor(
        asText(formData.get("slugColor"), DEFAULT_SLUG_COLOR)
      ),
      heroImageUrl: asText(formData.get("heroImageUrl")),
      gameUrl: asText(formData.get("gameUrl"), "#"),
      isNew: formData.get("isNew") === "on",
      featuredSlot: asFeaturedSlot(formData.get("featuredSlot")),
      position: asNumber(formData.get("position")),
    })

    revalidatePath("/webview")
    revalidatePath("/cms")

    return successState("Game saved successfully.")
  } catch (error) {
    return errorState(getErrorMessage(error, "Failed to save game."))
  }
}

export async function deleteGameAction(formData: FormData) {
  await deleteGame(asNumber(formData.get("id"), -1))
  revalidatePath("/webview")
  revalidatePath("/cms")
}

export async function updateGamesHubSettingsAction(
  _previousState: CmsActionState,
  formData: FormData
): Promise<CmsActionState> {
  try {
    await updateGamesHubSettings({
      headerTitle: asText(
        formData.get("headerTitle"),
        DEFAULT_GAMES_HUB_HEADER_TITLE
      ),
      featuredSectionTitle: asText(
        formData.get("featuredSectionTitle"),
        DEFAULT_GAMES_HUB_FEATURED_SECTION_TITLE
      ),
      otherGamesSectionTitle: asText(
        formData.get("otherGamesSectionTitle"),
        DEFAULT_GAMES_HUB_OTHER_GAMES_TITLE
      ),
      showFeaturedSectionTitle: asChecked(
        formData.get("showFeaturedSectionTitle")
      ),
      showOtherGamesSectionTitle: asChecked(
        formData.get("showOtherGamesSectionTitle")
      ),
      otherGamesBigPictureMode: asChecked(
        formData.get("otherGamesBigPictureMode")
      ),
    })

    revalidatePath("/webview")
    revalidatePath("/cms")

    return successState("Games Hub settings saved successfully.")
  } catch (error) {
    return errorState(
      getErrorMessage(error, "Failed to save Games Hub settings.")
    )
  }
}
