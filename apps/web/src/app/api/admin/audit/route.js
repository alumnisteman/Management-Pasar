import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get("module") || "";
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = `SELECT * FROM audit_logs WHERE 1=1`;
    const values = [];
    let idx = 1;

    if (module) {
      query += ` AND module = $${idx}`;
      values.push(module);
      idx++;
    }
    query += ` ORDER BY created_at DESC LIMIT $${idx}`;
    values.push(limit);

    const rows = await sql(query, values);
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { module, action, user_name, description, ip_address } = body;
    const row = await sql`
      INSERT INTO audit_logs (module, action, user_name, description, ip_address)
      VALUES (${module}, ${action}, ${user_name || "Admin"}, ${description}, ${ip_address || "127.0.0.1"})
      RETURNING *
    `;
    return Response.json(row[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create log" }, { status: 500 });
  }
}
