import type { Movie } from "@/types/movie.types";

/**
 * Centralized "pinned trending" logic.
 *
 * Why this exists:
 * - Home has a UX requirement to always pin a favorite title first in "Trending Now"
 * - The favorite title may NOT be in the top-N trending slice, so we optionally merge in
 *   a separately fetched candidate list.
 *
 * This module keeps the matching + ordering rules testable and readable.
 */

function normalizeTitle(m: Pick<Movie, "title"> | any): string {
  return typeof m?.title === "string" ? m.title.toLowerCase() : "";
}

function matchesSpider(t: string) {
  return /spider[\s-]*man/i.test(t) || /spideraman/i.test(t);
}

function matchesBrandNewDay(t: string) {
  return /brand[\s-]*new[\s-]*day/i.test(t);
}

export function pickFavoriteFirst(candidates: Movie[]): Movie | null {
  if (!candidates.length) return null;

  // Prefer the title that matches both "spider-man" and "brand new day".
  return (
    candidates.find((m) => {
      const t = normalizeTitle(m);
      return matchesSpider(t) && matchesBrandNewDay(t);
    }) ??
    candidates.find((m) => matchesSpider(normalizeTitle(m))) ??
    candidates.find((m) => matchesBrandNewDay(normalizeTitle(m))) ??
    null
  );
}

export function buildPinnedTrending({
  trending,
  favoriteCandidate,
  alsoPin = [],
}: {
  trending: Movie[];
  favoriteCandidate: Movie | null;
  /** Additional optional pins (kept after favorite, if present). */
  alsoPin?: Array<{ matcher: (m: Movie) => boolean }>;
}) {
  const favoriteFromTrending =
    trending.find((m) => matchesSpider(normalizeTitle(m))) ??
    trending.find((m) => matchesBrandNewDay(normalizeTitle(m))) ??
    null;

  const favoriteFirst = favoriteCandidate ?? favoriteFromTrending;

  const pinned: Movie[] = [];
  const pinnedIds = new Set<string>();

  const pushUnique = (m: Movie | null) => {
    if (!m?.id) return;
    if (pinnedIds.has(m.id)) return;
    pinned.push(m);
    pinnedIds.add(m.id);
  };

  pushUnique(favoriteFirst);
  for (const rule of alsoPin) {
    pushUnique(trending.find(rule.matcher) ?? null);
  }

  const rest = trending.filter((m) => !m?.id || !pinnedIds.has(m.id));
  return { trendingMovies: [...pinned, ...rest], billboardMovie: favoriteFirst ?? trending[0] };
}

