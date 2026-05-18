import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.resolve(process.cwd(), 'svms_db.json');

function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request) {
  try {
    const { slot_id, type, reading, cost } = await request.json();

    if (!slot_id || !type || reading === undefined) {
      return Response.json({ error: 'slot_id, type, and reading are required' }, { status: 400 });
    }

    const db = loadDB();
    if (!db.iot_readings) db.iot_readings = [];

    const isAlert =
      (type === 'electricity' && Number(reading) > 500) ||
      (type === 'water' && Number(reading) > 50);

    const newId = db.iot_readings.reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
    const newReading = {
      id: newId,
      slot_id,
      type,
      reading: Number(reading),
      cost: Number(cost) || 0,
      recorded_at: new Date().toISOString(),
    };

    db.iot_readings.push(newReading);

    if (!db.audit_logs) db.audit_logs = [];
    db.audit_logs.push({
      id: (db.audit_logs.reduce((max, l) => Math.max(max, l.id || 0), 0) + 1),
      module: 'IoT',
      action: isAlert ? 'IOT_ALERT' : 'IOT_READING',
      user_name: 'Sistem',
      description: `Bacaan ${type === 'electricity' ? 'listrik' : 'air'}: ${reading} ${type === 'electricity' ? 'KWh' : 'm³'} di slot ${slot_id}${isAlert ? ' — LONJAKAN TERDETEKSI' : ''}`,
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString(),
    });

    saveDB(db);

    return Response.json({
      message: isAlert
        ? `⚠️ LONJAKAN TERDETEKSI! ${type === 'electricity' ? 'Listrik' : 'Air'} ${reading} ${type === 'electricity' ? 'KWh' : 'm³'} melebihi batas normal.`
        : `Bacaan sensor ${type === 'electricity' ? 'listrik' : 'air'} ${reading} ${type === 'electricity' ? 'KWh' : 'm³'} berhasil dicatat.`,
      alert: isAlert,
      reading: newReading,
    });
  } catch (error) {
    console.error('[POST /api/iot/sim-reading]', error);
    return Response.json({ error: 'Failed to record IoT reading' }, { status: 500 });
  }
}
