export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    if (!env.DB) {
      return json_({ ok: false, error: "D1 binding DB not found" }, 500);
    }

    const body = await request.json().catch(() => ({}));
    const type = String(body.type || "").toLowerCase();

    const allowedTypes = ["live", "youtube", "clip"];

    if (!allowedTypes.includes(type)) {
      return json_({ ok: false, error: "Invalid type" }, 400);
    }

    const now = new Date();

    const date = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo"
    }).format(now);

    const updatedAt = now.toISOString();

    await env.DB.prepare(`
      INSERT INTO daily_opens (date, type, count, updated_at)
      VALUES (?, ?, 1, ?)
      ON CONFLICT(date, type)
      DO UPDATE SET
        count = count + 1,
        updated_at = excluded.updated_at
    `)
      .bind(date, type, updatedAt)
      .run();

    return json_({ ok: true });
  } catch (err) {
    return json_({
      ok: false,
      error: err && err.message ? err.message : String(err)
    }, 500);
  }
}

function json_(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
