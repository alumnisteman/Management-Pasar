import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { trader_id, stall_id, category, title, description, priority } = body;

    const result = await sql`
      INSERT INTO complaints (trader_id, stall_id, category, title, description, priority)
      VALUES (${trader_id}, ${stall_id}, ${category}, ${title}, ${description}, ${priority})
    `;

    return Response.json({ success: true, complaint: result[0] });
  } catch (error) {
    console.error("[POST /api/tenant/complaint]", error);
    return Response.json({ error: "Failed to submit complaint" }, { status: 500 });
  }
}
