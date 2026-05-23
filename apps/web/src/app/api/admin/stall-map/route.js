import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const stalls = await sql`SELECT * FROM stalls`;
    const traders = await sql`SELECT * FROM traders`;
    const bills = await sql`SELECT * FROM bills WHERE status = 'unpaid'`;

    const formattedData = stalls.map(s => {
      const trader = traders.find(t => t.id === s.trader_id) || null;
      const hasUnpaidBill = trader
        ? bills.some(b => b.trader_id === trader.id)
        : false;

      return {
        id: s.id,
        code: s.stall_code,
        zone: s.zone,
        category: s.category || null,
        type: s.category || s.zone || null,
        status: s.status,
        x_position: s.row_x || 0,
        y_position: s.col_y || 0,
        has_unpaid_bill: hasUnpaidBill,
        trader: trader
          ? {
              name: trader.name,
              phone: trader.phone,
              reputation: trader.reputation || 85,
            }
          : null,
      };
    });

    return Response.json(formattedData);
  } catch (error) {
    console.error("[GET /api/admin/stall-map]", error);
    return Response.json({ error: "Failed to load stall map" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { slots } = body;

    if (!slots || !Array.isArray(slots)) {
      return Response.json({ error: "Invalid payload: slots array required" }, { status: 400 });
    }

    const db = await sql`SELECT * FROM stalls`;

    for (const slot of slots) {
      if (slot.id == null) continue;
      const existing = db.find(s => s.id === slot.id);
      if (existing) {
        existing.row_x = slot.x_position ?? existing.row_x;
        existing.col_y = slot.y_position ?? existing.col_y;
        await sql`UPDATE stalls SET row_x = ${slot.x_position}, col_y = ${slot.y_position} WHERE id = ${slot.id}`;
      }
    }

    return Response.json({ success: true, message: "Tata letak berhasil disimpan!" });
  } catch (error) {
    console.error("[POST /api/admin/stall-map]", error);
    return Response.json({ error: "Failed to update stall coordinates" }, { status: 500 });
  }
}
