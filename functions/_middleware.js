/**
 * Edge SEO for the SPA:
 * - path-specific title / description / canonical / OG tags
 * - unique HTML body snippets for crawlers (player / team / views)
 * - dynamic sitemap.xml from playerlinks data
 */

import {
  buildSitemapXml,
  findPlayerBySlug,
  findTeamBySlug,
  injectSeoIntoHtml,
  parseRoute,
  rosterForTeam,
  seoForRoute
} from "./seo-shared.js";

const PLAYERLINKS_TTL_MS = 30 * 60 * 1000;
const HTML_CACHE_TTL_SEC = 60 * 60;

/** @type {{ at: number, players: any[] } | null} */
let memoryPlayers = null;

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Static assets & API: do not touch.
  if (shouldSkipPath_(url.pathname)) {
    return context.next();
  }

  if (url.pathname === "/sitemap.xml") {
    return serveSitemap_(context);
  }

  // Only rewrite document HTML.
  if (!isDocumentRequest_(context.request)) {
    return context.next();
  }

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (
    response.status !== 200 ||
    !contentType.includes("text/html")
  ) {
    return response;
  }

  try {
    const route = parseRoute(url.pathname);
    const entity = await resolveEntity_(context, route);
    const seo = seoForRoute(route, entity);

    const html = await response.text();
    const nextHtml = injectSeoIntoHtml(html, seo, route, entity);

    const headers = new Headers(response.headers);
    headers.set("cache-control", `public, max-age=0, must-revalidate`);
    headers.set("x-owk-seo", route.kind);
    // Vary so bot/browser caches do not collide if Accept differs.
    headers.append("vary", "Accept");

    return new Response(nextHtml, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (err) {
    // Fail open: never break the site if SEO injection fails.
    console.error("seo middleware failed", err);
    return response;
  }
}

function shouldSkipPath_(pathname) {
  if (!pathname || pathname === "/") return false;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/js/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/TeamLogo/") ||
    pathname.startsWith("/functions/")
  ) {
    return true;
  }

  if (
    pathname === "/style.css" ||
    pathname === "/manifest.json" ||
    pathname === "/robots.txt" ||
    pathname === "/service-worker.js" ||
    pathname === "/favicon.ico"
  ) {
    return true;
  }

  // Versioned or static binary assets
  if (/\.(css|js|map|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|json|txt|xml)$/i.test(pathname)) {
    // sitemap.xml is handled above — skip list excludes it via earlier branch
    if (pathname === "/sitemap.xml") return false;
    return true;
  }

  return false;
}

function isDocumentRequest_(request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return false;
  }

  const accept = request.headers.get("accept") || "";
  // Crawlers and browsers both send text/html for navigations.
  if (accept.includes("text/html")) return true;
  // URL Inspection / some bots omit Accept or send */*
  if (!accept || accept === "*/*") return true;
  return false;
}

async function serveSitemap_(context) {
  try {
    const players = await getPlayers_(context);
    const lastmod = new Date().toISOString().slice(0, 10);
    const xml = buildSitemapXml(players, lastmod);

    return new Response(xml, {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": `public, max-age=${HTML_CACHE_TTL_SEC}`,
        "x-owk-sitemap": "dynamic"
      }
    });
  } catch (err) {
    console.error("sitemap failed", err);
    // Fall back to static asset if present.
    return context.next();
  }
}

async function resolveEntity_(context, route) {
  if (route.kind !== "team" && route.kind !== "player") {
    return null;
  }

  const players = await getPlayers_(context);

  if (route.kind === "player") {
    const player = findPlayerBySlug(players, route.slug);
    return player ? { player } : null;
  }

  const teamName = findTeamBySlug(players, route.slug);
  if (!teamName) return null;

  return {
    teamName,
    roster: rosterForTeam(players, teamName)
  };
}

async function getPlayers_(context) {
  const now = Date.now();
  if (
    memoryPlayers &&
    now - memoryPlayers.at < PLAYERLINKS_TTL_MS &&
    Array.isArray(memoryPlayers.players)
  ) {
    return memoryPlayers.players;
  }

  const origin = new URL(context.request.url).origin;
  const apiUrl = new URL("/api/gas?view=playerlinks", origin);

  // Prefer edge cache first to avoid hammering origin.
  const cache = caches.default;
  const cacheKey = new Request(apiUrl.toString(), { method: "GET" });
  let res = await cache.match(cacheKey);

  if (!res) {
    res = await fetch(apiUrl.toString(), {
      headers: {
        accept: "application/json",
        // Internal edge hop; no cookies needed.
      }
    });

    if (res.ok) {
      const toCache = new Response(res.clone().body, {
        status: res.status,
        headers: {
          "content-type":
            res.headers.get("content-type") || "application/json",
          "cache-control": `public, max-age=${Math.floor(
            PLAYERLINKS_TTL_MS / 1000
          )}`
        }
      });
      context.waitUntil(cache.put(cacheKey, toCache).catch(() => {}));
    }
  }

  if (!res || !res.ok) {
    return memoryPlayers?.players || [];
  }

  const data = await res.json();
  const players = Array.isArray(data?.playerLinks)
    ? data.playerLinks
    : Array.isArray(data)
      ? data
      : [];

  memoryPlayers = { at: now, players };
  return players;
}
