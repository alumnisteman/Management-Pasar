import fs from 'node:fs';
import path from 'node:path';

const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8002";
const DB_PATH = path.resolve(process.cwd(), 'svms_db.json');

function loadLocalStalls() {
  try {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const stalls = db.stalls || [];
    const traders = db.traders || [];
    return stalls.map(s => {
      const trader = traders.find(t => t.id === s.trader_id) || null;
      return {
        id: s.id,
        code: s.stall_code,
        zone: s.zone,
        status: s.status,
        x: s.x || 0,
        y: s.y || 0,
        trader: trader ? { name: trader.name, phone: trader.phone } : null,
      };
    });
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/admin/stall-map/data`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.warn("[GET /api/admin/stall-map] Backend unreachable, using local fallback:", error.message);
    const localData = loadLocalStalls();
    return Response.json(localData);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/api/admin/stall-map/update-coordinates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("[POST /api/admin/stall-map/update-coordinates]", error);
    return Response.json({ error: "Failed to update stall coordinates" }, { status: 500 });
  }
}
