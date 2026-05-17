import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const token = searchParams.get("token") || "";

    if (token) {
      const found = await sql`SELECT * FROM permits WHERE qr_token = ${token}`;
      if (!found || !found[0]) return Response.json({ valid: false });
      const p = found[0];
      const today = new Date().toISOString().split("T")[0];
      const isValid = p.status === "active" && p.expiry_date >= today;
      const traders = await sql`SELECT * FROM traders`;
      const stalls = await sql`SELECT * FROM stalls`;
      const trader = traders.find((t) => t.id === p.trader_id) || {};
      const stall = stalls.find((s) => s.id === trader.stall_id) || {};
      return Response.json({
        valid: isValid,
        permit: {
          trader_name: trader.name || "",
          permit_number: p.permit_number,
          stall_code: stall.stall_code || "",
          expiry_date: p.expiry_date,
        },
      });
    }

    const permits = await sql`SELECT * FROM permits`;
    const traders = await sql`SELECT * FROM traders`;
    const stalls = await sql`SELECT * FROM stalls`;

    let rows = permits.map((p) => {
      const trader = traders.find((t) => t.id === p.trader_id) || {};
      const stall = stalls.find((s) => s.id === trader.stall_id) || {};
      return {
        ...p,
        trader_name: trader.name || "",
        stall_code: stall.stall_code || "",
        zone: stall.zone || "",
      };
    });

    if (status) {
      rows = rows.filter((r) => r.status === status);
    }

    return Response.json(rows);
  } catch (error) {
    console.error("[GET /api/admin/permits]", error);
    return Response.json({ error: "Failed to fetch permits" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { trader_id, expiry_date } = body;

    const traders = await sql`SELECT * FROM traders`;
    const trader = traders.find((t) => t.id === Number(trader_id));
    if (!trader) {
      return Response.json({ error: "Trader not found" }, { status: 404 });
    }

    const permits = await sql`SELECT * FROM permits`;
    const existing = permits.find((p) => p.trader_id === Number(trader_id));
    if (existing) {
      return Response.json(
        { error: "Trader sudah memiliki SIPTU" },
        { status: 409 }
      );
    }

    const year = new Date().getFullYear();
    const padId = String(trader_id).padStart(4, "0");
    const permitNum = `SIPTU-${year}-${padId}`;
    const qrToken = Math.random().toString(36).slice(2);
    const issueDate = new Date().toISOString().split("T")[0];

    const newPermit = await sql`
      INSERT INTO permits (trader_id, permit_number, issue_date, expiry_date, status, qr_token)
      VALUES (${Number(trader_id)}, ${permitNum}, ${issueDate}, ${expiry_date}, ${"active"}, ${qrToken})
    `;

    await sql`
      INSERT INTO audit_logs (module, action, user_name, description)
      VALUES (${"SIPTU"}, ${"CREATE"}, ${"Admin"}, ${"SIPTU diterbitkan: " + permitNum})
    `;

    return Response.json(newPermit[0] || { id: Date.now(), trader_id, permit_number: permitNum, status: "active", expiry_date, issue_date: issueDate, qr_token: qrToken });
  } catch (error) {
    console.error("[POST /api/admin/permits]", error);
    return Response.json({ error: "Failed to create permit" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, expiry_date } = body;

    const updated = await sql`
      UPDATE permits SET status = ${status}, expiry_date = ${expiry_date} WHERE id = ${Number(id)}
    `;

    await sql`
      INSERT INTO audit_logs (module, action, user_name, description)
      VALUES (${"SIPTU"}, ${"UPDATE"}, ${"Admin"}, ${"SIPTU #" + id + " diperbarui: " + status})
    `;

    return Response.json(updated[0] || { id, status, expiry_date });
  } catch (error) {
    console.error("[PATCH /api/admin/permits]", error);
    return Response.json({ error: "Failed to update permit" }, { status: 500 });
  }
}
