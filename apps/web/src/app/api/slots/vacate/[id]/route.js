const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8002";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const res = await fetch(`${BACKEND}/api/grid-slots/${id}/vacate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error(`[POST /api/slots/vacate/${params?.id}]`, error);
    return Response.json({ error: "Failed to vacate slot" }, { status: 500 });
  }
}
