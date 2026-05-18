import fs from "node:fs";
import path from "node:path";

const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8001";
const DB_PATH = path.resolve(process.cwd(), "svms_db.json");

function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    return { permits: [], traders: [], stalls: [] };
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("saveDB error:", err);
  }
}

// Build enriched permit list from local DB
function getLocalPermits(statusFilter) {
  const db = loadDB();
  let rows = db.permits.map((p) => {
    const trader = db.traders.find((t) => t.id === p.trader_id) || {};
    const stall = db.stalls.find((s) => s.id === trader.stall_id) || {};
    return {
      ...p,
      trader_name: trader.name || null,
      stall_code: stall.stall_code || null,
      zone: stall.zone || null,
      trader_phone: trader.phone || null,
    };
  });
  if (statusFilter) rows = rows.filter((p) => p.status === statusFilter);
  return rows;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const token = searchParams.get("token") || "";

    // QR verification mode — try Laravel, fall back to local DB
    if (token) {
      try {
        const res = await fetch(
          `${BACKEND}/api/permits/verify/${encodeURIComponent(token)}`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (res.ok) {
          const data = await res.json();
          return Response.json({
            valid: data.is_valid ?? false,
            permit: {
              trader_name: data.trader,
              permit_number: data.permit_number,
              stall_code: data.slot,
              expiry_date: data.expires,
            },
          });
        }
      } catch {
        // Backend unreachable — use local DB
      }
      const db = loadDB();
      const permit = db.permits.find((p) => p.qr_token === token);
      if (!permit) return Response.json({ valid: false });
      const trader = db.traders.find((t) => t.id === permit.trader_id) || {};
      const stall = db.stalls.find((s) => s.id === trader.stall_id) || {};
      const isExpired = permit.status === "expired" ||
        (permit.expiry_date && new Date(permit.expiry_date) < new Date());
      return Response.json({
        valid: !isExpired,
        permit: {
          trader_name: trader.name || null,
          permit_number: permit.permit_number,
          stall_code: stall.stall_code || null,
          expiry_date: permit.expiry_date,
        },
      });
    }

    // List permits — try Laravel, fall back to local DB
    try {
      const params = new URLSearchParams();
      if (status) params.set("filter[status]", status);
      const res = await fetch(`${BACKEND}/api/permits?${params}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const json = await res.json();
        const rawData = Array.isArray(json) ? json : (json.data ?? []);
        const rows = rawData.map((p) => ({
          ...p,
          trader_name: p.trader?.name ?? p.trader_name ?? "",
          stall_code: p.slot?.code ?? p.stall_code ?? "",
          zone: p.slot?.type ?? p.zone ?? "",
          expiry_date: p.expires_at ? p.expires_at.split("T")[0] : p.expiry_date,
        }));
        return Response.json(rows);
      }
    } catch {
      // Backend unreachable — use local DB
    }

    return Response.json(getLocalPermits(status));
  } catch (error) {
    console.error("[GET /api/admin/permits]", error);
    return Response.json(getLocalPermits(""));
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { trader_id, expiry_date } = body;

    // Try Laravel backend first
    try {
      const slotRes = await fetch(`${BACKEND}/api/stalls?filter[status]=active`, {
        signal: AbortSignal.timeout(5000),
      });
      if (slotRes.ok) {
        const slotJson = await slotRes.json();
        const slots = Array.isArray(slotJson) ? slotJson : (slotJson.data ?? []);
        const slot = slots[0];
        if (slot) {
          const res = await fetch(`${BACKEND}/api/permits/issue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trader_id, slot_id: slot.id, expires_at: expiry_date }),
          });
          if (res.ok) return Response.json(await res.json());
        }
      }
    } catch {
      // Backend unreachable — use local DB
    }

    // Local DB fallback
    const db = loadDB();
    const trader = db.traders.find((t) => t.id === Number(trader_id));
    if (!trader) return Response.json({ error: "Pedagang tidak ditemukan" }, { status: 404 });

    const year = new Date().getFullYear();
    const newId = db.permits.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const permitNum = `SIPTU-${year}-${String(newId).padStart(4, "0")}`;
    const issueDate = new Date().toISOString().split("T")[0];
    const newPermit = {
      id: newId,
      trader_id: Number(trader_id),
      permit_number: permitNum,
      issue_date: issueDate,
      expiry_date: expiry_date || new Date(new Date().setFullYear(year + 1)).toISOString().split("T")[0],
      status: "active",
      qr_token: Math.random().toString(36).slice(2),
    };
    db.permits.push(newPermit);
    saveDB(db);

    const stall = db.stalls.find((s) => s.id === trader.stall_id) || {};
    return Response.json({ ...newPermit, trader_name: trader.name, stall_code: stall.stall_code });
  } catch (error) {
    console.error("[POST /api/admin/permits]", error);
    return Response.json({ error: "Failed to create permit" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, expiry_date } = body;

    // Try Laravel backend first
    try {
      const res = await fetch(`${BACKEND}/api/permits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, expires_at: expiry_date }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) return Response.json(await res.json());
    } catch {
      // Backend unreachable — use local DB
    }

    // Local DB fallback
    const db = loadDB();
    const permit = db.permits.find((p) => p.id === Number(id));
    if (!permit) return Response.json({ error: "Izin tidak ditemukan" }, { status: 404 });

    if (status !== undefined) permit.status = status;
    if (expiry_date !== undefined) permit.expiry_date = expiry_date;
    saveDB(db);
    return Response.json(permit);
  } catch (error) {
    console.error("[PATCH /api/admin/permits]", error);
    return Response.json({ error: "Failed to update permit" }, { status: 500 });
  }
}
