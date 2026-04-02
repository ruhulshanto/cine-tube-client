import { useEffect } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Auto-navigate to `/movies` when home search/filter inputs change.
 *
 * Purpose:
 * - On the Home page we removed the explicit "Browse" button
 * - Selecting a genre or typing a query should feel immediate
 * - Uses `router.replace` (not `push`) to avoid polluting browser history while typing
 */
export function useAutoBrowseToMovies({
  router,
  enabled,
  q,
  genre,
  releaseYear,
  streamingPlatform,
}: {
  router: AppRouterInstance;
  enabled: boolean;
  q: string;
  genre: string;
  releaseYear: string;
  streamingPlatform: string;
}) {
  useEffect(() => {
    if (!enabled) return;
    const hasAny =
      q.trim() || genre || releaseYear.trim() || streamingPlatform.trim();
    if (!hasAny) return;

    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (genre) params.set("genre", genre);
    if (releaseYear.trim()) params.set("releaseYear", releaseYear.trim());
    if (streamingPlatform.trim()) params.set("streamingPlatform", streamingPlatform.trim());

    const qs = params.toString();
    router.replace(qs ? `/movies?${qs}` : "/movies");
  }, [enabled, genre, q, releaseYear, router, streamingPlatform]);
}

