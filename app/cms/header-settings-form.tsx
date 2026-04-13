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
    <form
      action={formAction}
      className="flex flex-col gap-3 md:flex-row md:items-end"
    >
      <div className="flex-1">
        <label className="flex flex-col gap-2 text-sm">
          <span>Header text</span>
          <Input
            name="headerTitle"
            defaultValue={settings.headerTitle}
            placeholder="आज का चैलेंज"
            required
            disabled={!schemaReady || pending}
          />
        </label>
      </div>
      <Button type="submit" disabled={!schemaReady || pending}>
        {pending ? "Saving..." : "Save header"}
      </Button>
    </form>
  )
}
