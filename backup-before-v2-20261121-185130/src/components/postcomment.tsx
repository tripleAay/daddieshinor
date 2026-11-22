"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { MessageSquare, Send, Loader2, PenSquare } from "lucide-react";

const WP_BASE_URL = (
  process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com"
).replace(/\/+$/, "");

type WPComment = {
  id: number;
  author_name: string;
  date: string;
  content?: { rendered?: string };
};

type Props = {
  postId: number;
};

function formatCommentDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(input: string) {
  return (input || "").replace(/<[^>]*>/g, "").trim();
}

export default function PostComments({ postId }: Props) {
  const [comments, setComments] = useState<WPComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const commentCount = useMemo(() => comments.length, [comments]);
  const hasComments = commentCount > 0;

  const commentPreview = useMemo(() => {
    if (!comments.length) return "";
    return stripHtml(comments[0]?.content?.rendered || "").slice(0, 120);
  }, [comments]);

  useEffect(() => {
    let ignore = false;

    async function loadComments() {
      try {
        setLoading(true);
        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wp/v2/comments?post=${postId}&per_page=50&orderby=date&order=desc`
        );

        if (!res.ok) {
          throw new Error("Unable to load comments.");
        }

        const data: WPComment[] = await res.json();
        if (!ignore) {
          setComments(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
          setComments([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      ignore = true;
    };
  }, [postId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanComment = comment.trim();

    if (!cleanName || !cleanEmail || !cleanComment) {
      setErrorMessage("Please complete your name, email, and comment.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: postId,
          author_name: cleanName,
          author_email: cleanEmail,
          content: cleanComment,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          data?.message ||
          "Your comment could not be submitted. WordPress may require moderation or REST comment posting may be blocked.";
        throw new Error(message);
      }

      setName("");
      setEmail("");
      setComment("");
      setSuccessMessage("Your comment has been submitted successfully.");

      const refresh = await fetch(
        `${WP_BASE_URL}/wp-json/wp/v2/comments?post=${postId}&per_page=50&orderby=date&order=desc`
      );
      if (refresh.ok) {
        const refreshedComments: WPComment[] = await refresh.json();
        setComments(Array.isArray(refreshedComments) ? refreshedComments : []);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your comment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-20 text-zinc-900 dark:text-zinc-100">
      <style>{`
        @keyframes commentRoll {
          0% { transform: translate(0, -50%); }
          50% { transform: translate(132px, -50%); }
          100% { transform: translate(0, -50%); }
        }
      `}</style>

      

      <div className="mt-10">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">
              Read comments
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Follow the conversation before adding yours.
            </p>
          </div>

          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {loading ? "Loading..." : `${commentCount} comment${commentCount === 1 ? "" : "s"}`}
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-300/80 px-6 py-10 text-center dark:border-zinc-700/80">
              <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                No comments yet.
              </p>
              <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                Be the first person to open the conversation here.
              </p>
            </div>
          ) : (
            <div className="relative pl-0 sm:pl-5">
              <div className="absolute left-0 top-0 hidden h-full w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />

              <div className="space-y-1">
                {comments.map((item, index) => (
                  <article
                    key={item.id}
                    className={`relative py-6 sm:pl-8 ${
                      index !== 0 ? "border-t border-zinc-200 dark:border-zinc-800" : ""
                    }`}
                  >
                    <div className="absolute left-[-5px] top-9 hidden h-2.5 w-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 sm:block" />

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h4 className="text-[15px] font-semibold text-zinc-950 dark:text-zinc-100">
                        {item.author_name || "Anonymous"}
                      </h4>
                      <span className="text-zinc-300 dark:text-zinc-600">•</span>
                      <time className="text-sm text-zinc-500 dark:text-zinc-400">
                        {formatCommentDate(item.date)}
                      </time>
                    </div>

                    <div
                      className="mt-3 max-w-none text-[15px] leading-8 text-zinc-800 dark:text-zinc-200 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-0 [&_a]:text-zinc-900 dark:[&_a]:text-zinc-100 [&_strong]:font-semibold [&_em]:italic [&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1"
                      dangerouslySetInnerHTML={{
                        __html: item.content?.rendered || "",
                      }}
                    />
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        id="write-comment"
        className="mt-12 rounded-[28px] border border-zinc-200/80 bg-zinc-50/70 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:shadow-none sm:p-8"
      >
        <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-100">
            Post comment
          </h3>
          <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Leave something thoughtful, sharp, or honest. Good comment spaces feel
            alive when people write like real humans.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-200/70 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-200 dark:focus:ring-zinc-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-200/70 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-200 dark:focus:ring-zinc-800"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your perspective here..."
              rows={7}
              className="w-full resize-none rounded-[24px] border border-zinc-300 bg-white px-4 py-4 text-[15px] leading-8 text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-200/70 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-200 dark:focus:ring-zinc-800"
            />
          </div>

          {successMessage ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-400">
              {successMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-400">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-6 text-zinc-500 dark:text-zinc-400">
              Your comment may appear immediately or wait for moderation.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="group relative inline-flex min-w-[180px] items-center justify-center gap-2 overflow-hidden rounded-full border border-zinc-900 bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:shadow-zinc-100/10"
            >
              <span
                className="absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white dark:bg-zinc-900"
                style={
                  submitting
                    ? { animation: "commentRoll 0.8s linear infinite" }
                    : undefined
                }
              />

              <span className="relative z-10 inline-flex items-center gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    Post Comment
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}