import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { onRequest } from "../functions/api/google-reviews.ts";

const env = { GOOGLE_PLACES_API_KEY: "test-secret-never-return", GOOGLE_PLACE_ID: "ChIJUywCm23vwIcRoV5FtFAqW3A" };
const request = (path = "", init) => new Request(`https://example.com/api/google-reviews${path}`, init);
const review = (overrides = {}) => ({
  rating: 5,
  originalText: { text: "Original test feedback <script>alert(1)</script>", languageCode: "en" },
  text: { text: "Translated test feedback", languageCode: "fr" },
  publishTime: "2026-09-20T12:00:00Z",
  googleMapsUri: "https://www.google.com/maps/reviews/test-review",
  authorAttribution: { displayName: "Test Author", uri: "https://www.google.com/maps/contrib/test", photoUri: "https://example.com/test-avatar.png" },
  ...overrides,
});
afterEach(() => mock.restoreAll());

test("missing configuration and non-GET methods never call Google", async () => {
  const fetch = mock.method(globalThis, "fetch", () => { throw new Error("Must not call upstream"); });
  const missing = await onRequest({ request: request(), env: {} });
  assert.equal(missing.status, 503);
  for (const method of ["POST", "HEAD", "OPTIONS"]) {
    const result = await onRequest({ request: request("", { method }), env });
    assert.equal(result.status, 405);
    assert.equal(result.headers.get("allow"), "GET");
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test("uses only configured place and headers; preserves original text, dates and attribution for five-star reviews", async () => {
  mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, `https://places.googleapis.com/v1/places/${env.GOOGLE_PLACE_ID}?languageCode=en`);
    assert.equal(options.headers["X-Goog-Api-Key"], env.GOOGLE_PLACES_API_KEY);
    assert.equal(options.headers["X-Goog-FieldMask"], "reviews,attributions");
    assert.equal(options.redirect, "manual");
    assert.equal(options.cache, undefined);
    assert.equal(options.headers["Cache-Control"], "no-store");
    assert.deepEqual(options.cf, { cacheTtlByStatus: { "100-599": -1 } });
    return Response.json({ reviews: [review({ rating: 2 }), review()], attributions: [{ provider: "Test provider", providerUri: "https://example.com/source" }] });
  });
  const result = await onRequest({ request: request("?place_id=attacker&key=other&fields=*"), env });
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("cache-control"), "no-store");
  assert.equal(result.headers.get("cdn-cache-control"), "no-store");
  const body = await result.json();
  assert.deepEqual(body.reviews.map(r => r.rating), [5]);
  assert.equal(body.reviews[0].text, review().originalText.text);
  assert.equal(body.reviews[0].date, "2026-09-20T12:00:00.000Z");
  assert.equal(body.reviews[0].authorUrl, review().authorAttribution.uri);
  assert.equal(body.reviews[0].avatarUrl, review().authorAttribution.photoUri);
  assert.deepEqual(body.attributions, [{ name: "Test provider", uri: "https://example.com/source" }]);
  assert.ok(!JSON.stringify(body).includes(env.GOOGLE_PLACES_API_KEY));
});

test("omits unusable reviews and unsafe URLs without inventing dates", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ reviews: [
    review({ googleMapsUri: "javascript:alert(1)" }),
    review({ rating: 7 }),
    review({ originalText: { text: "" }, text: {} }),
    review({ authorAttribution: {} }),
    review({ publishTime: "not-a-date", authorAttribution: { displayName: "Test", uri: "javascript:alert(1)", photoUri: "data:image/svg+xml,test" } }),
  ] }));
  const body = await (await onRequest({ request: request(), env })).json();
  assert.equal(body.reviews.length, 1);
  assert.equal(body.reviews[0].date, null);
  assert.equal(body.reviews[0].authorUrl, null);
  assert.equal(body.reviews[0].avatarUrl, null);
});

test("caps Google's selection at five, retaining source order for equal dates", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ reviews: Array.from({ length: 7 }, (_, i) => review({ authorAttribution: { displayName: `Author ${i}` } })) }));
  const body = await (await onRequest({ request: request(), env })).json();
  assert.deepEqual(body.reviews.map(r => r.name), ["Author 0", "Author 1", "Author 2", "Author 3", "Author 4"]);
});

