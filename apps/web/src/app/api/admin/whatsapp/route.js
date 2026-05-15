import sql from "@/app/api/utils/sql";

// Supported message templates
const templates = {
  billing_reminder: (data) =>
    `Yth. *${data.trader_name}*,\n\nTagihan sewa lapak *${data.stall_code}* untuk bulan *${data.bill_month}* sebesar *Rp ${Number(data.amount).toLocaleString("id-ID")}* belum terbayar.\n\nMohon segera melakukan pembayaran ke kantor manajemen pasar.\n\nTerima kasih 🙏\n_Manajemen Pasar Modern_`,

  siptu_expiry: (data) =>
    `Yth. *${data.trader_name}*,\n\nSIPTU Anda nomor *${data.permit_number}* akan kadaluarsa pada *${data.expiry_date}*.\n\nSilakan perpanjang SIPTU Anda di kantor manajemen sebelum tanggal tersebut.\n\nTerima kasih 🙏\n_Manajemen Pasar Modern_`,

  porter_incentive: (data) =>
    `Yth. *${data.porter_name}*,\n\nSelamat! Insentif minggu ini Anda telah disetujui.\n\n🏅 Tier: *${data.tier}*\n💰 Bonus: *Rp ${Number(data.bonus).toLocaleString("id-ID")}*\n⭐ Rating: ${data.rating}\n📦 Job selesai: ${data.jobs} job\n\nBonus akan dibayarkan segera. Terima kasih atas kerja kerasnya!\n_Manajemen Pasar Modern_`,

  general: (data) => data.message,
};

// Send via Fonnte (WA API populer Indonesia)
async function sendWhatsApp(phone, message) {
  const apiKey = process.env.WHATSAPP_API_KEY;
  if (!apiKey) {
    // Simulate success in dev if no key set
    console.log(`[WA QUEUE] To: ${phone} | Msg: ${message.slice(0, 60)}...`);
    return { status: "queued_dev", phone };
  }

  // Normalize phone number
  let normalized = phone.replace(/\D/g, "");
  if (normalized.startsWith("0")) normalized = "62" + normalized.slice(1);
  if (!normalized.startsWith("62")) normalized = "62" + normalized;

  const res = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target: normalized,
      message,
      countryCode: "62",
    }),
  });

  const result = await res.json();
  return result;
}

// GET: get queue history
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";

    let query = `SELECT * FROM audit_logs WHERE module = 'WhatsApp'`;
    const values = [];
    if (type) {
      query += ` AND action = $1`;
      values.push(type);
    }
    query += ` ORDER BY created_at DESC LIMIT 50`;

    const rows = await sql(query, values);
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch WA queue" },
      { status: 500 },
    );
  }
}

// POST: send notification(s)
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, targets } = body;
    // targets: array of { phone, ...templateData }
    // type: billing_reminder | siptu_expiry | porter_incentive | general

    if (!type || !targets || !targets.length) {
      return Response.json(
        { error: "type and targets[] required" },
        { status: 400 },
      );
    }

    const results = [];
    for (const target of targets) {
      const templateFn = templates[type] || templates.general;
      const message = templateFn(target);

      try {
        const result = await sendWhatsApp(target.phone, message);
        results.push({
          phone: target.phone,
          name: target.trader_name || target.porter_name,
          status: "sent",
          result,
        });

        await sql`
          INSERT INTO audit_logs (module, action, user_name, description)
          VALUES ('WhatsApp', ${type}, 'Sistem', ${`Notifikasi ${type} dikirim ke ${target.trader_name || target.porter_name} (${target.phone})`})
        `;
      } catch (e) {
        results.push({
          phone: target.phone,
          status: "failed",
          error: e.message,
        });
      }
    }

    return Response.json({
      sent: results.filter((r) => r.status === "sent").length,
      failed: results.filter((r) => r.status === "failed").length,
      results,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to send WhatsApp" }, { status: 500 });
  }
}
