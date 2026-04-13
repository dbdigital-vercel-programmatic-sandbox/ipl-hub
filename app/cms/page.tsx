/* eslint-disable @next/next/no-img-element */

import Link from "next/link"

import {
  createGameAction,
  deleteGameAction,
  updateGamesHubSettingsAction,
  updateGameAction,
} from "@/app/cms/actions"
import { GameEditorForm } from "@/app/cms/game-editor-form"
import { HeaderSettingsForm } from "@/app/cms/header-settings-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getGames, getGamesHubSettings } from "@/lib/games"

export const dynamic = "force-dynamic"

export default async function CmsPage() {
  const [gamesResult, settingsResult] = await Promise.all([
    getGames(),
    getGamesHubSettings(),
  ])
  const { games, dbConfigured, schemaReady, error } = gamesResult
  const {
    settings,
    dbConfigured: settingsDbConfigured,
    schemaReady: settingsSchemaReady,
    error: settingsError,
  } = settingsResult
  const featuredCount = games.filter(
    (game) => game.featuredSlot !== null
  ).length

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Games Hub CMS</h1>
          <p className="text-sm text-muted-foreground">
            Add games, control card position, and choose the promoted game.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/webview">Open Games Hub</Link>
        </Button>
      </div>

      {!dbConfigured ? (
        <div className="rounded-lg border border-amber-300 bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          DATABASE_URL is not configured yet. You are seeing demo data only.
        </div>
      ) : null}

      {dbConfigured && !schemaReady ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <span>{error}</span>
          <Button asChild size="sm" variant="outline">
            <Link href="/cms/migrations">Open migrations</Link>
          </Button>
        </div>
      ) : null}

      {settingsDbConfigured && !settingsSchemaReady ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <span>{settingsError}</span>
          <Button asChild size="sm" variant="outline">
            <Link href="/cms/migrations">Open migrations</Link>
          </Button>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Total games</CardTitle>
            <CardDescription>
              Current Games Hub entries in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {games.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promoted slots</CardTitle>
            <CardDescription>
              Games pinned into the two challenge cards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {featuredCount}/2
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Set a game to slot 1 or slot 2 in the form below.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Header</CardTitle>
          <CardDescription>
            Edit the fixed title shown at the top of the Games Hub webview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HeaderSettingsForm
            action={updateGamesHubSettingsAction}
            settings={settings}
            schemaReady={settingsSchemaReady}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add game</CardTitle>
          <CardDescription>
            Create a new entry for the Games Hub webview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createGameAction} className="grid gap-3 md:grid-cols-2">
            <Input
              name="title"
              placeholder="Game title"
              required
              disabled={!schemaReady}
            />
            <Input
              name="slug"
              placeholder="Slug label"
              required
              disabled={!schemaReady}
            />
            <label className="flex flex-col gap-2 text-sm">
              <span>Slug color</span>
              <input
                name="slugColor"
                type="color"
                defaultValue="#2B2B2B"
                className="h-10 w-full rounded-lg border bg-background px-1"
                disabled={!schemaReady}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span>Game link</span>
              <Input
                name="gameUrl"
                placeholder="https://... or /path"
                required
                disabled={!schemaReady}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm md:col-span-2">
              <span>Image link</span>
              <Input
                name="heroImageUrl"
                placeholder="Hero image URL or /games-hub/my-image.png"
                required
                disabled={!schemaReady}
              />
            </label>
            <Input
              name="position"
              type="number"
              min={0}
              placeholder="Position order"
              required
              disabled={!schemaReady}
            />
            <label className="flex flex-col gap-2 text-sm">
              <span>Promoted slot</span>
              <select
                name="featuredSlot"
                defaultValue=""
                className="h-10 rounded-lg border bg-background px-3 text-sm"
                disabled={!schemaReady}
              >
                <option value="">Not promoted</option>
                <option value="1">Slot 1</option>
                <option value="2">Slot 2</option>
              </select>
            </label>
            <label className="inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm">
              <input
                name="isNew"
                type="checkbox"
                className="size-4"
                disabled={!schemaReady}
              />
              Show NEW badge
            </label>
            <div className="md:col-span-2">
              <Button type="submit" disabled={!schemaReady}>
                Add game
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {games.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No games yet.
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">All games</h2>
            <Badge variant="secondary">{games.length}</Badge>
          </div>
          {games.map((game) => (
            <Card key={game.id}>
              <CardContent className="grid gap-4 p-4 lg:grid-cols-[180px_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-xl border bg-muted/40">
                  <img
                    src={game.heroImageUrl}
                    alt={game.title}
                    className="h-32 w-full object-cover"
                  />
                </div>

                <GameEditorForm
                  game={game}
                  schemaReady={schemaReady}
                  updateAction={updateGameAction}
                  deleteAction={deleteGameAction}
                />
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  )
}
