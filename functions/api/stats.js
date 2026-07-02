export async function onRequestGet(context) {
  const { env } = context;

  const now = new Date();

  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo"
  }).format(now);

  // 今日の件数
  const { results } = await env.DB.prepare(`
    SELECT type, count
    FROM daily_opens
    WHERE date = ?
  `)
    .bind(date)
    .all();

  const stats = {
    live: 0,
    youtube: 0,
    clip: 0,
    total: 0
  };

  for (const row of results) {
    stats[row.type] = row.count;
  }

  // サイト開設以来の累計
  const totalResult = await env.DB.prepare(`
    SELECT SUM(count) AS total
    FROM daily_opens
  `).first();

  stats.total = Number(totalResult?.total || 0);

  return new Response(JSON.stringify(stats), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}