const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8001";

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/api/tenant/pay-bill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("[POST /api/tenant/pay-bill]", error);
    return Response.json({ error: "Failed to process bill payment" }, { status: 500 });
  }
}
