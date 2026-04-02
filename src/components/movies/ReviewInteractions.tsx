"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2, MessageCircle, Reply, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getCommentsByReview,
  postComment,
  toggleLike,
  getLikesCount,
  checkUserLike,
} from "@/services/interaction.services";
import { toast } from "sonner";

type CommentLikeProps = {
  commentId: string;
  userId: string | undefined;
};

function CommentLikeButton({ commentId, userId }: CommentLikeProps) {
  const queryClient = useQueryClient();

  const { data: countRes } = useQuery({
    queryKey: ["comment-like-count", commentId],
    queryFn: () => getLikesCount({ commentId }),
  });

  const { data: likedRes } = useQuery({
    queryKey: ["comment-liked-by-me", commentId, userId ?? "anon"],
    queryFn: () => checkUserLike({ commentId }),
    enabled: !!userId,
  });

  const { mutate: mutateLike, isPending } = useMutation({
    mutationFn: () => toggleLike({ commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment-like-count", commentId] });
      queryClient.invalidateQueries({ queryKey: ["comment-liked-by-me", commentId] });
    },
    onError: () => toast.error("Failed to update like"),
  });

  const count = countRes?.data?.count ?? 0;
  const likedByMe = !!userId && likedRes?.data?.liked === true;

  return (
    <button
      type="button"
      disabled={!userId || isPending}
      onClick={() => mutateLike()}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold transition-colors",
        likedByMe
          ? "bg-[#e50914]/20 text-[#e50914]"
          : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300",
        (!userId || isPending) && "cursor-not-allowed opacity-50",
      )}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Heart className={cn("h-3.5 w-3.5", likedByMe && "fill-[#e50914] text-[#e50914]")} />
      )}
      <span>{count}</span>
    </button>
  );
}

function commentAuthorName(c: any): string {
  const u = c?.user;
  if (!u) return "Member";
  const full = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return full || "Member";
}

type CommentThreadProps = {
  comment: any;
  reviewId: string;
  userId: string | undefined;
  depth: number;
  onReplyPosted: () => void;
};

const MAX_DEPTH = 4;

