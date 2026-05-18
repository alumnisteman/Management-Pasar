import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const data = await request.json();
    const { action, payload } = data;

    if (action === "send_bill_reminder") {
      // Simulate network delay for API connection to WA gateway
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log it to audit_logs
      await sql`
        INSERT INTO audit_logs (module, action, description)
        VALUES ('Notifikasi', 'WA_SENT', ${`Mengirim WA tagihan ke ${payload.trader_name} (Lapak ${payload.stall_code}, Bulan ${payload.bill_month})`})
      `;

      return Response.json({
        success: true,
        message: `Pengingat tagihan berhasil dikirim ke ${payload.trader_name}`,
      });
    }

    if (action === "bulk_reminders") {
      const { bills } = payload;
      if (!bills || bills.length === 0) {
        return Response.json({ error: "No bills provided" }, { status: 400 });
      }

      // Simulate batch processing delay
      await new Promise((resolve) => setTimeout(resolve, 2500));

      await sql`
        INSERT INTO audit_logs (module, action, description)
        VALUES ('Notifikasi', 'BULK_WA_SENT', ${`Mengirim WA tagihan massal ke ${bills.length} pedagang`})
      `;

      return Response.json({
        success: true,
        message: `${bills.length} pengingat tagihan berhasil dikirim`,
      });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Notification API Error:", error);
    return Response.json(
      { error: "Failed to process notification request" },
      { status: 500 }
    );
  }
}
