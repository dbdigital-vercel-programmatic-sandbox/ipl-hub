"use client"

/* eslint-disable @next/next/no-img-element */

import { ArrowLeftIcon } from "lucide-react"

import { usePullToRefreshDisabler, useWebviewContext } from "@/bridge"
import type { Game, GamesHubSettings } from "@/lib/games"
import { cn } from "@/lib/utils"

function PromoCard({ game }: { game: Game }) {
  return (
    <a
      href={game.gameUrl || "#"}
      className="overflow-hidden rounded-[10px] border border-[#DADADA] bg-white"
    >
      <img
        src={game.heroImageUrl}
        alt={game.title}
        className="h-[118px] w-full rounded-t-[10px] object-cover"
      />
      <div className="flex items-center justify-center p-[10px]">
        <div className="w-full min-w-0 text-center text-sm leading-5 font-semibold text-[#2B2B2B]">
          <span style={{ color: game.slugColor }}>{game.slug}: </span>
          <span>{game.title}</span>
        </div>
      </div>
    </a>
  )
}

function NewBadge() {
  return (
    <span className="inline-flex items-center justify-center rounded-[4px] bg-[#F44336] px-1 py-0.5 align-top text-[10px] leading-[13.62px] font-semibold whitespace-nowrap text-white">
      <span className="relative top-px">NEW</span>
    </span>
  )
}

function GameRow({ game }: { game: Game }) {
  return (
    <a
      href={game.gameUrl || "#"}
      className="flex items-center gap-[11px] border-b border-[#EAEAEA] px-4 py-3 last:border-b-0"
    >
      <img
        src={game.heroImageUrl}
        alt={game.title}
        className="size-16 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1 text-base leading-6 font-semibold text-[#2B2B2B]">
        <p>
          {game.isNew ? (
            <span className="mr-1 inline-block align-[-1px]">
              <NewBadge />
            </span>
          ) : null}
          <span style={{ color: game.slugColor }}>{game.slug}:</span>{" "}
          <span>{game.title}</span>
        </p>
      </div>
    </a>
  )
}

export function WebviewGamesHub({
  games,
  settings,
  className,
}: {
  games: Game[]
  settings: GamesHubSettings
  className?: string
}) {
  const { closeScreen } = useWebviewContext()
  const promotedGames = [...games]
    .filter((game) => game.featuredSlot !== null)
    .sort((left, right) => (left.featuredSlot ?? 0) - (right.featuredSlot ?? 0))
  const featuredGames = promotedGames.slice(0, 2)
  const otherGames = games.filter(
    (game) => !featuredGames.some((featuredGame) => featuredGame.id === game.id)
  )

  usePullToRefreshDisabler()

  return (
    <main className={cn(className, "min-h-svh bg-white text-[#2B2B2B]")}>
      <div className="fixed inset-x-0 top-0 z-30 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
        <div className="mx-auto flex w-full max-w-[420px] items-center gap-4 px-4 py-4">
          <button
            type="button"
            aria-label="Go back"
            onClick={closeScreen}
            className="inline-flex size-6 shrink-0 items-center justify-center text-[#2B2B2B]"
          >
            <ArrowLeftIcon className="size-6" strokeWidth={2.5} />
          </button>
          <h1 className="truncate text-[20px] leading-[30px] font-semibold text-[#2B2B2B]">
            {settings.headerTitle}
          </h1>
        </div>
      </div>

      <section className="mx-auto flex w-full max-w-[420px] flex-col gap-4 px-4 pt-[78px] pb-4">
        {games.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No games have been added yet.
          </div>
        ) : (
          <>
            {featuredGames.length > 0 ? (
              <section className="flex flex-col gap-2">
                {settings.showFeaturedSectionTitle ? (
                  <h2 className="text-xl leading-[30px] font-semibold text-[#2B2B2B]">
                    {settings.featuredSectionTitle}
                  </h2>
                ) : null}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 sm:gap-5">
                  {featuredGames.map((game) => (
                    <PromoCard key={game.id} game={game} />
                  ))}
                </div>
              </section>
            ) : null}

            {otherGames.length > 0 ? (
              <section className="flex flex-col">
                {settings.showOtherGamesSectionTitle ? (
                  <div>
                    <h2 className="text-xl leading-[30px] font-semibold text-[#2B2B2B]">
                      {settings.otherGamesSectionTitle}
                    </h2>
                  </div>
                ) : null}
                <div>
                  {otherGames.map((game) => (
                    <GameRow key={game.id} game={game} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </section>
    </main>
  )
}
