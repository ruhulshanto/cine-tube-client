export type ReviewVisibilityUser = { id?: string; userId?: string; role?: string } | null;

/**
 * Public / community list: only approved (PUBLISHED) for strangers.
 * Authors see their own PENDING draft; admins see PENDING + UNPUBLISHED (rejected) for moderation.
 */
export function filterReviewsForDisplay<T extends { status?: string; userId?: string; user?: unknown }>(
  reviews: T[],
  user: ReviewVisibilityUser
): T[] {
  const uid = user?.userId || user?.id;
  const isAdmin = user?.role === "ADMIN";
  return reviews.filter((r) => {
    const authorId =
      r.userId ??
      (typeof r.user === "object" && r.user ? (r.user as { id?: string }).id : undefined);
    if (r.status === "PUBLISHED") return true;
    if (r.status === "PENDING") return isAdmin || (!!uid && authorId === uid);
    if (r.status === "UNPUBLISHED") return isAdmin;
    return false;
  });
}
