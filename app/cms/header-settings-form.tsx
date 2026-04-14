"use client"

import { useActionState, useEffect } from "react"

import {
  type CmsActionState,
  initialCmsActionState,
} from "@/app/cms/action-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { GamesHubSettings } from "@/lib/games"
import { toast } from "sonner"

type HeaderSettingsFormProps = {
  action: (state: CmsActionState, formData: FormData) => Promise<CmsActionState>
  settings: GamesHubSettings
  schemaReady: boolean
}

export function HeaderSettingsForm({
  action,
  settings,
  schemaReady,
}: HeaderSettingsFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
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
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="flex flex-col gap-2 text-sm">
          <span>Top header text</span>
          <Input
            name="headerTitle"
            defaultValue={settings.headerTitle}
            placeholder="आज का चैलेंज"
            required
            disabled={!schemaReady || pending}
          />
        </label>
      </div>

      <div>
        <label className="flex flex-col gap-2 text-sm">
          <span>Featured section text</span>
          <Input
            name="featuredSectionTitle"
            defaultValue={settings.featuredSectionTitle}
            placeholder="🔥 आज का चैलेंज"
            required
            disabled={!schemaReady || pending}
          />
        </label>
      </div>

      <div>
        <label className="flex flex-col gap-2 text-sm">
          <span>Other games text</span>
          <Input
            name="otherGamesSectionTitle"
            defaultValue={settings.otherGamesSectionTitle}
            placeholder="🎮 अन्य गेम्स"
            required
            disabled={!schemaReady || pending}
          />
        </label>
      </div>

      <label className="inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm">
        <input
          name="showFeaturedSectionTitle"
          type="checkbox"
          defaultChecked={settings.showFeaturedSectionTitle}
          className="size-4"
          disabled={!schemaReady || pending}
        />
        Show featured header text
      </label>

      <label className="inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm">
        <input
          name="showOtherGamesSectionTitle"
          type="checkbox"
          defaultChecked={settings.showOtherGamesSectionTitle}
          className="size-4"
          disabled={!schemaReady || pending}
        />
        Show other games header text
      </label>

      <label className="inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm md:col-span-2">
        <input
          name="otherGamesBigPictureMode"
          type="checkbox"
          defaultChecked={settings.otherGamesBigPictureMode}
          className="size-4"
          disabled={!schemaReady || pending}
        />
        Use big feedcard layout for section 2
      </label>

      <div className="md:col-span-2">
        <Button type="submit" disabled={!schemaReady || pending}>
          {pending ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  )
}
