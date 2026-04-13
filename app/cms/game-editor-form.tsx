"use client"

import { useActionState, useEffect } from "react"

import {
  type CmsActionState,
  initialCmsActionState,
} from "@/app/cms/action-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Game } from "@/lib/games"
import { toast } from "sonner"

type GameEditorFormProps = {
  game: Game
  schemaReady: boolean
  updateAction: (
    state: CmsActionState,
    formData: FormData
  ) => Promise<CmsActionState>
  deleteAction: (formData: FormData) => Promise<void>
}

export function GameEditorForm({
  game,
  schemaReady,
  updateAction,
  deleteAction,
}: GameEditorFormProps) {
  const [state, formAction, pending] = useActionState(
    updateAction,
    initialCmsActionState
  )

  useEffect(() => {
    if (!state.timestamp) {
      return
    }

    if (state.status === "success") {
      toast.success(state.message)
      return
    }

    if (state.status === "error") {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form action={formAction} className="grid gap-3 md:grid-cols-2">
      <input type="hidden" name="id" value={game.id} />
      <Input
        name="title"
        defaultValue={game.title}
        required
        disabled={!schemaReady || pending}
      />
      <Input
        name="slug"
        defaultValue={game.slug}
        required
        disabled={!schemaReady || pending}
      />
      <label className="flex flex-col gap-2 text-sm">
        <span>Slug color</span>
        <input
          name="slugColor"
          type="color"
          defaultValue={game.slugColor}
          className="h-10 w-full rounded-lg border bg-background px-1"
          disabled={!schemaReady || pending}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span>Game link</span>
        <Input
          name="gameUrl"
          defaultValue={game.gameUrl}
          placeholder="https://... or /path"
          required
          disabled={!schemaReady || pending}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm md:col-span-2">
        <span>Image link</span>
        <Input
          name="heroImageUrl"
          defaultValue={game.heroImageUrl}
          required
          disabled={!schemaReady || pending}
        />
      </label>
      <Input
        name="position"
        type="number"
        min={0}
        defaultValue={game.position}
        required
        disabled={!schemaReady || pending}
      />
      <label className="flex flex-col gap-2 text-sm">
        <span>Promoted slot</span>
        <select
          name="featuredSlot"
          defaultValue={game.featuredSlot?.toString() ?? ""}
          className="h-10 rounded-lg border bg-background px-3 text-sm"
          disabled={!schemaReady || pending}
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
          defaultChecked={game.isNew}
          disabled={!schemaReady || pending}
        />
        Show NEW badge
      </label>
      <div className="flex flex-wrap items-center gap-2 md:col-span-2">
        <Button type="submit" size="sm" disabled={!schemaReady || pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button
          type="submit"
          formAction={deleteAction}
          variant="destructive"
          size="sm"
          disabled={!schemaReady || pending}
        >
          Delete
        </Button>
        {game.featuredSlot ? <Badge>Slot {game.featuredSlot}</Badge> : null}
        {game.isNew ? <Badge variant="secondary">NEW</Badge> : null}
        <Badge variant="outline" style={{ color: game.slugColor }}>
          {game.slug}
        </Badge>
      </div>
    </form>
  )
}
