const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8002";

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/api/tenant/pay-bill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    // Pass backend's status code and error body through to the client
    return Response.json(data, { status: res.status });
  } catch (error) {
    console.error("[POST /api/tenant/pay-bill]", error);
    return Response.json({ error: "Failed to process bill payment" }, { status: 500 });
  }
}
