"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Save, X, RotateCcw } from "lucide-react";

const DEFAULT_ITEMS = [
  "Not here to be loud — here to leave something that stays with you.",
  "Some words are not meant to impress you; they are meant to return you to yourself.",
  "Small moves. Deep thoughts. Quiet fire. That is how real things are built.",
  "Daddieshinor Letters — for the ones who still believe meaning matters.",
  "This is a place for culture, hustle, memory, travel, and the truths we carry quietly.",
  "If something here touched your heart, stay with it a little longer — that is how perspective begins.",
  "Grateful for every soul who passes through these words; in a fast world, your attention means everything.",
];

const STORAGE_KEY = "daddieshinor_marquee_notes_v1";

export default function MarqueeNote() {
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [draft, setDraft] = useState<string[]>(DEFAULT_ITEMS);
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === "string")
        ) {
          const cleaned = parsed
            .map((item) => item.trim())
            .filter(Boolean);

          if (cleaned.length) {
            setItems(cleaned);
            setDraft(cleaned);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load marquee notes:", error);
    }
  }, []);

  const loop = useMemo(() => [...items, ...items], [items]);

  function handleEdit() {
    setDraft(items);
    setIsEditing(true);
  }

  function handleDraftChange(index: number, value: string) {
    setDraft((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function handleAddNote() {
    setDraft((prev) => [...prev, ""]);
  }

  function handleRemoveNote(index: number) {
    setDraft((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCancel() {
    setDraft(items);
    setIsEditing(false);
  }

  function handleSave() {
    const cleaned = draft.map((item) => item.trim()).filter(Boolean);

    if (!cleaned.length) return;

    setItems(cleaned);
    setDraft(cleaned);
    setIsEditing(false);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    } catch (error) {
      console.error("Failed to save marquee notes:", error);
    }
  }

  function handleReset() {
    setItems(DEFAULT_ITEMS);
    setDraft(DEFAULT_ITEMS);
    setIsEditing(false);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ITEMS));
    } catch (error) {
      console.error("Failed to reset marquee notes:", error);
    }
  }

  return (
    <>
      <div
        className="
          relative z-30 w-full border-b border-black/5 bg-zinc-50/80 backdrop-blur-md
          dark:border-white/10 dark:bg-zinc-950/70
          md:sticky md:top-[var(--header-height,64px)]
        "
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[52px] items-center justify-between gap-3 py-2">
            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div className="relative h-9 overflow-hidden md:h-10">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-zinc-50/95 to-transparent dark:from-zinc-950/95 md:w-32" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-zinc-50/95 to-transparent dark:from-zinc-950/95 md:w-32" />

                <div className="flex h-full items-center">
                  <div
                    className="
                      marquee-track
                      flex items-center gap-8 whitespace-nowrap
                      will-change-transform md:gap-20
                    "
                  >
                    {(isMounted ? loop : [...DEFAULT_ITEMS, ...DEFAULT_ITEMS]).map(
                      (text, i) => (
                        <span
                          key={`${text}-${i}`}
                          className="text-[13px] font-medium tracking-tight text-zinc-800 dark:text-zinc-200 md:text-[15px]"
                        >
                          <span className="mx-2 inline-block h-1.5 w-1.5 rounded-full bg-[#968e68] align-middle md:mx-2.5" />
                          {text}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="
                      inline-flex items-center gap-2 rounded-full border border-black/10
                      bg-white/80 px-3 py-2 text-xs font-semibold text-zinc-700
                      shadow-sm transition hover:border-black/15 hover:bg-white
                      hover:text-black dark:border-white/10 dark:bg-white/5
                      dark:text-zinc-200 dark:hover:bg-white/10
                    "
                    aria-label="Edit marquee notes"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="
                      inline-flex items-center gap-2 rounded-full border border-black/10
                      bg-white/80 px-3 py-2 text-xs font-semibold text-zinc-700
                      shadow-sm transition hover:border-black/15 hover:bg-white
                      hover:text-black dark:border-white/10 dark:bg-white/5
                      dark:text-zinc-200 dark:hover:bg-white/10
                    "
                    aria-label="Reset marquee notes"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            className="
              w-full max-w-3xl overflow-hidden rounded-[28px] border border-black/10
              bg-white shadow-[0_25px_80px_rgba(0,0,0,0.18)]
              dark:border-white/10 dark:bg-zinc-950
            "
          >
            <div className="border-b border-black/5 px-5 py-4 dark:border-white/10 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                    Edit marquee notes
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Refine the words that move across your page and save them permanently.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="
                    inline-flex h-10 w-10 items-center justify-center rounded-full
                    border border-black/10 text-zinc-600 transition hover:bg-black/5
                    dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5
                  "
                  aria-label="Close editor"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
              <div className="space-y-4">
                {draft.map((item, index) => (
                  <div
                    key={index}
                    className="
                      rounded-2xl border border-black/8 bg-zinc-50/70 p-3
                      dark:border-white/10 dark:bg-white/[0.03]
                    "
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        Note {index + 1}
                      </span>

                      {draft.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveNote(index)}
                          className="
                            text-xs font-medium text-red-500 transition hover:text-red-600
                          "
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <textarea
                      value={item}
                      onChange={(e) => handleDraftChange(index, e.target.value)}
                      rows={3}
                      placeholder="Write a thoughtful note..."
                      className="
                        w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3
                        text-sm leading-6 text-zinc-800 outline-none transition
                        placeholder:text-zinc-400 focus:border-[#968e68] focus:ring-2
                        focus:ring-[#968e68]/20 dark:border-white/10 dark:bg-zinc-900
                        dark:text-zinc-100 dark:placeholder:text-zinc-500
                      "
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="
                    inline-flex items-center rounded-full border border-dashed border-black/15
                    px-4 py-2 text-sm font-medium text-zinc-700 transition
                    hover:border-black/25 hover:bg-black/[0.03]
                    dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/[0.04]
                  "
                >
                  + Add new note
                </button>
              </div>
            </div>

            <div className="border-t border-black/5 px-5 py-4 dark:border-white/10 sm:px-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="
                    inline-flex items-center justify-center rounded-full border border-black/10
                    px-4 py-2.5 text-sm font-semibold text-zinc-700 transition
                    hover:bg-black/[0.03] dark:border-white/10 dark:text-zinc-200
                    dark:hover:bg-white/[0.04]
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="
                    inline-flex items-center justify-center gap-2 rounded-full
                    bg-[#968e68] px-4 py-2.5 text-sm font-semibold text-white
                    shadow-sm transition hover:brightness-95 active:scale-[0.99]
                  "
                >
                  <Save className="h-4 w-4" />
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </>
  );
}