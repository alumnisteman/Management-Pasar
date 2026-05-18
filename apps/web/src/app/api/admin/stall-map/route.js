const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8002";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/admin/stall-map/data`);
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("[GET /api/admin/stall-map/data]", error);
    return Response.json({ error: "Failed to fetch stall map data" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/api/admin/stall-map/update-coordinates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("[POST /api/admin/stall-map/update-coordinates]", error);
    return Response.json({ error: "Failed to update stall coordinates" }, { status: 500 });
  }
}
