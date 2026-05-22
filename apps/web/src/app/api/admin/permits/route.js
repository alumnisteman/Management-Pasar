import sql from "@/app/api/utils/sql";

// ── GET: list permits or verify QR token ────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const token = searchParams.get("token") || "";

    // QR verification mode
    if (token) {
      const allPermits = await sql`SELECT * FROM permits`;
      const permit = allPermits.find((p) => p.qr_token === token);
      if (!permit) return Response.json({ valid: false });

      const traders = await sql`
        SELECT t.*, s.stall_code, s.zone FROM traders t LEFT JOIN stalls s ON t.stall_id = s.id
      `;
      const trader = traders.find((t) => t.id === permit.trader_id) || {};
      const isExpired =
        permit.status === "expired" ||
        (permit.expiry_date && new Date(permit.expiry_date) < new Date());

      return Response.json({
        valid: !isExpired,
        permit: {
          trader_name: trader.name || null,
          permit_number: permit.permit_number,
          stall_code: trader.stall_code || null,
          expiry_date: permit.expiry_date,
        },
      });
    }

    // List permits — enrich with trader + stall data
    const traders = await sql`
      SELECT t.*, s.stall_code, s.zone FROM traders t LEFT JOIN stalls s ON t.stall_id = s.id
    `;
    let permits = await sql`SELECT * FROM permits`;

    const rows = permits.map((p) => {
      const trader = traders.find((t) => t.id === p.trader_id) || {};
      return {
        ...p,
        trader_name: trader.name || null,
        stall_code: trader.stall_code || null,
        zone: trader.zone || null,
        trader_phone: trader.phone || null,
      };
    });

    const filtered = status ? rows.filter((r) => r.status === status) : rows;
    return Response.json(filtered);
  } catch (error) {
    console.error("[GET /api/admin/permits]", error);
    return Response.json({ error: "Failed to fetch permits" }, { status: 500 });
  }
}

// ── POST: issue new SIPTU ────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { trader_id, expiry_date } = body;

    if (!trader_id) {
      return Response.json({ error: "trader_id tidak boleh kosong" }, { status: 400 });
    }

    const traders = await sql`
      SELECT t.*, s.stall_code, s.zone FROM traders t LEFT JOIN stalls s ON t.stall_id = s.id
    `;
    const trader = traders.find((t) => String(t.id) === String(trader_id));
    if (!trader) {
      return Response.json({ error: "Pedagang tidak ditemukan" }, { status: 404 });
    }

    const year = new Date().getFullYear();
    const allPermits = await sql`SELECT * FROM permits`;
    const newId = allPermits.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const permitNum = `SIPTU-${year}-${String(newId).padStart(4, "0")}`;
    const issueDate = new Date().toISOString().split("T")[0];
    const expiry =
      expiry_date ||
      new Date(new Date().setFullYear(year + 1)).toISOString().split("T")[0];
    const qrToken = Math.random().toString(36).slice(2);

    const newPermit = await sql`
      INSERT INTO permits (trader_id, permit_number, issue_date, expiry_date, status, qr_token)
      VALUES (${Number(trader_id)}, ${permitNum}, ${issueDate}, ${expiry}, 'active', ${qrToken})
      ON CONFLICT (permit_number) DO NOTHING
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('SIPTU', 'CREATE', ${`SIPTU ${permitNum} diterbitkan untuk pedagang: ${trader.name}`})
    `;

    return Response.json({
      id: newId,
      trader_id: Number(trader_id),
      permit_number: permitNum,
      issue_date: issueDate,
      expiry_date: expiry,
      status: "active",
      qr_token: qrToken,
      trader_name: trader.name,
      stall_code: trader.stall_code || null,
    });
  } catch (error) {
    console.error("[POST /api/admin/permits]", error);
    return Response.json({ error: "Failed to create permit" }, { status: 500 });
  }
}

// ── PATCH: update permit (renew / change status) ─────────────────────────────
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, expiry_date } = body;

    if (!id) {
      return Response.json({ error: "ID permit tidak valid" }, { status: 400 });
    }

    const allPermits = await sql`SELECT * FROM permits`;
    const permit = allPermits.find((p) => p.id === Number(id));
    if (!permit) {
      return Response.json({ error: "Permit tidak ditemukan" }, { status: 404 });
    }

    if (status !== undefined) permit.status = status;
    if (expiry_date !== undefined) permit.expiry_date = expiry_date;

    // Use sql UPDATE via tagged template string
    await sql`
      UPDATE permits SET status = ${permit.status}, expiry_date = ${permit.expiry_date} WHERE id = ${Number(id)}
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('SIPTU', 'UPDATE', ${`SIPTU ID ${id} diperbarui: status=${permit.status}`})
    `;

    return Response.json(permit);
  } catch (error) {
    console.error("[PATCH /api/admin/permits]", error);
    return Response.json({ error: "Failed to update permit" }, { status: 500 });
  }
}
