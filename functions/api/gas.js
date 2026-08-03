const DEFAULT_GAS_URL =
  "https://script.google.com/macros/s/AKfycbwaFwtnnYHV1P7TIs-C_R3MKxpW9-3_HsLBZIw4twTnpoYSwWdgqnxBhG7ChNNkwKoV/exec";

// Fresh TTL (seconds): how long a cached copy is considered up to date.
// LIVE stays short so 5-minute Apps Script triggers still feel realtime.
const FRESH_TTL_SEC = {
  new: 60,
  archive: 120,
  youtube: 15 * 60,
  clips: 30 * 60,
  hotclips: 30 * 60,
  soopclips: 30 * 60,
  soophotclips: 30 * 60,
  chzzknewclips: 30 * 60,
  chzzkbestclips: 30 * 60,
  playerlinks: 6 * 60 * 60,
  birthdays: 6 * 60 * 60,
  voicelines: 24 * 60 * 60,
  updatelog: 30 * 60
};

// Keep stale copies longer so origin failures can still be served.
const STALE_TTL_SEC = {
  new: 5 * 60,
  archive: 15 * 60,
  youtube: 2 * 60 * 60,
  clips: 6 * 60 * 60,
  hotclips: 6 * 60 * 60,
  soopclips: 6 * 60 * 60,
  soophotclips: 6 * 60 * 60,
  chzzknewclips: 6 * 60 * 60,
  chzzkbestclips: 6 * 60 * 60,
  playerlinks: 24 * 60 * 60,
  birthdays: 24 * 60 * 60,
  voicelines: 7 * 24 * 60 * 60,
  updatelog: 6 * 60 * 60
};

const DEFAULT_FRESH_SEC = 120;
const DEFAULT_STALE_SEC = 15 * 60;

export async function onRequestGet(context) {
  const { request, env, waitUntil } = context;
  const url = new URL(request.url);
  const view = String(url.searchParams.get("view") || "").trim();

  if (!view) {
    return json_({ error: "Missing view" }, 400, "no-store");
  }

  const freshSec = FRESH_TTL_SEC[view] ?? DEFAULT_FRESH_SEC;
  const staleSec = STALE_TTL_SEC[view] ?? DEFAULT_STALE_SEC;
  const cache = caches.default;
  const cacheKey = cacheKeyFor_(url.origin, view);

  const cached = await cache.match(cacheKey);
  const ageSec = cached ? ageSeconds_(cached) : null;

  if (cached && ageSec != null && ageSec < freshSec) {
    return withCacheMeta_(cached, "HIT", ageSec, freshSec);
  }

  if (cached && ageSec != null && ageSec < staleSec) {
    waitUntil(
      revalidate_(cache, cacheKey, view, env, freshSec).catch(() => {})
    );
    return withCacheMeta_(cached, "STALE", ageSec, freshSec);
  }

  try {
    const fresh = await fetchGasView_(view, env);
    const response = buildCachedResponse_(fresh.body, freshSec, "MISS");
    waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    if (cached) {
      return withCacheMeta_(
        cached,
        "STALE-ERROR",
        ageSec ?? -1,
        freshSec
      );
    }

    return json_(
      {
        error: "Upstream fetch failed",
        detail: err && err.message ? err.message : String(err)
      },
      502,
      "no-store"
    );
  }
}

async function revalidate_(cache, cacheKey, view, env, freshSec) {
  const fresh = await fetchGasView_(view, env);
  const response = buildCachedResponse_(fresh.body, freshSec, "REVALIDATED");
  await cache.put(cacheKey, response);
}

async function fetchGasView_(view, env) {
  const base = String(env?.GAS_API_URL || DEFAULT_GAS_URL).replace(/\/$/, "");
  const upstream = `${base}?view=${encodeURIComponent(view)}`;

  const res = await fetch(upstream, {
    method: "GET",
    redirect: "follow",
    headers: {
      Accept: "application/json,text/plain,*/*"
    },
    cf: {
      // Avoid Cloudflare caching the Google redirect/HTML error pages.
      cacheTtl: 0,
      cacheEverything: false
    }
  });

  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error(
      `Apps Script returned non-JSON (HTTP ${res.status}, ${contentType})`
    );
  }

  if (!res.ok) {
    throw new Error(`Apps Script HTTP ${res.status}`);
  }

  return {
    body: JSON.stringify(parsed),
    status: 200
  };
}

function cacheKeyFor_(origin, view) {
  return new Request(`${origin}/api/gas?view=${encodeURIComponent(view)}`, {
    method: "GET"
  });
}

function ageSeconds_(response) {
  const cachedAt = Number(response.headers.get("X-Kitsune-Cached-At") || 0);
  if (!cachedAt) return null;
  return Math.max(0, (Date.now() - cachedAt) / 1000);
}

function buildCachedResponse_(body, freshSec, cacheStatus) {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Browser keeps a short copy; edge freshness is enforced by this Worker.
      "Cache-Control": `public, max-age=${Math.min(freshSec, 60)}`,
      "X-Kitsune-Cached-At": String(Date.now()),
      "X-Kitsune-Cache": cacheStatus,
      "X-Kitsune-Fresh-TTL": String(freshSec)
    }
  });
}

function withCacheMeta_(response, status, ageSec, freshSec) {
  const headers = new Headers(response.headers);
  headers.set("X-Kitsune-Cache", status);
  headers.set("X-Kitsune-Cache-Age", String(Math.round(ageSec)));
  headers.set("X-Kitsune-Fresh-TTL", String(freshSec));
  headers.set(
    "Cache-Control",
    `public, max-age=${Math.min(freshSec, 60)}`
  );

  return new Response(response.body, {
    status: response.status,
    headers
  });
}

function json_(data, status, cacheControl) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl || "no-store"
    }
  });
}
