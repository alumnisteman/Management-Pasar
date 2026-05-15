import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    let query = `
      SELECT t.*, s.stall_code, s.zone, s.category,
             p.permit_number, p.status as permit_status, p.expiry_date
      FROM traders t
      LEFT JOIN stalls s ON t.stall_id = s.id
      LEFT JOIN permits p ON p.trader_id = t.id
      WHERE 1=1
    `;
    const values = [];
    let idx = 1;

    if (search) {
      query += ` AND (LOWER(t.name) LIKE LOWER($${idx}) OR t.nik LIKE $${idx + 1} OR t.phone LIKE $${idx + 2})`;
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
      idx += 3;
    }
    if (status) {
      query += ` AND t.status = $${idx}`;
      values.push(status);
      idx++;
    }

    query += ` ORDER BY t.joined_at DESC`;
    const rows = await sql(query, values);
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch traders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, nik, phone, trader_type, stall_id } = body;

    const trader = await sql`
      INSERT INTO traders (name, nik, phone, trader_type, stall_id)
      VALUES (${name}, ${nik}, ${phone}, ${trader_type || "tetap"}, ${stall_id || null})
      RETURNING *
    `;

    // Assign stall if provided
    if (stall_id) {
      await sql`UPDATE stalls SET status = 'occupied', trader_id = ${trader[0].id} WHERE id = ${stall_id}`;
    }

    // Auto-generate SIPTU
    const permitNum = `SIPTU-${new Date().getFullYear()}-${String(trader[0].id).padStart(4, "0")}`;
    const issueDate = new Date().toISOString().split("T")[0];
    const expiryDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1),
    )
      .toISOString()
      .split("T")[0];

    await sql`
      INSERT INTO permits (trader_id, permit_number, issue_date, expiry_date, status, qr_token)
      VALUES (${trader[0].id}, ${permitNum}, ${issueDate}, ${expiryDate}, 'active', ${Math.random().toString(36).slice(2)})
      ON CONFLICT (permit_number) DO NOTHING
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pedagang', 'CREATE', ${`Pedagang baru terdaftar: ${name}`})
    `;

    return Response.json(trader[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create trader" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, name, phone, stall_id } = body;

    const updated = await sql`
      UPDATE traders SET
        status = COALESCE(${status}, status),
        name = COALESCE(${name}, name),
        phone = COALESCE(${phone}, phone),
        stall_id = COALESCE(${stall_id}, stall_id)
      WHERE id = ${id}
      RETURNING *
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pedagang', 'UPDATE', ${`Data pedagang #${id} diperbarui`})
    `;

    return Response.json(updated[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update trader" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const trader = await sql`SELECT name FROM traders WHERE id = ${id}`;
    await sql`UPDATE stalls SET status = 'vacant', trader_id = NULL WHERE trader_id = ${id}`;
    await sql`UPDATE traders SET status = 'inactive' WHERE id = ${id}`;
    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pedagang', 'DELETE', ${`Pedagang ${trader[0]?.name} dinonaktifkan`})
    `;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to delete trader" }, { status: 500 });
  }
}
