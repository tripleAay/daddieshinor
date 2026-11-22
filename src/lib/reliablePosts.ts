// Shared client-side recovery for intermittent WordPress proxy failures.
export async function fetchPostsReliably(path: string, signal: AbortSignal): Promise<unknown> {
  const url = `/api/wp-proxy?path=${encodeURIComponent(path)}`;
  const waits = [0, 2000, 5000];
  let lastError: unknown;
  for (let i = 0; i < waits.length; i++) {
    if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
    if (waits[i]) await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { signal.removeEventListener("abort", onAbort); resolve(); }, waits[i]);
      function onAbort() { clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); }
      signal.addEventListener("abort", onAbort, { once: true });
    });
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    signal.addEventListener("abort", onAbort, { once: true });
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        if (response.status < 500 && response.status !== 408 && response.status !== 429)
          throw new Error(`WordPress returned ${response.status}`);
        lastError = new Error(`WordPress temporarily unavailable (${response.status})`);
        continue;
      }
      return await response.json();
    } catch (error) {
      if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
      lastError = error;
      if (error instanceof Error && /WordPress returned 4\d\d/.test(error.message)) break;
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener("abort", onAbort);
    }
  }
  throw lastError ?? new Error("Unable to load articles");
}
