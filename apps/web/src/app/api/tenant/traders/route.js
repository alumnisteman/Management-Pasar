const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8002";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/vendors`);
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("[GET /api/tenant/traders]", error);
    return Response.json({ error: "Failed to fetch traders list" }, { status: 500 });
  }
}