test("orders by publication time newest first, placing undated reviews last and preserving ties", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ reviews: [
    review({ authorAttribution: { displayName: "Missing date" }, publishTime: undefined }),
    review({ authorAttribution: { displayName: "Older" }, publishTime: "2026-06-16T20:04:06Z" }),
    review({ authorAttribution: { displayName: "Newest first tie" }, publishTime: "2026-09-21T10:00:00-04:00" }),
    review({ authorAttribution: { displayName: "Invalid date" }, publishTime: "not-a-date" }),
    review({ authorAttribution: { displayName: "Newest second tie" }, publishTime: "2026-09-21T14:00:00Z" }),
  ] }));
  const body = await (await onRequest({ request: request(), env })).json();
  assert.deepEqual(body.reviews.map(r => r.name), ["Newest first tie", "Newest second tie", "Older", "Missing date", "Invalid date"]);
  assert.deepEqual(body.reviews.map(r => r.date), ["2026-09-21T14:00:00.000Z", "2026-09-21T14:00:00.000Z", "2026-06-16T20:04:06.000Z", null, null]);
});

test("excludes every rating below five and returns no live reviews when none qualify", async () => {
  for (const ratings of [[1, 2, 3, 4, 5], [1, 2, 3, 4]]) {
    mock.method(globalThis, "fetch", async () => Response.json({ reviews: ratings.map(rating => review({ rating })) }));
    const result = await onRequest({ request: request(), env });
    assert.equal(result.status, 200);
    const body = await result.json();
    assert.deepEqual(body.reviews.map(r => r.rating), ratings.includes(5) ? [5] : []);
    mock.restoreAll();
  }
});

test("empty Google response allows the client to keep its static fallback", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({}));
  const body = await (await onRequest({ request: request(), env })).json();
  assert.deepEqual(body, { reviews: [], attributions: [] });
});

test("API errors never expose upstream bodies or credentials", async () => {
  for (const status of [302, 403, 429, 500]) {
    mock.method(globalThis, "fetch", async () => new Response(env.GOOGLE_PLACES_API_KEY, { status }));
    const result = await onRequest({ request: request(), env });
    assert.equal(result.status, 503);
    assert.deepEqual(await result.json(), { error: "Reviews are temporarily unavailable.", code: "GOOGLE_REQUEST_FAILED", upstreamStatus: status });
    mock.restoreAll();
  }
  for (const implementation of [async () => { throw new Error(env.GOOGLE_PLACES_API_KEY); }, async () => new Response("malformed JSON")]) {
    mock.method(globalThis, "fetch", implementation);
    assert.equal((await onRequest({ request: request(), env })).status, 503);
    mock.restoreAll();
  }
});

test("exposes only a safe diagnostic reason, never Google error messages or metadata", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ error: {
    message: env.GOOGLE_PLACES_API_KEY,
    details: [{ reason: "BILLING_DISABLED", metadata: { key: env.GOOGLE_PLACES_API_KEY } }],
  } }, { status: 403 }));
  const body = await (await onRequest({ request: request(), env })).json();
  assert.equal(body.reason, "BILLING_DISABLED");
  assert.equal(body.upstreamStatus, 403);
  assert.ok(!JSON.stringify(body).includes(env.GOOGLE_PLACES_API_KEY));
});

test("aborts a stalled upstream request", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  mock.method(globalThis, "fetch", (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
  }));
  const pending = onRequest({ request: request(), env });
  t.mock.timers.tick(6001);
  assert.equal((await pending).status, 503);
  t.mock.timers.reset();
});

test("rejects cross-site browser requests before calling Google", async () => {
  const fetch = mock.method(globalThis, "fetch", () => { throw new Error("Must not call upstream"); });
  assert.equal((await onRequest({ request: request("", { headers: { "Sec-Fetch-Site": "cross-site" } }), env })).status, 403);
  assert.equal(fetch.mock.callCount(), 0);
});
