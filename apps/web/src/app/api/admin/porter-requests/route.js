import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const requests = await sql`SELECT * FROM porter_requests ORDER BY created_at DESC`;
    const porters = await sql`SELECT * FROM porters`;
    const rows = requests.map((r) => {
      const porter = porters.find((p) => p.id === r.porter_id) || {};
      return { ...r, porter_name: porter.name || null };
    });
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { trader_name, location_from, location_to, weight_category, notes } = await request.json();
    if (!trader_name || !location_from || !location_to) {
      return Response.json({ error: "Data tidak lengkap" }, { status: 400 });
    }
    const result = await sql`
      INSERT INTO porter_requests (trader_name, location_from, location_to, weight_category, notes)
      VALUES (${trader_name}, ${location_from}, ${location_to}, ${weight_category || "ringan"}, ${notes || ""})
    `;
    return Response.json({ success: true, request: result[0] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status, porter_id } = await request.json();
    if (!id) return Response.json({ error: "ID tidak valid" }, { status: 400 });
    const result = await sql`UPDATE porter_requests SET status = ${status}, porter_id = ${porter_id || null} WHERE id = ${id}`;
    return Response.json({ success: true, request: result[0] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
