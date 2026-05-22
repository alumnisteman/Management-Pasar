import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { bill_id } = body;

    const bills = await sql`SELECT * FROM bills`;
    const bill = bills.find(b => String(b.id) === String(bill_id));

    if (!bill) {
      return Response.json({ error: "Bill not found" }, { status: 404 });
    }

    if (bill.status === 'paid') {
       return Response.json({ error: "Bill already paid" }, { status: 400 });
    }

    const updated = await sql`UPDATE bills SET status = 'paid' WHERE id = ${Number(bill_id)}`;

    // Optional: Log payment to audit_logs
    await sql`
      INSERT INTO audit_logs (module, action, user_name, description, ip_address)
      VALUES ('Tenant', 'PAYMENT', 'System', 'Pembayaran tagihan sukses ID: ' || ${bill_id}, '127.0.0.1')
    `;

    return Response.json({ success: true, bill: updated[0] });
  } catch (error) {
    console.error("[POST /api/tenant/pay-bill]", error);
    return Response.json({ error: "Failed to process bill payment" }, { status: 500 });
  }
}
