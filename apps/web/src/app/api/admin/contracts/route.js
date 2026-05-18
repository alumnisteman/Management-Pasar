import sql from "@/app/api/utils/sql";

// ── GET: list all contracts ────────────────────────────────────────────────────
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const trader_id = url.searchParams.get("trader_id");

    const db_contracts = await sql`SELECT * FROM contracts ORDER BY created_at DESC`;

    // Join trader + stall data manually
    const traders = await sql`SELECT t.*, s.stall_code, s.zone FROM traders t LEFT JOIN stalls s ON t.stall_id = s.id`;
    
    let contracts = db_contracts.map((c) => {
      const trader = traders.find((t) => t.id === c.trader_id) || {};
      return {
        ...c,
        trader_name: trader.name || null,
        stall_code: trader.stall_code || null,
        zone: trader.zone || null,
        trader_phone: trader.phone || null,
      };
    });

    if (trader_id) {
      contracts = contracts.filter((c) => c.trader_id === Number(trader_id));
    }

    return Response.json(contracts);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch contracts" }, { status: 500 });
  }
}

// ── POST: create contract ──────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { trader_id, start_date, end_date, rent_amount, terms, status } = body;

    if (!trader_id || !start_date || !end_date || !rent_amount) {
      return Response.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO contracts (trader_id, start_date, end_date, rent_amount, terms, status, created_at)
      VALUES (${trader_id}, ${start_date}, ${end_date}, ${rent_amount}, ${terms || ""}, ${status || "active"}, ${new Date().toISOString()})
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Kontrak', 'CREATE', ${`Kontrak baru dibuat untuk pedagang ID ${trader_id}`})
    `;

    return Response.json({ success: true, contract: result[0] });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal membuat kontrak: " + error.message }, { status: 500 });
  }
}

// ── PATCH: update contract status ─────────────────────────────────────────────
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, end_date } = body;

    if (!id) {
      return Response.json({ error: "ID kontrak tidak valid" }, { status: 400 });
    }

    const result = await sql`UPDATE contracts SET status = ${status}, end_date = ${end_date} WHERE id = ${id}`;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Kontrak', 'UPDATE', ${`Kontrak ID ${id} diupdate: status=${status}`})
    `;

    return Response.json({ success: true, contract: result[0] });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal memperbarui kontrak" }, { status: 500 });
  }
}

// ── DELETE: terminate contract ────────────────────────────────────────────────
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID kontrak tidak valid" }, { status: 400 });
    }

    await sql`DELETE FROM contracts WHERE id = ${Number(id)}`;
    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Kontrak', 'DELETE', ${`Kontrak ID ${id} dihapus`})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal menghapus kontrak" }, { status: 500 });
  }
}
