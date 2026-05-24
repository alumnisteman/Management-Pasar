import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q || q.length < 2) {
      return Response.json({ traders: [], bills: [], stalls: [] });
    }

    const like = `%${q}%`;

    const [traders, bills, stalls] = await Promise.all([
      sql(
        `SELECT t.id, t.name, t.phone, t.status, s.stall_code, s.zone
         FROM traders t
         LEFT JOIN stalls s ON t.stall_id = s.id
         WHERE LOWER(t.name) LIKE LOWER($1)
            OR t.phone LIKE $2
            OR t.nik LIKE $3
            OR LOWER(s.stall_code) LIKE LOWER($4)
         ORDER BY t.name ASC
         LIMIT 6`,
        [like, like, like, like]
      ),
      sql(
        `SELECT b.id, b.amount, b.status, b.bill_month,
                t.name as trader_name, s.stall_code, s.zone
         FROM bills b
         JOIN traders t ON b.trader_id = t.id
         LEFT JOIN stalls s ON b.stall_id = s.id
         WHERE LOWER(t.name) LIKE LOWER($1)
            OR LOWER(s.stall_code) LIKE LOWER($2)
            OR LOWER(b.status) LIKE LOWER($3)
         ORDER BY b.created_at DESC
         LIMIT 5`,
        [like, like, like]
      ),
      sql(
        `SELECT id, stall_code, zone, category, status, monthly_fee
         FROM stalls
         WHERE LOWER(stall_code) LIKE LOWER($1)
            OR LOWER(zone) LIKE LOWER($2)
            OR LOWER(category) LIKE LOWER($3)
         ORDER BY stall_code ASC
         LIMIT 5`,
        [like, like, like]
      ),
    ]);

    return Response.json({ traders, bills, stalls });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
