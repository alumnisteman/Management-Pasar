import sql from "@/app/api/utils/sql";

// ── Excel/CSV Export ──────────────────────────────────────────────────────────
function toCSV(headers, rows) {
  const escape = (v) => {
    if (v == null) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [
    headers.join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ];
  return lines.join("\r\n");
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const month = url.searchParams.get("month") || new Date().toISOString().slice(0, 7);

    let csv = "";
    let filename = "laporan.csv";

    if (type === "billing") {
      const bills = await sql`SELECT b.*, t.name as trader_name, t.phone, s.stall_code, s.zone FROM bills b JOIN traders t ON b.trader_id = t.id LEFT JOIN stalls s ON b.stall_id = s.id WHERE b.bill_month = ${month} ORDER BY t.name ASC`;
      csv = toCSV(
        ["Pedagang", "Telepon", "Kode Lapak", "Zona", "Bulan", "Nominal (Rp)", "Status", "Tanggal Bayar"],
        bills.map((b) => [
          b.trader_name, b.phone, b.stall_code, b.zone,
          b.bill_month, b.amount,
          b.status === "paid" ? "Lunas" : "Belum Bayar",
          b.paid_at ? new Date(b.paid_at).toLocaleDateString("id-ID") : "",
        ])
      );
      filename = `tagihan-${month}.csv`;
    } else if (type === "traders") {
      const traders = await sql`SELECT t.*, s.stall_code, s.zone, s.category, s.monthly_fee, p.permit_number, p.status as permit_status, p.expiry_date FROM traders t LEFT JOIN stalls s ON t.stall_id = s.id LEFT JOIN permits p ON p.trader_id = t.id ORDER BY t.name ASC`;
      csv = toCSV(
        ["Nama", "NIK", "Telepon", "Tipe", "Kode Lapak", "Zona", "Kategori", "Sewa/Bulan", "Status", "No. SIPTU", "Status SIPTU", "Kedaluwarsa"],
        traders.map((t) => [
          t.name, t.nik, t.phone, t.trader_type,
          t.stall_code, t.zone, t.category, t.monthly_fee,
          t.status, t.permit_number, t.permit_status, t.expiry_date,
        ])
      );
      filename = `pedagang-${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (type === "stalls") {
      const stalls = await sql`SELECT s.*, t.name as trader_name, t.phone as trader_phone FROM stalls s LEFT JOIN traders t ON s.trader_id = t.id ORDER BY s.zone, s.row_x, s.col_y`;
      csv = toCSV(
        ["Kode Lapak", "Zona", "Kategori", "Status", "Baris", "Kolom", "Sewa/Bulan", "Nama Pedagang", "Telepon Pedagang"],
        stalls.map((s) => [
          s.stall_code, s.zone, s.category,
          s.status === "occupied" ? "Terisi" : "Kosong",
          s.row_x, s.col_y, s.monthly_fee,
          s.trader_name || "", s.trader_phone || "",
        ])
      );
      filename = `lapak-${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (type === "porter") {
      const porters = await sql`SELECT * FROM porters ORDER BY rating DESC`;
      csv = toCSV(
        ["Nama", "Telepon", "Status", "Rating"],
        porters.map((p) => [
          p.name, p.phone,
          p.status === "available" ? "Tersedia" : p.status === "active" ? "Bertugas" : "Off",
          p.rating,
        ])
      );
      filename = `porter-${new Date().toISOString().slice(0, 10)}.csv`;
    } else {
      return Response.json({ error: "type must be billing | traders | stalls | porter" }, { status: 400 });
    }

    // BOM for Excel UTF-8 compatibility
    const bom = "\uFEFF";
    return new Response(bom + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to export: " + error.message }, { status: 500 });
  }
}
