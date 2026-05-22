import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM traders`;
    return Response.json(rows);
  } catch (error) {
    console.error("[GET /api/tenant/traders]", error);
    return Response.json({ error: "Failed to fetch traders list" }, { status: 500 });
  }
}
