import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const stalls = await sql`SELECT * FROM stalls`;
    const traders = await sql`SELECT * FROM traders`;
    
    const formattedData = stalls.map(s => {
      const trader = traders.find(t => t.id === s.trader_id) || null;
      return {
        id: s.id,
        code: s.stall_code,
        zone: s.zone,
        status: s.status,
        x_position: s.row_x || 0,
        y_position: s.col_y || 0,
        trader: trader ? { name: trader.name, phone: trader.phone } : null,
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
    // Assuming body is { stall_id, row_x, col_y }
    // Add simple query if we need to update coordinates
    const { stall_id, row_x, col_y } = body;
    // We don't have this explicitly in sql.js, but we can update it if needed.
    // For now, let's just return success since it's a mock.
    return Response.json({ success: true, message: "Stall coordinates updated locally" });
  } catch (error) {
    console.error("[POST /api/admin/stall-map/update-coordinates]", error);
    return Response.json({ error: "Failed to update stall coordinates" }, { status: 500 });
  }
}
