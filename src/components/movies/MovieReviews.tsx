import {
  Star,
  MessageSquareOff,
  MessageSquare,
  Send,
  ChevronRight,
  Lock,
  Edit3,
  Trash2,
  Clock,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Tag,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { deleteReview, changeReviewStatus, updateReview } from "@/services/interaction.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ReviewInteractions } from "@/components/movies/ReviewInteractions";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ActionFeedbackCard } from "@/components/shared/ActionFeedbackCard";
import { ADMIN_PENDING_REVIEW_COUNT_QUERY_KEY } from "@/hooks/useAdminPendingReviewCount";
import { filterReviewsForDisplay } from "@/lib/reviewVisibility";

type DeleteIntent = "deleteDraft" | "adminReject" | "adminDeletePublished";

const RATING_ENUM_TO_NUM: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
};

const MAX_TAGS = 20;
const MAX_TAG_LEN = 40;

function displayUserName(review: any): string {
  const u = review?.user;
  if (!u || typeof u === "string") return "Member";
  const full = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (typeof u.name === "string" && u.name.trim()) return u.name;
  return "Member";
}

interface MovieReviewsProps {
  movieId: string;
  hasAccess: boolean;
  reviews: any[];
  reviewsLoading: boolean;
  isReviewing: boolean;
  reviewFormVersion: number;
  onSubmitReview: (
    rating: number,
    comment: string,
    opts: { hasSpoiler: boolean; tags: string[] }
  ) => void;
}