function CommentThread({ comment, reviewId, userId, depth, onReplyPosted }: CommentThreadProps) {
  const cid = comment.id || comment._id;
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();

  const { mutate: mutateReply, isPending: replying } = useMutation({
    mutationFn: (content: string) => postComment(reviewId, content, cid),
    onSuccess: () => {
      setReplyText("");
      setReplyOpen(false);
      onReplyPosted();
      toast.success("Reply posted");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to post reply"),
  });

  const replies = Array.isArray(comment.replies) ? comment.replies : [];

  return (
    <div className={cn("rounded-xl border border-white/10 bg-black/25", depth > 0 && "ml-4 border-l-2 border-l-white/20 pl-3")}>
      <div className="p-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-xs font-bold text-zinc-300">{commentAuthorName(comment)}</p>
          <div className="flex items-center gap-2">
            <CommentLikeButton commentId={cid} userId={userId} />
            {depth < MAX_DEPTH && userId && (
              <button
                type="button"
                onClick={() => setReplyOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              >
                <Reply className="h-3.5 w-3.5" />
                Reply
              </button>
            )}
          </div>
        </div>
        <p className="mt-1 text-sm text-zinc-200">{comment.content}</p>
        {replyOpen && userId && (
          <div className="mt-3 flex gap-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              disabled={replying}
              className="h-9 flex-1 rounded-lg border-white/10 bg-black/40 text-sm"
            />
            <Button
              type="button"
              size="sm"
              variant="netflix"
              disabled={!replyText.trim() || replying}
              className="h-9 flex-shrink-0 rounded-lg px-3"
              onClick={() => mutateReply(replyText.trim())}
            >
              {replying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
            </Button>
          </div>
        )}
      </div>
      {replies.length > 0 && (
        <div className="space-y-2 border-t border-white/5 pb-2">
          {replies.map((r: any) => (
            <CommentThread
              key={r.id || r._id}
              comment={r}
              reviewId={reviewId}
              userId={userId}
              depth={depth + 1}
              onReplyPosted={onReplyPosted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export type ReviewInteractionsProps = {
  reviewId: string;
  /** Current user id — used to scope “liked by me” so React Query does not reuse another user’s cache. */
  userId: string | undefined;
};

export function ReviewInteractions({ reviewId, userId }: ReviewInteractionsProps) {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const canInteract = !!userId;

  const { data: commentsRes, isLoading: commentsLoading } = useQuery({
    queryKey: ["review-comments", reviewId],
    queryFn: () => getCommentsByReview(reviewId),
  });

  const { data: likeCountRes } = useQuery({
    queryKey: ["review-like-count", reviewId],
    queryFn: () => getLikesCount({ reviewId }),
  });

  const { data: likedRes } = useQuery({
    queryKey: ["review-liked-by-me", reviewId, userId ?? "anon"],
    queryFn: () => checkUserLike({ reviewId }),
    enabled: canInteract,
  });

  const { mutate: mutateLike, isPending: liking } = useMutation({
    mutationFn: () => toggleLike({ reviewId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-like-count", reviewId] });
      queryClient.invalidateQueries({ queryKey: ["review-liked-by-me", reviewId] });
    },
    onError: () => toast.error("Failed to update like"),
  });

  const { mutate: mutateComment, isPending: commenting } = useMutation({
    mutationFn: (content: string) => postComment(reviewId, content),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["review-comments", reviewId] });
      toast.success("Comment added");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to add comment"),
  });

  const invalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: ["review-comments", reviewId] });

  const comments = commentsRes?.data || [];
  const likeCount = likeCountRes?.data?.count ?? 0;
  const likedByMe = canInteract && likedRes?.data?.liked === true;

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!canInteract || liking}
            onClick={() => mutateLike()}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
              likedByMe
                ? "border-[#e50914] bg-[#e50914] text-white shadow-[0_0_20px_rgba(229,9,20,0.25)]"
                : "border-white/15 bg-white/5 text-zinc-300 hover:border-white/25 hover:bg-white/10",
              (!canInteract || liking) && "cursor-not-allowed opacity-50",
            )}
          >
            {liking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  "h-4 w-4",
                  likedByMe ? "fill-white text-white" : "text-zinc-400",
                )}
              />
            )}
            {likedByMe ? "Liked" : "Like"}
          </button>
          <span className="text-sm font-semibold tabular-nums text-zinc-400">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          <MessageCircle className="h-4 w-4" />
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {commentsLoading ? (
          <p className="text-sm text-zinc-400">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-zinc-500">No comments yet. Start the discussion.</p>
        ) : (
          <>
            {comments.slice(0, 3).map((c: any) => (
              <CommentThread
                key={c.id || c._id}
                comment={c}
                reviewId={reviewId}
                userId={userId}
                depth={0}
                onReplyPosted={invalidateComments}
              />
            ))}
            {comments.length > 3 && (
              <Button
                type="button"
                variant="ghost"
                className="w-full rounded-xl text-xs font-semibold uppercase tracking-widest text-[#e50914] hover:bg-white/5"
                onClick={() => setModalOpen(true)}
              >
                View all {comments.length} comments
              </Button>
            )}
          </>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={canInteract ? "Write a comment..." : "Login to comment"}
          disabled={!canInteract || commenting}
          className="h-10 rounded-xl border-white/10 bg-black/30 text-sm"
        />
        <Button
          type="button"
          size="sm"
          variant="netflix"
          disabled={!canInteract || !commentText.trim() || commenting}
          onClick={() => mutateComment(commentText.trim())}
          className="h-10 rounded-xl px-4"
        >
          {commenting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Comment"}
        </Button>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="comments-modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h3 id="comments-modal-title" className="text-lg font-black text-white">
                All comments
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-4 py-4">
              <div className="space-y-3">
                {comments.map((c: any) => (
                  <CommentThread
                    key={c.id || c._id}
                    comment={c}
                    reviewId={reviewId}
                    userId={userId}
                    depth={0}
                    onReplyPosted={invalidateComments}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
