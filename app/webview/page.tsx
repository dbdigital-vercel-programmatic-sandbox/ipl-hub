import { Noto_Sans_Devanagari } from "next/font/google"

import { getGames, getGamesHubSettings } from "@/lib/games"
import { WebviewGamesHub } from "./webview-games-hub"

export const dynamic = "force-dynamic"

const hindiFont = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["600", "700"],
})

export default async function WebviewPage() {
  const [{ games }, { settings }] = await Promise.all([
    getGames(),
    getGamesHubSettings(),
  ])

  return (
    <WebviewGamesHub
      games={games}
      settings={settings}
      className={hindiFont.className}
    />
  )
}
