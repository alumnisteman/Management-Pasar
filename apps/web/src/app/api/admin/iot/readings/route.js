import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.resolve(process.cwd(), 'svms_db.json');

function loadDB() {
  try {
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { iot_readings: [], stalls: [], traders: [] };
  }
}

export async function GET() {
  try {
    const db = loadDB();
    const rawReadings = (db.iot_readings || []).slice(-50).reverse();

    const enriched = rawReadings.map(r => {
      const slot = (db.stalls || []).find(s => s.id === r.slot_id);
      const trader = slot ? (db.traders || []).find(t => t.id === slot.trader_id) : null;
      return {
        ...r,
        slot: slot
          ? { code: slot.stall_code, trader: trader ? { name: trader.name, phone: trader.phone } : null }
          : null,
      };
    });

    return Response.json({ readings: enriched });
  } catch (error) {
    console.error('[GET /api/admin/iot/readings]', error);
    return Response.json({ error: 'Failed to fetch IoT readings' }, { status: 500 });
  }
}