export function MovieReviews({
  movieId,
  reviews,
  reviewsLoading,
  isReviewing,
  onSubmitReview,
  hasAccess,
  reviewFormVersion,
}: MovieReviewsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const displayReviews = useMemo(() => filterReviewsForDisplay(reviews, user), [reviews, user]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingRating, setEditingRating] = useState(5);
  const [editingHasSpoiler, setEditingHasSpoiler] = useState(false);
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const [editingTagInput, setEditingTagInput] = useState("");
  const [editTagError, setEditTagError] = useState<string | null>(null);

  useEffect(() => {
    setReviewText("");
    setHasSpoiler(false);
    setTags([]);
    setTagInput("");
    setTagError(null);
  }, [reviewFormVersion]);

  const [confirmModal, setConfirmModal] = useState<null | { id: string; intent: DeleteIntent }>(null);
  const pendingDeleteIntentRef = useRef<DeleteIntent | null>(null);
  const [feedback, setFeedback] = useState<null | {
    message: string;
    subMessage?: string;
    variant?: "success" | "info";
  }>(null);

  useEffect(() => {
    if (!feedback) return;
    const t = window.setTimeout(() => setFeedback(null), 4500);
    return () => window.clearTimeout(t);
  }, [feedback]);

  const { mutate: mutateDelete, isPending: isDeletePending } = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      queryClient.invalidateQueries({ queryKey: ADMIN_PENDING_REVIEW_COUNT_QUERY_KEY });
      setConfirmModal(null);
      const intent = pendingDeleteIntentRef.current;
      pendingDeleteIntentRef.current = null;
      if (intent === "deleteDraft") {
        setFeedback({
          message: "Draft deleted",
          subMessage: "Your review was removed.",
          variant: "success",
        });
      } else if (intent === "adminReject") {
        setFeedback({
          message: "Review rejected",
          subMessage: "This submission was removed from the queue.",
          variant: "success",
        });
      } else if (intent === "adminDeletePublished") {
        setFeedback({
          message: "Review removed",
          subMessage: "The published review was deleted.",
          variant: "success",
        });
      }
    },
    onError: (err: any) => {
      pendingDeleteIntentRef.current = null;
      toast.error(err.response?.data?.message || "Failed to delete review", {
        description: "Please check your permissions and try again."
      });
    }
  });

  const confirmDeleteAction = () => {
    if (!confirmModal) return;
    pendingDeleteIntentRef.current = confirmModal.intent;
    mutateDelete(confirmModal.id);
  };

  const { mutate: mutateStatus, isPending: isStatusPending } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) => changeReviewStatus(id, status),
    onSuccess: (data: any, vars: any) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      queryClient.invalidateQueries({ queryKey: ADMIN_PENDING_REVIEW_COUNT_QUERY_KEY });
      if (vars.status === "PUBLISHED") {
        setFeedback({
          message: "Approved",
          subMessage: "This review is now visible to everyone.",
          variant: "success",
        });
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Status update failed", {
        description: "Admins only action."
      });
    }
  });

  const handleStatusChange = (id: string, status: "PUBLISHED" | "UNPUBLISHED") => {
    mutateStatus({ id, status });
  };

  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      setFeedback({
        message: "Changes saved",
        subMessage: "Your review draft was updated successfully.",
        variant: "success",
      });
      setEditingId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update review", {
        description: "Only authors can edit their pending drafts."
      });
    }
  });

  const handleEditInit = (review: any) => {
    const id = review.id || review._id;
    if (!id) return toast.error("Review ID mismatch");
    setEditingId(id);
    setEditingText(review.content);
    setEditingHasSpoiler(Boolean(review.hasSpoiler));
    setEditingTags(Array.isArray(review.tags) ? [...review.tags] : []);
    setEditingTagInput("");
    setEditTagError(null);
    // Map rating enum back to number (1–5 star UI)
    const ratingMap: Record<string, number> = {
      ONE: 1,
      TWO: 1,
      THREE: 2,
      FOUR: 2,
      FIVE: 3,
      SIX: 3,
      SEVEN: 4,
      EIGHT: 4,
      NINE: 5,
      TEN: 5,
    };
    setEditingRating(ratingMap[review.rating] ?? 5);
  };

  const mergeTags = (
    current: string[],
    raw: string,
  ): { tags: string[]; error: string | null } => {
    const incoming = raw
      .split(/[,]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const merged = [...current];
    for (const t of incoming) {
      if (t.length > MAX_TAG_LEN) {
        return {
          tags: current,
          error: `Each tag must be ${MAX_TAG_LEN} characters or fewer.`,
        };
      }
      if (merged.length >= MAX_TAGS) {
        return {
          tags: current,
          error: `You can add at most ${MAX_TAGS} tags.`,
        };
      }
      if (!merged.includes(t)) {
        merged.push(t);
      }
    }
    return { tags: merged, error: null };
  };

  const addTagFromInput = (
    raw: string,
    current: string[],
    setter: (t: string[]) => void,
    setErr: (msg: string | null) => void,
  ) => {
    const merged = mergeTags(current, raw);
    setErr(merged.error);
    if (!merged.error) {
      setter(merged.tags);
    }
  };

  const handleUpdate = () => {
    if (!editingId || !editingText.trim()) return;
    const merged = mergeTags(editingTags, editingTagInput);
    if (merged.error) {
      setEditTagError(merged.error);
      return;
    }
    mutateUpdate({
      id: editingId,
      data: {
        rating: editingRating,
        comment: editingText,
        hasSpoiler: editingHasSpoiler,
        tags: merged.tags,
      },
    });
    setEditingTagInput("");
  };

  const handleSubmit = () => {
    if (!reviewText.trim()) return;
    const merged = mergeTags(tags, tagInput);
    setTagError(merged.error);
    if (merged.error) {
      return;
    }
    onSubmitReview(rating, reviewText, { hasSpoiler, tags: merged.tags });
    setTagInput("");
  };

  const onTagKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    current: string[],
    setter: (t: string[]) => void,
    input: string,
    setInput: (s: string) => void,
    setErr: (msg: string | null) => void,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!input.trim()) return;
      addTagFromInput(input, current, setter, setErr);
      setInput("");
    }
  };

  const onEditTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!editingTagInput.trim()) return;
      addTagFromInput(editingTagInput, editingTags, setEditingTags, setEditTagError);
      setEditingTagInput("");
    }
  };

  const confirmCopy =
    confirmModal?.intent === "deleteDraft"
      ? {
          title: "Delete this draft?",
          description:
            "Your review is still pending approval. If you delete it, you will need to write a new review to submit again.",
          confirmLabel: "Yes, delete draft",
          tone: "danger" as const,
        }
      : confirmModal?.intent === "adminReject"
        ? {
            title: "Reject this review?",
            description:
              "This will remove the submission from the moderation queue. This action cannot be undone.",
            confirmLabel: "Yes, reject",
            tone: "warning" as const,
          }
        : confirmModal?.intent === "adminDeletePublished"
          ? {
              title: "Delete this published review?",
              description:
                "The review will be removed for all users. This action cannot be undone.",
              confirmLabel: "Yes, delete",
              tone: "danger" as const,
            }
          : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-start">
      {/* Write Review Section - Fixed on Desktop */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
        <div className="p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] glass-morphism border-white/10 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MessageSquare className="w-24 h-24 text-white" />
          </div>
          
          <div className="relative space-y-2">
            <h3 className="text-3xl font-black text-white tracking-tighter">Your Review</h3>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              Sharing your thoughts helps others discover great cinema. What did you think?
            </p>
          </div>

          <div className="space-y-6 relative">
            <div className="space-y-3 px-1">
              <label className="text-xs font-black uppercase tracking-widest text-[#e50914]">Select Rating</label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-8 h-8 transition-all duration-300 transform",
                      hasAccess ? "cursor-pointer hover:scale-125" : "cursor-not-allowed opacity-30",
                      rating >= star ? "text-[#e50914] fill-[#e50914] drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]" : "text-white/10 hover:text-white/30"
                    )}
                    onClick={() => hasAccess && setRating(star)}
                  />
                ))}
                <span className="ml-2 text-2xl font-black text-white">{rating}/5</span>
              </div>
            </div>

            <div className="space-y-3 group/field relative">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500 transition-colors group-focus-within/field:text-primary">Thoughts</label>
                <Textarea
                  placeholder={hasAccess ? "The cinematography was breathtaking..." : "Purchase access to share your thoughts"}
                  className="bg-black/20 border-white/10 min-h-[160px] rounded-2xl text-zinc-200 resize-none text-lg p-5 focus:ring-primary focus:bg-black/40 transition-all font-medium placeholder:text-zinc-700"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  disabled={!hasAccess}
                />
                
                {!hasAccess && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b0b0b]/40 backdrop-blur-[2px] rounded-2xl p-6 border border-white/5 shadow-inner">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="p-3 rounded-full bg-white/5 border border-white/10">
                            <Lock className="w-6 h-6 text-zinc-500" />
                        </div>
                        <p className="text-zinc-400 font-bold text-sm">
                           You need to watch this movie before reviewing
                        </p>
                    </div>
                  </div>
                )}
            </div>

            <div className="space-y-3 px-1">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                Spoilers
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={hasSpoiler}
                disabled={!hasAccess || isReviewing}
                onClick={() => hasAccess && !isReviewing && setHasSpoiler((v) => !v)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                  hasSpoiler
                    ? "border-amber-500/40 bg-amber-500/10"
                    : "border-white/10 bg-black/20 hover:border-white/20",
                  (!hasAccess || isReviewing) && "cursor-not-allowed opacity-50",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  This review contains spoilers
                </span>
                <span
                  className={cn(
                    "relative inline-flex h-7 w-12 shrink-0 rounded-full border transition-colors",
                    hasSpoiler ? "border-amber-400/50 bg-amber-500/30" : "border-white/20 bg-white/10",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200",
                      hasSpoiler && "translate-x-5",
                    )}
                  />
                </span>
              </button>
            </div>

            <div className="space-y-3 px-1">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">
                Tags <span className="font-normal text-zinc-600">(optional, max {MAX_TAGS})</span>
              </label>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 focus-within:border-[#e50914]/40 focus-within:ring-2 focus-within:ring-[#e50914]/20">
                <div className="mb-2 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-200"
                    >
                      <Tag className="h-3 w-3 text-[#e50914]" />
                      {t}
                      <button
                        type="button"
                        disabled={!hasAccess || isReviewing}
                        className="ml-1 rounded-full p-0.5 hover:bg-white/10"
                        onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                        aria-label={`Remove ${t}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setTagError(null);
                  }}
                  onKeyDown={(e) =>
                    onTagKeyDown(e, tags, setTags, tagInput, setTagInput, setTagError)
                  }
                  disabled={!hasAccess || isReviewing}
                  placeholder="e.g. family-friendly, underrated — press Enter"
                  className="h-10 border-0 bg-transparent p-0 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-0"
                />
              </div>
              {tagError && (
                <p className="text-xs font-medium text-amber-400" role="alert">
                  {tagError}
                </p>
              )}
            </div>

            <Button 
              variant="netflix" 
              className="w-full h-14 rounded-2xl text-lg font-black uppercase tracking-widest gap-3 shadow-primary/20"
              onClick={handleSubmit} 
              disabled={isReviewing || !reviewText.trim() || !hasAccess}
            >
              {isReviewing ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Submitting…
                </>
              ) : (
                <>
                  Post Review
                  <Send className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Review List Section */}
      <div className="lg:col-span-7 space-y-6 sm:space-y-8 min-w-0">
        <div className="flex flex-col gap-2 border-b border-white/5 pb-3 sm:flex-row sm:items-center sm:justify-between sm:pb-2">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">Community Reviews</h3>
            <span className="text-xs sm:text-sm font-bold text-zinc-500">{displayReviews.length} total</span>
        </div>

        {reviewsLoading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin text-[#e50914]" />
              Loading reviews…
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-3xl border border-white/5 bg-white/5"
                />
              ))}
            </div>
          </div>
        ) : displayReviews.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] py-12 glass-morphism">
            <EmptyState
              icon={MessageSquareOff}
              title="No reviews yet"
              description="Be the first to rate this title and help others decide what to watch. Use the form on the left to post your review."
            />
          </div>
        ) : (
          <div className="space-y-6">
             {displayReviews.map((review: any) => {
               const rid = review.id || review._id;
               const isAuthor =
                 !!user?.id &&
                 (user.id === review.userId ||
                   (typeof review.user === "object" &&
                     review.user &&
                     user.id === (review.user as { id?: string }).id));
               const isAdminUser = user?.role === "ADMIN";
               const shouldBlurPendingContent =
                 review.status === "PENDING" &&
                 editingId !== rid &&
                 !isAuthor &&
                 !isAdminUser;

               return (
                <div key={rid} className="group p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] glass-morphism border-white/5 hover:border-[#e50914]/20 hover:bg-white/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6">
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/40 p-[2px] shadow-lg shadow-primary/20">
                      <div className="w-full h-full rounded-[0.9rem] bg-[#0b0b0b] flex items-center justify-center text-white font-black text-xl">
                        {displayUserName(review).charAt(0) || "U"}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-black text-white text-lg tracking-tight leading-none">
                          {displayUserName(review)}
                        </p>
                        {review.status === "PENDING" && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" />
                            Pending Appraisal
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                        
                        {isAuthor && review.status === "PENDING" && (
                          <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-500 ml-auto">
                            <button 
                              onClick={() => handleEditInit(review)}
                              disabled={isDeletePending || isUpdating}
                              className="p-2 rounded-xl bg-white/10 border border-white/20 text-zinc-100 hover:text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg group/edit disabled:opacity-40"
                              title="Edit Review Draft"
                            >
                              <Edit3 className="w-4 h-4 group-hover/edit:scale-110 transition-transform" />
                            </button>
                            <button 
                              onClick={() => setConfirmModal({ id: rid, intent: "deleteDraft" })}
                              disabled={isDeletePending}
                              className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-lg group/del disabled:opacity-40"
                              title="Delete Review Draft"
                            >
                              <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex shrink-0 items-center self-start px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 sm:self-auto">
                    <Star className="w-3.5 h-3.5 text-[#e50914] fill-[#e50914] mr-2" />
                    <span className="text-sm font-black text-white">
                      {RATING_ENUM_TO_NUM[review.rating] ?? review.rating}/10
                    </span>
                  </div>
                </div>

                <div className="relative space-y-3">
                  {isAdminUser && review.status === "PENDING" && editingId !== rid && (
                    <div className="flex flex-col gap-2 rounded-2xl border border-emerald-500/35 bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-emerald-200">
                            Moderation preview
                          </p>
                          <p className="mt-0.5 text-[11px] leading-snug text-zinc-400 sm:text-xs">
                            Full review text is visible so you can approve or reject. Visitors still see this
                            review blurred until it is published.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAuthor && review.status === "PENDING" && editingId !== rid && (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                      <Eye className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-amber-200">
                          Your draft (full text)
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-400 sm:text-xs">
                          You always see your own wording clearly while it awaits admin approval. Others see a
                          blurred preview.
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    className={cn(
                      "relative overflow-hidden rounded-2xl transition-all duration-500",
                      shouldBlurPendingContent &&
                        "blur-[3px] grayscale opacity-[0.45] pointer-events-none select-none",
                      isAuthor && review.status === "PENDING" && editingId !== rid && !shouldBlurPendingContent &&
                        "ring-1 ring-amber-500/20 bg-amber-500/[0.03] sm:p-1",
                      isAdminUser && review.status === "PENDING" && editingId !== rid && !shouldBlurPendingContent &&
                        "ring-1 ring-emerald-500/15 bg-emerald-500/[0.03] sm:p-1",
                    )}
                  >
                    {Array.isArray(review.tags) && review.tags.length > 0 && editingId !== rid && (
                      <div className="mb-3 flex flex-wrap gap-2 px-1 pt-1 sm:px-2">
                        {review.tags.map((t: string) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-300"
                          >
                            <Tag className="h-3 w-3 text-[#e50914]" />
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                  {editingId === rid ? (
                    <div className="space-y-4 p-6 rounded-3xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
                       <div className="flex items-center gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                             <Star 
                               key={s}
                               className={cn("w-5 h-5 cursor-pointer transition-all", editingRating >= s ? "text-primary fill-primary" : "text-zinc-600")}
                               onClick={() => setEditingRating(s)}
                             />
                          ))}
                       </div>
                       <Textarea 
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="bg-black/40 border-white/10 rounded-xl min-h-[100px] text-zinc-200"
                       />
                       <button
                         type="button"
                         role="switch"
                         aria-checked={editingHasSpoiler}
                         onClick={() => setEditingHasSpoiler((v) => !v)}
                         className={cn(
                           "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                           editingHasSpoiler
                             ? "border-amber-500/40 bg-amber-500/10"
                             : "border-white/10 bg-black/30",
                         )}
                       >
                         <span className="flex items-center gap-2 text-zinc-200">
                           <AlertTriangle className="h-4 w-4 text-amber-400" />
                           Contains spoilers
                         </span>
                         <span
                           className={cn(
                             "relative inline-flex h-6 w-11 shrink-0 rounded-full border",
                             editingHasSpoiler ? "border-amber-400/50 bg-amber-500/30" : "border-white/20 bg-white/10",
                           )}
                         >
                           <span
                             className={cn(
                               "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                               editingHasSpoiler && "translate-x-5",
                             )}
                           />
                         </span>
                       </button>
                       <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                         <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                           Tags
                         </p>
                         <div className="mb-2 flex flex-wrap gap-2">
                           {editingTags.map((t) => (
                             <span
                               key={t}
                               className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-zinc-200"
                             >
                               {t}
                               <button
                                 type="button"
                                 className="rounded-full p-0.5 hover:bg-white/10"
                                 onClick={() =>
                                   setEditingTags((prev) => prev.filter((x) => x !== t))
                                 }
                               >
                                 <X className="h-3 w-3" />
                               </button>
                             </span>
                           ))}
                         </div>
                         <Input
                           value={editingTagInput}
                           onChange={(e) => {
                             setEditingTagInput(e.target.value);
                             setEditTagError(null);
                           }}
                           onKeyDown={onEditTagKeyDown}
                           placeholder="Add tags — Enter"
                           className="h-9 border-white/10 bg-black/40 text-sm"
                         />
                         {editTagError && (
                           <p className="mt-2 text-xs text-amber-400">{editTagError}</p>
                         )}
                       </div>
                       <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => {
                              setEditingId(null);
                              setEditTagError(null);
                            }}
                            className="text-zinc-500 hover:text-white"
                          >
                            Cancel
                          </Button>
                          <Button variant="netflix" size="sm" onClick={handleUpdate} disabled={isUpdating} className="h-9 px-6 rounded-lg text-xs tracking-widest font-black uppercase gap-2">
                            {isUpdating ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving…
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                       </div>
                    </div>
                  ) : (
                    <>
                      {review.hasSpoiler && (
                        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-100">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          Spoilers ahead — read carefully.
                        </div>
                      )}
                      <p className="text-zinc-300 leading-relaxed font-medium text-lg lg:text-xl pl-1 text-shadow">
                         &ldquo;{review.content}&rdquo;
                      </p>
                    </>
                  )}
                    {shouldBlurPendingContent && (
                      <div
                        className="pointer-events-none absolute inset-0 z-[1] flex items-end justify-center rounded-2xl bg-gradient-to-t from-[#0b0b0b]/95 via-[#0b0b0b]/35 to-transparent px-4 pb-5 pt-20"
                        aria-hidden
                      >
                        <p className="max-w-sm text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
                          Awaiting moderation — visible when published
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {review.status === "PUBLISHED" && (
                  <ReviewInteractions reviewId={rid} userId={user?.id || user?.userId} />
                )}
                
                {/* ADMIN MODERATION COUNCIL BAR */}
                {user?.role === "ADMIN" && (
                   <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#e50914] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Moderation Council</span>
                      </div>
                      
                      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                         {review.status === "PENDING" && (
                           <>
                             <Button 
                               onClick={() => handleStatusChange(rid, "PUBLISHED")}
                               variant="outline" 
                               size="sm" 
                               disabled={isStatusPending || isDeletePending}
                               className="h-11 sm:h-10 w-full sm:w-auto justify-center px-6 rounded-xl bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white gap-2 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-40"
                             >
                               {isStatusPending ? (
                                 <Loader2 className="w-3.5 h-3.5 animate-spin" />
                               ) : (
                                 <Check className="w-3.5 h-3.5" />
                               )}{" "}
                               Approve
                             </Button>
                             <Button 
                               onClick={() => setConfirmModal({ id: rid, intent: "adminReject" })}
                               variant="outline" 
                               size="sm" 
                               disabled={isDeletePending || isStatusPending}
                               className="h-11 sm:h-10 w-full sm:w-auto justify-center px-6 rounded-xl bg-orange-500/10 border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white gap-2 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-40"
                             >
                               {isDeletePending ? (
                                 <Loader2 className="w-3.5 h-3.5 animate-spin" />
                               ) : (
                                 <X className="w-3.5 h-3.5" />
                               )}{" "}
                               Reject
                             </Button>
                           </>
                         )}
                         
                         {review.status === "PUBLISHED" && (
                           <Button 
                             onClick={() => setConfirmModal({ id: rid, intent: "adminDeletePublished" })}
                             variant="outline" 
                             size="sm" 
                             disabled={isDeletePending || isStatusPending}
                             className="h-11 sm:h-10 w-full sm:w-auto justify-center px-6 rounded-xl bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white gap-2 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-40"
                           >
                             {isDeletePending ? (
                               <Loader2 className="w-3.5 h-3.5 animate-spin" />
                             ) : (
                               <Trash2 className="w-3.5 h-3.5" />
                             )}{" "}
                             Delete Content
                           </Button>
                         )}
                      </div>
                   </div>
                )}
                
                {review.status === "PUBLISHED" && (
                  <div className="mt-6 flex items-center text-[#e50914] opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs uppercase tracking-widest cursor-pointer">
                    Helpful <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                )}
              </div>
               );
             })}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={!!confirmModal && !!confirmCopy}
        title={confirmCopy?.title ?? ""}
        description={confirmCopy?.description ?? ""}
        confirmLabel={confirmCopy?.confirmLabel ?? "Confirm"}
        tone={confirmCopy?.tone ?? "danger"}
        isLoading={isDeletePending}
        onCancel={() => !isDeletePending && setConfirmModal(null)}
        onConfirm={confirmDeleteAction}
      />

      <ActionFeedbackCard
        open={!!feedback}
        message={feedback?.message ?? ""}
        subMessage={feedback?.subMessage}
        variant={feedback?.variant ?? "success"}
        onDismiss={() => setFeedback(null)}
      />
    </div>
  );
}
