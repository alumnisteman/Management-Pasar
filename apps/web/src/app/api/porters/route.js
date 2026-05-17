import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const porter = await sql`
        SELECT p.*, 
        (SELECT COALESCE(SUM(fee), 0) FROM porter_jobs WHERE porter_id = p.id AND status = 'completed' AND created_at >= CURRENT_DATE) as daily_earnings
        FROM porters p 
        WHERE p.id = ${id}
      `;
      return Response.json(porter[0] || null);
    }

    const porters = await sql`SELECT * FROM porters ORDER BY name ASC`;
    return Response.json(porters);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch porters" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json(
        { error: "ID and status are required" },
        { status: 400 },
      );
    }

    const updated = await sql`
      UPDATE porters 
      SET status = ${status} 
      WHERE id = ${id} 
      RETURNING *
    `;

    return Response.json(updated[0]);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to update porter status" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, id_number, daily_target } = body;

    if (!name || !phone || !id_number) {
      return Response.json(
        { error: "name, phone, dan id_number wajib diisi" },
        { status: 400 },
      );
    }

    const newPorter = await sql`
      INSERT INTO porters (name, phone, id_number, daily_target, status, rating)
      VALUES (${name}, ${phone}, ${id_number}, ${daily_target || 100000}, 'available', 5.00)
      RETURNING *
    `;

    return Response.json(newPorter[0]);
  } catch (error) {
    console.error(error);
    if (error.message?.includes("unique")) {
      return Response.json(
        { error: "Nomor HP atau ID sudah terdaftar" },
        { status: 409 },
      );
    }
    return Response.json({ error: "Failed to create porter" }, { status: 500 });
  }
}
