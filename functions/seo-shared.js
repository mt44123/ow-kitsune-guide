/** Shared SEO helpers for Cloudflare Pages middleware. */

export const SITE_ORIGIN = "https://owkitsune.com";
export const SITE_NAME = "OW KITSUNE GUIDE";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png?v=4`;

export const DEFAULT_SEO = {
  title: `${SITE_NAME} | Overwatch Pro Player Streams, Videos & Clips`,
  description:
    "Track Overwatch pro player live streams, YouTube videos, clips and player links."
};

/** Path segment (no leading slash) → base SEO for SPA list/utility views */
export const VIEW_SEO = {
  new: {
    title: `LIVE NEW Streams | ${SITE_NAME}`,
    description:
      "Latest Overwatch pro player live streams from Twitch, CHZZK, SOOP and more."
  },
  goats: {
    title: `MY GOATS Live Streams | ${SITE_NAME}`,
    description:
      "Follow live streams from your favorite Overwatch pro players."
  },
  hot: {
    title: `HOT Live Streams | ${SITE_NAME}`,
    description:
      "Most-watched Overwatch pro player live streams right now."
  },
  kr: {
    title: `KR Live Streams | ${SITE_NAME}`,
    description: "Live Overwatch streams from Korean pro players."
  },
  en: {
    title: `EN Live Streams | ${SITE_NAME}`,
    description: "Live Overwatch streams from English-speaking pro players."
  },
  cn: {
    title: `CN Live Streams | ${SITE_NAME}`,
    description: "Live Overwatch streams from Chinese pro players."
  },
  jp: {
    title: `JP Live Streams | ${SITE_NAME}`,
    description: "Live Overwatch streams from Japanese pro players."
  },
  intl: {
    title: `INTL Live Streams | ${SITE_NAME}`,
    description: "International Overwatch pro player live streams."
  },
  owcs: {
    title: `OWCS Live Streams | ${SITE_NAME}`,
    description: "Live streams related to Overwatch Champions Series."
  },
  faceit: {
    title: `FACEIT Live Streams | ${SITE_NAME}`,
    description: "FACEIT Overwatch pro player live streams."
  },
  archive: {
    title: `Recent Streams Archive | ${SITE_NAME}`,
    description: "Recent Overwatch pro player stream VODs and archives."
  },
  archivegoats: {
    title: `MY GOATS Stream Archive | ${SITE_NAME}`,
    description: "Stream archives for your favorite Overwatch pro players."
  },
  youtube: {
    title: `YouTube NEW Videos | ${SITE_NAME}`,
    description: "Latest YouTube videos from Overwatch pro players."
  },
  youtubehot: {
    title: `YouTube HOT Videos | ${SITE_NAME}`,
    description: "Popular YouTube videos from Overwatch pro players."
  },
  youtubejp: {
    title: `YouTube JP Videos | ${SITE_NAME}`,
    description: "Japanese Overwatch pro player YouTube videos."
  },
  clips: {
    title: `Twitch NEW Clips | ${SITE_NAME}`,
    description: "Latest Twitch clips from Overwatch pro players."
  },
  hotclips: {
    title: `Twitch HOT Clips | ${SITE_NAME}`,
    description: "Popular Twitch clips from Overwatch pro players."
  },
  jpclips: {
    title: `Twitch JP Clips | ${SITE_NAME}`,
    description: "Japanese Overwatch pro player Twitch clips."
  },
  chzzknewclips: {
    title: `CHZZK NEW Clips | ${SITE_NAME}`,
    description: "Latest CHZZK clips from Overwatch pro players."
  },
  chzzkhotclips: {
    title: `CHZZK HOT Clips | ${SITE_NAME}`,
    description: "Popular CHZZK clips from Overwatch pro players."
  },
  chzzkbestclips: {
    title: `CHZZK BEST Clips | ${SITE_NAME}`,
    description: "Top CHZZK clips from Overwatch pro players."
  },
  soopclips: {
    title: `SOOP NEW Clips | ${SITE_NAME}`,
    description: "Latest SOOP clips from Overwatch pro players."
  },
  soophotclips: {
    title: `SOOP HOT Clips | ${SITE_NAME}`,
    description: "Popular SOOP clips from Overwatch pro players."
  },
  mediagoats: {
    title: `MY GOATS Media | ${SITE_NAME}`,
    description: "Clips and videos from your favorite Overwatch pro players."
  },
  teams: {
    title: `Overwatch Teams & Rosters | ${SITE_NAME}`,
    description:
      "Overwatch team rosters with player links, live streams, YouTube and social profiles."
  },
  playerlinks: {
    title: `All Overwatch Pro Players | ${SITE_NAME}`,
    description:
      "Directory of Overwatch pro players with Twitch, CHZZK, SOOP, Bilibili, YouTube and social links."
  },
  birthdays: {
    title: `Overwatch Pro Player Birthdays | ${SITE_NAME}`,
    description: "Birthday calendar for Overwatch professional players."
  },
  favorites: {
    title: `MY GOATS Players | ${SITE_NAME}`,
    description: "Your favorite Overwatch pro player profiles and links."
  },
  howto: {
    title: `How to Use | ${SITE_NAME}`,
    description: "How to use OW KITSUNE GUIDE to track Overwatch pro players."
  },
  watchowcs: {
    title: `OWCS観戦ガイド | ${SITE_NAME}`,
    description:
      "How and where to watch Overwatch Champions Series matches."
  },
  toolstips: {
    title: `Tools & Tips | ${SITE_NAME}`,
    description: "Tools and tips for following Overwatch esports."
  },
  usefullinks: {
    title: `Useful Links | ${SITE_NAME}`,
    description: "Useful Overwatch esports links and resources."
  },
  faq: {
    title: `FAQ | ${SITE_NAME}`,
    description: "Frequently asked questions about OW KITSUNE GUIDE."
  },
  about: {
    title: `About | ${SITE_NAME}`,
    description: "About OW KITSUNE GUIDE."
  },
  privacy: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: "Privacy policy for OW KITSUNE GUIDE."
  },
  updatelog: {
    title: `Update Log | ${SITE_NAME}`,
    description: "Site update history for OW KITSUNE GUIDE."
  },
  muted: {
    title: `Muted Players | ${SITE_NAME}`,
    description: "Manage muted Overwatch players on OW KITSUNE GUIDE."
  }
};

/** High-value hub URLs for the sitemap + crawl path. */
export const HUB_PATHS = [
  "/",
  "/new",
  "/teams",
  "/playerlinks",
  "/birthdays",
  "/youtube",
  "/clips",
  "/archive",
  "/faq",
  "/about",
  "/watchowcs",
  "/howto",
  "/toolstips",
  "/usefullinks",
  "/updatelog",
  "/privacy"
];

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

export function teamToSlug(team) {
  return String(team || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function playerToSlug(name) {
  const original = String(name || "").trim();
  const slug = original
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (/^[A-Za-z0-9&\s._-]+$/.test(original)) {
    return slug;
  }

  return original;
}

export function hasPlayerProfile(player) {
  const region = String(player?.teamRegion || "")
    .replace(/^●\s*/, "")
    .trim();

  if (region.toLowerCase() === "owwc team official") {
    return false;
  }

  return !["Team Official", "Official OWCS", "HERO"].includes(region);
}

export function normalizePath(pathname) {
  const path = String(pathname || "/").replace(/\/+$/, "") || "/";
  if (path === "/index.html") return "/";
  return path;
}

export function parseRoute(pathname) {
  const path = normalizePath(pathname);

  if (path === "/") {
    return { kind: "home", path };
  }

  const teamMatch = path.match(/^\/team\/(.+)$/);
  if (teamMatch) {
    return {
      kind: "team",
      path,
      slug: decodeURIComponent(teamMatch[1])
    };
  }

  const playerMatch = path.match(/^\/player\/(.+)$/);
  if (playerMatch) {
    return {
      kind: "player",
      path,
      slug: decodeURIComponent(playerMatch[1])
    };
  }

  const view = decodeURIComponent(path.slice(1).split("/")[0] || "");
  return { kind: "view", path, view };
}

export function seoForRoute(route, entity) {
  if (route.kind === "home") {
    return {
      title: DEFAULT_SEO.title,
      description: DEFAULT_SEO.description,
      canonical: `${SITE_ORIGIN}/`,
      ogType: "website"
    };
  }

  if (route.kind === "team") {
    const name = entity?.teamName || humanizeSlug(route.slug);
    return {
      title: `${name} Players | ${SITE_NAME}`,
      description: `${name} Overwatch roster, live streams, YouTube videos, clips, player links and latest activity.`,
      canonical: `${SITE_ORIGIN}/team/${teamToSlug(name) || encodeURIComponent(route.slug)}`,
      ogType: "website",
      entityName: name
    };
  }

  if (route.kind === "player") {
    const player = entity?.player;
    const name = player?.name || humanizeSlug(route.slug);
    const team = player?.team || "Overwatch";
    const role = player?.role || "Overwatch";
    const nationality = player?.nationality || "unknown region";

    return {
      title: `${name} - ${team} Overwatch Player Profile | ${SITE_NAME}`,
      description: `${name} is a ${role} player from ${nationality} currently playing for ${team}. View Twitch, YouTube, latest streams, clips, Discord and complete Overwatch player profile.`,
      canonical: `${SITE_ORIGIN}/player/${encodeURIComponent(playerToSlug(name))}`,
      ogType: "profile",
      entityName: name,
      player
    };
  }

  const viewSeo = VIEW_SEO[route.view] || DEFAULT_SEO;
  return {
    title: viewSeo.title,
    description: viewSeo.description,
    canonical: `${SITE_ORIGIN}${route.path}`,
    ogType: "website"
  };
}

function humanizeSlug(slug) {
  return String(slug || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase()) || "Overwatch";
}

export function findPlayerBySlug(players, slug) {
  const list = Array.isArray(players) ? players : [];
  const raw = String(slug || "").trim();
  if (!raw) return null;

  const decoded = safeDecode(raw);

  return (
    list.find(p => {
      const s = playerToSlug(p.name);
      return (
        s === raw ||
        s === decoded ||
        String(p.name || "") === raw ||
        String(p.name || "") === decoded ||
        encodeURIComponent(s) === raw ||
        encodeURIComponent(String(p.name || "")) === raw
      );
    }) || null
  );
}

export function findTeamBySlug(players, slug) {
  const list = Array.isArray(players) ? players : [];
  const raw = String(slug || "").trim().toLowerCase();
  if (!raw) return null;

  const teams = new Map();
  for (const p of list) {
    const name = String(p.team || "").trim();
    if (!name) continue;
    const key = teamToSlug(name);
    if (!teams.has(key)) {
      teams.set(key, name);
    }
  }

  if (teams.has(raw)) {
    return teams.get(raw);
  }

  for (const [key, name] of teams) {
    if (key === raw || name.toLowerCase() === raw) {
      return name;
    }
  }

  return null;
}

export function rosterForTeam(players, teamName) {
  return (Array.isArray(players) ? players : []).filter(
    p => String(p.team || "").trim() === teamName
  );
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function buildJsonLd(route, seo, entity) {
  if (route.kind === "player" && entity?.player) {
    const p = entity.player;
    const sameAs = [
      p.twitchUrl,
      p.chzzkUrl,
      p.soopUrl,
      p.biliUrl,
      p.youtubeUrl,
      p.xUrl,
      p.instagramUrl
    ].filter(Boolean);

    const data = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: p.name,
      url: seo.canonical,
      nationality: p.nationality || undefined,
      birthDate: p.born || undefined,
      sameAs: sameAs.length ? sameAs : undefined,
      memberOf: p.team
        ? { "@type": "SportsTeam", name: p.team }
        : undefined
    };

    Object.keys(data).forEach(key => {
      if (data[key] === undefined) delete data[key];
    });

    return data;
  }

  if (route.kind === "team" && seo.entityName) {
    return {
      "@context": "https://schema.org",
      "@type": "SportsTeam",
      name: seo.entityName,
      url: seo.canonical,
      sport: "Overwatch"
    };
  }

  if (route.kind === "home") {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/`,
      description: DEFAULT_SEO.description
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    url: seo.canonical,
    description: seo.description,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/`
    }
  };
}

export function buildPrerenderHtml(route, seo, entity) {
  const links = [
    ["Home", "/"],
    ["Teams", "/teams"],
    ["Players", "/playerlinks"],
    ["Birthdays", "/birthdays"],
    ["YouTube", "/youtube"],
    ["Clips", "/clips"],
    ["Archive", "/archive"],
    ["FAQ", "/faq"]
  ]
    .map(
      ([label, href]) =>
        `<a href="${escapeAttr(href)}">${escapeHtml(label)}</a>`
    )
    .join(" · ");

  if (route.kind === "team" && seo.entityName) {
    const roster = entity?.roster || [];
    const playerLinks = roster
      .filter(hasPlayerProfile)
      .slice(0, 40)
      .map(p => {
        const slug = playerToSlug(p.name);
        return `<li><a href="/player/${encodeURIComponent(slug)}">${escapeHtml(
          p.name
        )}</a>${p.role ? ` — ${escapeHtml(p.role)}` : ""}</li>`;
      })
      .join("");

    return `
      <section class="seo-prerender" data-seo-prerender="true">
        <h2>${escapeHtml(seo.entityName)} Overwatch roster</h2>
        <p>${escapeHtml(seo.description)}</p>
        <p>${escapeHtml(seo.entityName)} is an Overwatch team. Team roster with Twitch, CHZZK, SOOP, Bilibili, YouTube, X, Instagram, Discord, live streams and player information.</p>
        ${playerLinks ? `<ul>${playerLinks}</ul>` : ""}
        <p class="seo-prerender-nav">${links}</p>
      </section>
    `;
  }

  if (route.kind === "player") {
    const p = entity?.player;
    const name = seo.entityName || "Player";
    const teamSlug = p?.team ? teamToSlug(p.team) : "";
    const teamLink = p?.team
      ? `<a href="/team/${encodeURIComponent(teamSlug)}">${escapeHtml(
          p.team
        )}</a>`
      : "an Overwatch team";

    const social = [
      ["Twitch", p?.twitchUrl],
      ["CHZZK", p?.chzzkUrl],
      ["SOOP", p?.soopUrl],
      ["Bilibili", p?.biliUrl],
      ["YouTube", p?.youtubeUrl],
      ["X", p?.xUrl],
      ["Instagram", p?.instagramUrl]
    ]
      .filter(([, url]) => url)
      .map(
        ([label, url]) =>
          `<a href="${escapeAttr(url)}" rel="noopener">${escapeHtml(
            label
          )}</a>`
      )
      .join(" · ");

    return `
      <section class="seo-prerender" data-seo-prerender="true">
        <h2>${escapeHtml(name)} — Overwatch player profile</h2>
        <p>${escapeHtml(seo.description)}</p>
        <p>${escapeHtml(name)} plays for ${teamLink}.</p>
        ${social ? `<p>Profiles: ${social}</p>` : ""}
        <p class="seo-prerender-nav">${links}</p>
      </section>
    `;
  }

  return `
    <section class="seo-prerender" data-seo-prerender="true">
      <h2>${escapeHtml(seo.title)}</h2>
      <p>${escapeHtml(seo.description)}</p>
      <p>OW KITSUNE GUIDE tracks Overwatch pro player live streams, videos, clips and player links across Twitch, CHZZK, SOOP, Bilibili and YouTube.</p>
      <p class="seo-prerender-nav">${links}</p>
    </section>
  `;
}

export function injectSeoIntoHtml(html, seo, route, entity) {
  let out = html;

  out = out.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(seo.title)}</title>`
  );

  out = replaceNamedMeta(out, "description", seo.description, "metaDescription");
  out = replacePropertyMeta(out, "og:title", seo.title);
  out = replacePropertyMeta(out, "og:description", seo.description);
  out = replacePropertyMeta(out, "og:url", seo.canonical);
  out = replacePropertyMeta(out, "og:type", seo.ogType || "website");
  out = replacePropertyMeta(out, "og:image", DEFAULT_OG_IMAGE);
  out = replaceNameMeta(out, "twitter:title", seo.title);
  out = replaceNameMeta(out, "twitter:description", seo.description);
  out = replaceNameMeta(out, "twitter:image", DEFAULT_OG_IMAGE);

  out = out.replace(
    /(<link[^>]*id=["']canonicalUrl["'][^>]*href=["'])[^"']*(["'])/i,
    `$1${escapeAttr(seo.canonical)}$2`
  );
  out = out.replace(
    /(<link[^>]*href=["'])[^"']*(["'][^>]*id=["']canonicalUrl["'])/i,
    `$1${escapeAttr(seo.canonical)}$2`
  );
  out = out.replace(
    /(<link[^>]*rel=["']canonical["'][^>]*href=["'])[^"']*(["'])/i,
    `$1${escapeAttr(seo.canonical)}$2`
  );

  const jsonLd = buildJsonLd(route, seo, entity);
  const jsonLdTag = `<script type="application/ld+json" data-edge-seo="true">${JSON.stringify(
    jsonLd
  )}</script>`;

  // Prefer replacing the static WebSite block; otherwise insert before </head>.
  if (/<script type="application\/ld\+json">[\s\S]*?<\/script>/i.test(out)) {
    out = out.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
      jsonLdTag
    );
  } else {
    out = out.replace(/<\/head>/i, `${jsonLdTag}\n</head>`);
  }

  const prerender = buildPrerenderHtml(route, seo, entity);
  if (/<div id="app"><\/div>/i.test(out)) {
    out = out.replace(
      /<div id="app"><\/div>/i,
      `<div id="app">${prerender}</div>`
    );
  } else if (/<div id="app">/i.test(out)) {
    out = out.replace(
      /<div id="app">/i,
      `<div id="app">${prerender}`
    );
  }

  return out;
}

function replaceNamedMeta(html, name, content, id) {
  let out = html;
  if (id) {
    const byId = new RegExp(
      `(<meta[^>]*id=["']${id}["'][^>]*content=["'])[^"']*(["'])`,
      "i"
    );
    if (byId.test(out)) {
      return out.replace(byId, `$1${escapeAttr(content)}$2`);
    }
  }
  return replaceNameMeta(out, name, content);
}

function replaceNameMeta(html, name, content) {
  const re = new RegExp(
    `(<meta[^>]*name=["']${name}["'][^>]*content=["'])[^"']*(["'])`,
    "i"
  );
  if (re.test(html)) {
    return html.replace(re, `$1${escapeAttr(content)}$2`);
  }

  const re2 = new RegExp(
    `(<meta[^>]*content=["'])[^"']*(["'][^>]*name=["']${name}["'])`,
    "i"
  );
  if (re2.test(html)) {
    return html.replace(re2, `$1${escapeAttr(content)}$2`);
  }

  return html.replace(
    /<\/head>/i,
    `<meta name="${escapeAttr(name)}" content="${escapeAttr(content)}">\n</head>`
  );
}

function replacePropertyMeta(html, property, content) {
  const re = new RegExp(
    `(<meta[^>]*property=["']${property}["'][^>]*content=["'])[^"']*(["'])`,
    "i"
  );
  if (re.test(html)) {
    return html.replace(re, `$1${escapeAttr(content)}$2`);
  }

  const re2 = new RegExp(
    `(<meta[^>]*content=["'])[^"']*(["'][^>]*property=["']${property}["'])`,
    "i"
  );
  if (re2.test(html)) {
    return html.replace(re2, `$1${escapeAttr(content)}$2`);
  }

  return html.replace(
    /<\/head>/i,
    `<meta property="${escapeAttr(property)}" content="${escapeAttr(
      content
    )}">\n</head>`
  );
}

export function buildSitemapXml(players, lastmod) {
  const day = lastmod || new Date().toISOString().slice(0, 10);
  const urls = new Set(HUB_PATHS);

  const list = Array.isArray(players) ? players : [];
  const teams = new Set();

  for (const p of list) {
    const team = String(p.team || "").trim();
    if (team) {
      const slug = teamToSlug(team);
      if (slug) teams.add(slug);
    }

    if (hasPlayerProfile(p) && p.name) {
      const slug = playerToSlug(p.name);
      if (slug) {
        urls.add(`/player/${encodeURIComponent(slug)}`);
      }
    }
  }

  for (const slug of teams) {
    urls.add(`/team/${slug}`);
  }

  const body = [...urls]
    .sort()
    .map(
      path => `  <url>
    <loc>${SITE_ORIGIN}${path === "/" ? "/" : path}</loc>
    <lastmod>${day}</lastmod>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}
