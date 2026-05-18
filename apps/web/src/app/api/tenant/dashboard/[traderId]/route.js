const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8001";

export async function GET(request, { params }) {
  try {
    const { traderId } = params;
    const res = await fetch(`${BACKEND}/api/tenant/dashboard/${traderId}`);
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error(`[GET /api/tenant/dashboard/${params?.traderId}]`, error);
    return Response.json({ error: "Failed to fetch tenant dashboard" }, { status: 500 });
  }
}
