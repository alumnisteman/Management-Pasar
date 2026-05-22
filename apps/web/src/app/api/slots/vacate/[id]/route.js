import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const result = await sql`UPDATE stalls SET status = 'vacant', trader_id = NULL WHERE id = ${Number(id)}`;
    
    if (result.length === 0) {
       return Response.json({ error: "Stall not found" }, { status: 404 });
    }

    return Response.json({ success: true, stall: result[0] });
  } catch (error) {
    console.error(`[POST /api/slots/vacate/${params?.id}]`, error);
    return Response.json({ error: "Failed to vacate slot" }, { status: 500 });
  }
}
