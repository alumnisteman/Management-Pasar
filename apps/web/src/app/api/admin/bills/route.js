import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || "";
    const status = searchParams.get("status") || "";

    let query = `
      SELECT b.*, t.name as trader_name, t.phone, s.stall_code, s.zone
      FROM bills b
      JOIN traders t ON b.trader_id = t.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      WHERE 1=1
    `;
    const values = [];
    let idx = 1;

    if (month) {
      query += ` AND b.bill_month = $${idx}`;
      values.push(month);
      idx++;
    }
    if (status) {
      query += ` AND b.status = $${idx}`;
      values.push(status);
      idx++;
    }
    query += ` ORDER BY b.created_at DESC`;

    const rows = await sql(query, values);
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { bill_month } = body;

    // Generate bills for all active traders who don't have one yet this month
    const traders = await sql`
      SELECT t.id, t.stall_id, s.monthly_fee
      FROM traders t
      JOIN stalls s ON t.stall_id = s.id
      WHERE t.status = 'active'
        AND NOT EXISTS (
          SELECT 1 FROM bills b WHERE b.trader_id = t.id AND b.bill_month = ${bill_month}
        )
    `;

    let created = 0;
    for (const t of traders) {
      await sql`
        INSERT INTO bills (trader_id, stall_id, bill_month, amount, status)
        VALUES (${t.id}, ${t.stall_id}, ${bill_month}, ${t.monthly_fee}, 'unpaid')
      `;
      created++;
    }

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Billing', 'GENERATE', ${`Tagihan ${bill_month} dibuat untuk ${created} pedagang`})
    `;

    return Response.json({ created, month: bill_month });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate bills" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, trader_name } = body;

    const updated = await sql`
      UPDATE bills SET status = 'paid', paid_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Billing', 'PAYMENT', ${`Tagihan lunas - ${trader_name || "Pedagang"}`})
    `;

    return Response.json(updated[0]);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to mark bill as paid" },
      { status: 500 },
    );
  }
}
