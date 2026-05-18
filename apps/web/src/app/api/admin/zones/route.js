import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM zone_pricing ORDER BY zone ASC`;
    return Response.json(rows);
  } catch (error) {
    console.error("[GET /api/admin/zones]", error);
    return Response.json({ error: "Failed to fetch zone pricing" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { zone, suggested_price } = await request.json();
    if (!zone || suggested_price == null) {
      return Response.json({ error: "zone and suggested_price required" }, { status: 400 });
    }

    const updated = await sql`
      UPDATE zone_pricing SET suggested_price = ${Number(suggested_price)} WHERE zone = ${zone}
    `;

    await sql`
      INSERT INTO audit_logs (module, action, user_name, description)
      VALUES (${"Grid"}, ${"UPDATE"}, ${"Admin"}, ${"Harga disarankan " + zone + " diubah ke Rp " + Number(suggested_price).toLocaleString("id-ID")})
    `;

    return Response.json(updated[0] || { zone, suggested_price });
  } catch (error) {
    console.error("[PATCH /api/admin/zones]", error);
    return Response.json({ error: "Failed to update zone pricing" }, { status: 500 });
  }
}
