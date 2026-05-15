import sql from "@/app/api/utils/sql";

function fmtRp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Build billing report HTML
async function buildBillingHTML(month) {
  const bills = await sql`
    SELECT b.*, t.name as trader_name, t.phone, s.stall_code, s.zone
    FROM bills b
    JOIN traders t ON b.trader_id = t.id
    LEFT JOIN stalls s ON b.stall_id = s.id
    WHERE b.bill_month = ${month}
    ORDER BY t.name ASC
  `;
  const totalBilled = bills.reduce((s, b) => s + Number(b.amount), 0);
  const totalPaid = bills
    .filter((b) => b.status === "paid")
    .reduce((s, b) => s + Number(b.amount), 0);
  const paidCount = bills.filter((b) => b.status === "paid").length;
  const compRate =
    bills.length > 0 ? Math.round((paidCount / bills.length) * 100) : 0;

  const rows = bills
    .map(
      (b) => `
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 12px;">${b.trader_name}</td>
      <td style="padding:10px 12px; font-family:monospace; font-size:12px;">${b.stall_code || "—"}</td>
      <td style="padding:10px 12px; text-transform:capitalize;">${b.zone || "—"}</td>
      <td style="padding:10px 12px;">${fmtRp(b.amount)}</td>
      <td style="padding:10px 12px;">
        <span style="background:${b.status === "paid" ? "#dcfce7" : "#fee2e2"};color:${b.status === "paid" ? "#166534" : "#991b1b"};padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;">
          ${b.status === "paid" ? "Lunas" : "Belum Bayar"}
        </span>
      </td>
      <td style="padding:10px 12px; font-size:12px; color:#6b7280;">${b.paid_at ? fmtDate(b.paid_at) : "—"}</td>
    </tr>
  `,
    )
    .join("");

  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', sans-serif; color: #111827; background: white; padding: 40px; }
    .header { border-bottom: 3px solid #1d4ed8; padding-bottom: 20px; margin-bottom: 28px; }
    .title { font-size: 22px; font-weight: 700; color: #1d4ed8; }
    .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .kpi { display: flex; gap: 16px; margin-bottom: 28px; }
    .kpi-box { flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; font-weight: 600; }
    .kpi-val { font-size: 20px; font-weight: 700; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #1d4ed8; color: white; }
    th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #9ca3af; }
    .compliance { color: ${compRate >= 80 ? "#166534" : compRate >= 50 ? "#92400e" : "#991b1b"}; }
  </style></head><body>
  <div class="header">
    <div class="title">📊 Laporan Tagihan Bulanan — ${month}</div>
    <div class="subtitle">SVMS v6.0 Enterprise · Dicetak: ${fmtDate(new Date())}</div>
  </div>
  <div class="kpi">
    <div class="kpi-box"><div class="kpi-label">Total Ditagihkan</div><div class="kpi-val">${fmtRp(totalBilled)}</div></div>
    <div class="kpi-box"><div class="kpi-label">Terkumpul</div><div class="kpi-val" style="color:#166534;">${fmtRp(totalPaid)}</div></div>
    <div class="kpi-box"><div class="kpi-label">Compliance Rate</div><div class="kpi-val compliance">${compRate}%</div></div>
    <div class="kpi-box"><div class="kpi-label">Total Tagihan</div><div class="kpi-val">${bills.length} tagihan</div></div>
  </div>
  <table>
    <thead><tr>
      <th>Pedagang</th><th>Kode Lapak</th><th>Zona</th><th>Nominal</th><th>Status</th><th>Tgl Bayar</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Dokumen ini digenerate otomatis oleh SVMS v6.0 Enterprise · ${fmtDate(new Date())}</div>
  </body></html>`;
}

// Build traders report HTML
async function buildTradersHTML() {
  const traders = await sql`
    SELECT t.*, s.stall_code, s.zone, s.category, s.monthly_fee,
           p.permit_number, p.status as permit_status, p.expiry_date
    FROM traders t
    LEFT JOIN stalls s ON t.stall_id = s.id
    LEFT JOIN permits p ON p.trader_id = t.id
    ORDER BY t.name ASC
  `;

  const total = traders.length;
  const active = traders.filter((t) => t.status === "active").length;
  const withPermit = traders.filter((t) => t.permit_number).length;

  const rows = traders
    .map(
      (t) => `
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 12px; font-weight:500;">${t.name}</td>
      <td style="padding:10px 12px; font-size:12px;">${t.nik || "—"}</td>
      <td style="padding:10px 12px; font-size:12px;">${t.phone || "—"}</td>
      <td style="padding:10px 12px; text-transform:capitalize;">${t.trader_type}</td>
      <td style="padding:10px 12px; font-family:monospace; font-size:12px;">${t.stall_code || "—"}</td>
      <td style="padding:10px 12px;">
        <span style="background:${t.status === "active" ? "#dcfce7" : t.status === "warning" ? "#fef3c7" : "#f3f4f6"};
          color:${t.status === "active" ? "#166534" : t.status === "warning" ? "#92400e" : "#374151"};
          padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;">
          ${t.status === "active" ? "Aktif" : t.status === "warning" ? "Peringatan" : "Nonaktif"}
        </span>
      </td>
      <td style="padding:10px 12px; font-size:12px;">${t.permit_number || "Belum ada"}</td>
    </tr>
  `,
    )
    .join("");

  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', sans-serif; color: #111827; background: white; padding: 40px; }
    .header { border-bottom: 3px solid #7c3aed; padding-bottom: 20px; margin-bottom: 28px; }
    .title { font-size: 22px; font-weight: 700; color: #7c3aed; }
    .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .kpi { display: flex; gap: 16px; margin-bottom: 28px; }
    .kpi-box { flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; font-weight: 600; }
    .kpi-val { font-size: 20px; font-weight: 700; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #7c3aed; color: white; }
    th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #9ca3af; }
  </style></head><body>
  <div class="header">
    <div class="title">👥 Laporan Data Pedagang</div>
    <div class="subtitle">SVMS v6.0 Enterprise · Dicetak: ${fmtDate(new Date())}</div>
  </div>
  <div class="kpi">
    <div class="kpi-box"><div class="kpi-label">Total Pedagang</div><div class="kpi-val">${total}</div></div>
    <div class="kpi-box"><div class="kpi-label">Aktif</div><div class="kpi-val" style="color:#166534;">${active}</div></div>
    <div class="kpi-box"><div class="kpi-label">Memiliki SIPTU</div><div class="kpi-val">${withPermit}</div></div>
    <div class="kpi-box"><div class="kpi-label">Tanpa SIPTU</div><div class="kpi-val" style="color:#991b1b;">${total - withPermit}</div></div>
  </div>
  <table>
    <thead><tr><th>Nama</th><th>NIK</th><th>Telepon</th><th>Tipe</th><th>Lapak</th><th>Status</th><th>No. SIPTU</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Dokumen ini digenerate otomatis oleh SVMS v6.0 Enterprise · ${fmtDate(new Date())}</div>
  </body></html>`;
}

// Build porter incentives report HTML
async function buildPorterHTML() {
  const porters = await sql`SELECT * FROM porters ORDER BY rating DESC`;
  const incentives = await sql`
    SELECT pi.*, p.name as porter_name
    FROM porter_incentives pi
    JOIN porters p ON pi.porter_id = p.id
    ORDER BY pi.week_start DESC
    LIMIT 50
  `;

  const rows = porters
    .map((p) => {
      const inc = incentives.find((i) => i.porter_id === p.id);
      const tierEmoji = {
        platinum: "💎",
        gold: "🥇",
        silver: "🥈",
        bronze: "🥉",
      };
      return `
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 12px; font-weight:500;">${p.name}</td>
      <td style="padding:10px 12px; font-size:12px;">${p.phone}</td>
      <td style="padding:10px 12px;">
        <span style="background:${p.status === "available" ? "#dcfce7" : p.status === "active" ? "#dbeafe" : "#f3f4f6"};
          color:${p.status === "available" ? "#166534" : p.status === "active" ? "#1e40af" : "#374151"};
          padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;">
          ${p.status === "available" ? "Tersedia" : p.status === "active" ? "Bertugas" : "Off"}
        </span>
      </td>
      <td style="padding:10px 12px; text-align:center;">⭐ ${Number(p.rating).toFixed(1)}</td>
      <td style="padding:10px 12px;">${inc ? `${tierEmoji[inc.tier] || "—"} ${inc.tier}` : "—"}</td>
      <td style="padding:10px 12px;">${inc ? `Rp ${Number(inc.bonus_amount).toLocaleString("id-ID")}` : "—"}</td>
      <td style="padding:10px 12px; font-size:12px;">${inc?.week_start || "—"} s/d ${inc?.week_end || "—"}</td>
    </tr>`;
    })
    .join("");

  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', sans-serif; color: #111827; background: white; padding: 40px; }
    .header { border-bottom: 3px solid #0891b2; padding-bottom: 20px; margin-bottom: 28px; }
    .title { font-size: 22px; font-weight: 700; color: #0891b2; }
    .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .kpi { display: flex; gap: 16px; margin-bottom: 28px; }
    .kpi-box { flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; font-weight: 600; }
    .kpi-val { font-size: 20px; font-weight: 700; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #0891b2; color: white; }
    th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #9ca3af; }
  </style></head><body>
  <div class="header">
    <div class="title">📦 Laporan Kuli Panggul & Insentif</div>
    <div class="subtitle">SVMS v6.0 Enterprise · Dicetak: ${fmtDate(new Date())}</div>
  </div>
  <div class="kpi">
    <div class="kpi-box"><div class="kpi-label">Total Porter</div><div class="kpi-val">${porters.length}</div></div>
    <div class="kpi-box"><div class="kpi-label">Tersedia</div><div class="kpi-val" style="color:#166534;">${porters.filter((p) => p.status === "available").length}</div></div>
    <div class="kpi-box"><div class="kpi-label">Rating Avg</div><div class="kpi-val" style="color:#d97706;">⭐ ${porters.length > 0 ? (porters.reduce((s, p) => s + Number(p.rating), 0) / porters.length).toFixed(2) : "5.00"}</div></div>
    <div class="kpi-box"><div class="kpi-label">Punya Insentif</div><div class="kpi-val">${new Set(incentives.map((i) => i.porter_id)).size}</div></div>
  </div>
  <table>
    <thead><tr><th>Nama</th><th>Telepon</th><th>Status</th><th>Rating</th><th>Tier Insentif</th><th>Bonus</th><th>Periode</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Dokumen ini digenerate otomatis oleh SVMS v6.0 Enterprise · ${fmtDate(new Date())}</div>
  </body></html>`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, month } = body;

    let html = "";
    let filename = "laporan.pdf";

    if (type === "billing") {
      const m = month || new Date().toISOString().slice(0, 7);
      html = await buildBillingHTML(m);
      filename = `tagihan-${m}.pdf`;
    } else if (type === "traders") {
      html = await buildTradersHTML();
      filename = `pedagang-${new Date().toISOString().slice(0, 10)}.pdf`;
    } else if (type === "porter") {
      html = await buildPorterHTML();
      filename = `porter-insentif-${new Date().toISOString().slice(0, 10)}.pdf`;
    } else {
      return Response.json(
        { error: "type must be billing | traders | porter" },
        { status: 400 },
      );
    }

    // Call PDF generation integration
    const pdfRes = await fetch(
      `${process.env.NEXT_PUBLIC_CREATE_APP_URL || ""}/integrations/pdf-generation/pdf`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: { html } }),
      },
    );

    if (!pdfRes.ok) {
      throw new Error(`PDF generation failed: ${pdfRes.status}`);
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

    // Log the action
    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Laporan', 'EXPORT', ${`Laporan PDF ${type} digenerate: ${filename}`})
    `;

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate PDF: " + error.message },
      { status: 500 },
    );
  }
}
