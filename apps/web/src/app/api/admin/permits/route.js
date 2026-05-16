const BACKEND = process.env.BACKEND_URL || "http://103.175.219.57:8001";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const token = searchParams.get("token") || "";

    // QR verification mode - call Laravel verify endpoint
    if (token) {
      const res = await fetch(`${BACKEND}/api/permits/verify/${encodeURIComponent(token)}`);
      if (!res.ok) return Response.json({ valid: false });
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

    // List permits - call Laravel API
    const params = new URLSearchParams();
    if (status) params.set("filter[status]", status);
    const res = await fetch(`${BACKEND}/api/permits?${params}`);
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const json = await res.json();

    // Normalize paginated or plain array response
    const rawData = Array.isArray(json) ? json : (json.data ?? []);

    // Map Laravel fields to frontend fields
    const rows = rawData.map((p) => ({
      ...p,
      trader_name: p.trader?.name ?? p.trader_name ?? "",
      stall_code: p.slot?.code ?? p.stall_code ?? "",
      zone: p.slot?.type ?? p.zone ?? "",
      expiry_date: p.expires_at ? p.expires_at.split("T")[0] : p.expiry_date,
    }));

    return Response.json(rows);
  } catch (error) {
    console.error("[GET /api/admin/permits]", error);
    return Response.json({ error: "Failed to fetch permits" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { trader_id, expiry_date } = body;

    // Find first active slot for this trader to satisfy the slot_id requirement
    const slotRes = await fetch(`${BACKEND}/api/stalls?filter[status]=active`);
    const slotJson = await slotRes.json();
    const slots = Array.isArray(slotJson) ? slotJson : (slotJson.data ?? []);
    const slot = slots[0];

    if (!slot) {
      return Response.json({ error: "No available stall found" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND}/api/permits/issue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trader_id,
        slot_id: slot.id,
        expires_at: expiry_date,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json({ error: err.message || "Failed to create permit" }, { status: res.status });
    }

    return Response.json(await res.json());
  } catch (error) {
    console.error("[POST /api/admin/permits]", error);
    return Response.json({ error: "Failed to create permit" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, expiry_date } = body;

    // Laravel doesn't have a generic PATCH on /permits yet — call with JSON body
    const res = await fetch(`${BACKEND}/api/permits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, expires_at: expiry_date }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json({ error: err.message || "Failed to update permit" }, { status: res.status });
    }

    return Response.json(await res.json());
  } catch (error) {
    console.error("[PATCH /api/admin/permits]", error);
    return Response.json({ error: "Failed to update permit" }, { status: 500 });
  }
}
