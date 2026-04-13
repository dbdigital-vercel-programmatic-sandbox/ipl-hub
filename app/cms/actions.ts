"use server"

import { revalidatePath } from "next/cache"

import {
  errorState,
  successState,
  type CmsActionState,
} from "@/app/cms/action-state"
import {
  DEFAULT_SLUG_COLOR,
  createGame,
  deleteGame,
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
      headerTitle: asText(formData.get("headerTitle"), "आज का चैलेंज"),
    })

    revalidatePath("/webview")
    revalidatePath("/cms")

    return successState("Header saved successfully.")
  } catch (error) {
    return errorState(getErrorMessage(error, "Failed to save header."))
  }
}
