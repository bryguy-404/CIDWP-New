import type { GoogleReviewsResponse, LivePatientReview } from "../../src/lib/reviews";

interface Context {
  request: Request;
  env: { GOOGLE_PLACES_API_KEY?: string; GOOGLE_PLACE_ID?: string };
}

const responseHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "CDN-Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function httpsUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

function normalizeReview(value: unknown): LivePatientReview | null {
  const review = record(value);
  const author = record(review.authorAttribution);
  // Preserve the author's original words rather than a machine translation.
  const original = record(review.originalText);
  const content = text(original.text) ? original : record(review.text);
  const name = text(author.displayName);
  const reviewText = text(content.text);
  const sourceUrl = httpsUrl(review.googleMapsUri);
  const rating = review.rating;
  if (!name || !reviewText || !sourceUrl || typeof rating !== "number"
    || !Number.isInteger(rating) || rating < 1 || rating > 5) return null;
  const date = text(review.publishTime);
  return {
    name, text: reviewText, sourceUrl,
    rating: rating as LivePatientReview["rating"],
    date: date && Number.isFinite(Date.parse(date)) ? new Date(date).toISOString() : null,
    authorUrl: httpsUrl(author.uri),
    avatarUrl: httpsUrl(author.photoUri),
    languageCode: text(content.languageCode),
  };
}

export async function onRequest({ request, env }: Context): Promise<Response> {
  if (request.method !== "GET") {
    return new Response(null, { status: 405, headers: { ...responseHeaders, Allow: "GET" } });
  }
  // The endpoint only reads the configured practice; callers cannot choose a
  // place, field mask, upstream URL, or key and turn this into a billed proxy.
  const placeId = env.GOOGLE_PLACE_ID?.trim();
  const apiKey = env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey || !placeId || !/^[A-Za-z0-9_-]+$/.test(placeId)) {
    console.warn("Google reviews unavailable: missing or invalid server configuration.");
    return json({ error: "Reviews are temporarily unavailable.", code: "CONFIGURATION_MISSING" }, 503);
  }
  if (request.headers.get("Sec-Fetch-Site") === "cross-site") {
    return json({ error: "Cross-site requests are not supported." }, 403);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const result = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=en`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews,attributions",
      },
      signal: controller.signal,
      redirect: "error",
      cache: "no-store",
    });
    if (!result.ok) {
      // Log only the status; never log credentials, response bodies, or reviews.
      console.warn(`Google reviews unavailable: upstream HTTP ${result.status}.`);
      // Google's ErrorInfo reason is a machine-readable enum. Return only that
      // restricted code, never its message/metadata (which may contain a key).
      const failure = record(await result.json().catch(() => null));
      const details = record(failure.error).details;
      const reason = (Array.isArray(details) ? details : []).map(value => record(value).reason)
        .find((value): value is string => typeof value === "string" && /^[A-Z][A-Z_]{2,63}$/.test(value));
      return json({ error: "Reviews are temporarily unavailable.", code: "GOOGLE_REQUEST_FAILED", upstreamStatus: result.status, ...(reason ? { reason } : {}) }, 503);
    }
    const place = record(await result.json());
    const reviews = (Array.isArray(place.reviews) ? place.reviews : [])
      .slice(0, 5).map(normalizeReview).filter((review): review is LivePatientReview => review !== null);
    const attributions = (Array.isArray(place.attributions) ? place.attributions : []).flatMap(value => {
      const attribution = record(value);
      const name = text(attribution.provider);
      return name ? [{ name, uri: httpsUrl(attribution.providerUri) }] : [];
    });
    const body: GoogleReviewsResponse = { reviews, attributions };
    return json(body);
  } catch {
    console.warn("Google reviews unavailable: upstream request failed or timed out.");
    return json({ error: "Reviews are temporarily unavailable.", code: controller.signal.aborted ? "GOOGLE_TIMEOUT" : "GOOGLE_UNAVAILABLE" }, 503);
  } finally {
    clearTimeout(timeout);
  }
}
