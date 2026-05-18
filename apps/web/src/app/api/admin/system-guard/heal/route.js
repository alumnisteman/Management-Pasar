const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8002";

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization') || '';
    const cookieHeader = request.headers.get('Cookie') || '';
    
    // Proxy the self-healing request to Laravel backend
    const res = await fetch(`${BACKEND}/api/system/auto-heal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'Cookie': cookieHeader
      },
      signal: AbortSignal.timeout(10000) // Self-healing can take a moment to clear all cache
    });

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        return Response.json({ error: errorJson.message || "Failed to trigger auto-heal" }, { status: res.status });
      } catch {
        return Response.json({ error: `Backend returned status ${res.status}: ${errorText}` }, { status: res.status });
      }
    }

    const data = await res.json();
    return Response.json(data);

  } catch (error) {
    console.error('[POST /api/admin/system-guard/heal] error:', error);
    return Response.json({ error: "System Guard healing failed to initiate" }, { status: 500 });
  }
}
