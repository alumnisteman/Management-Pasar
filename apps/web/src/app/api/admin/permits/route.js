import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const token = searchParams.get("token") || "";

    // QR verification
    if (token) {
      const rows = await sql`
        SELECT p.*, t.name as trader_name, t.phone, t.trader_type,
               s.stall_code, s.zone, s.category
        FROM permits p
        JOIN traders t ON p.trader_id = t.id
        LEFT JOIN stalls s ON t.stall_id = s.id
        WHERE p.qr_token = ${token}
      `;
      if (!rows[0]) return Response.json({ valid: false });
      return Response.json({ valid: true, permit: rows[0] });
    }

    let query = `
      SELECT p.*, t.name as trader_name, t.phone, s.stall_code, s.zone
      FROM permits p
      JOIN traders t ON p.trader_id = t.id
      LEFT JOIN stalls s ON t.stall_id = s.id
      WHERE 1=1
    `;
    const values = [];
    let idx = 1;
    if (status) {
      query += ` AND p.status = $${idx}`;
      values.push(status);
      idx++;
    }
    query += ` ORDER BY p.created_at DESC`;

    const rows = await sql(query, values);
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch permits" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { trader_id, expiry_date } = body;

    const trader = await sql`SELECT * FROM traders WHERE id = ${trader_id}`;
    if (!trader[0])
      return Response.json({ error: "Trader not found" }, { status: 404 });

    const year = new Date().getFullYear();
    const existingCount =
      await sql`SELECT COUNT(*) as cnt FROM permits WHERE permit_number LIKE ${`SIPTU-${year}-%`}`;
    const seq = Number(existingCount[0].cnt) + 1;
    const permitNum = `SIPTU-${year}-${String(seq).padStart(4, "0")}`;
    const issueDate = new Date().toISOString().split("T")[0];
    const qrToken =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    const permit = await sql`
      INSERT INTO permits (trader_id, permit_number, issue_date, expiry_date, status, qr_token)
      VALUES (${trader_id}, ${permitNum}, ${issueDate}, ${expiry_date}, 'active', ${qrToken})
      RETURNING *
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('SIPTU', 'CREATE', ${`SIPTU ${permitNum} diterbitkan untuk ${trader[0].name}`})
    `;

    return Response.json(permit[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create permit" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, expiry_date } = body;

    const updated = await sql`
      UPDATE permits SET
        status = COALESCE(${status}, status),
        expiry_date = COALESCE(${expiry_date ?? null}, expiry_date)
      WHERE id = ${id}
      RETURNING *
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('SIPTU', 'UPDATE', ${`SIPTU #${id} diperbarui`})
    `;

    return Response.json(updated[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update permit" }, { status: 500 });
  }
}
