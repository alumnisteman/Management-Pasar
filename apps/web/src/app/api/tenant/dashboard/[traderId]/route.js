import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { traderId } = params;
    
    // Get trader
    const traders = await sql`SELECT * FROM traders`;
    const trader = traders.find(t => String(t.id) === String(traderId));
    
    if (!trader) {
      return Response.json({ error: "Trader not found" }, { status: 404 });
    }

    // Get stall
    const stalls = await sql`SELECT * FROM stalls`;
    const stall = stalls.find(s => s.id === trader.stall_id) || null;

    // Get bills
    const bills = await sql`SELECT * FROM bills`;
    const traderBills = bills.filter(b => b.trader_id === trader.id);

    // Get permits
    const permits = await sql`SELECT * FROM permits`;
    const traderPermits = permits.filter(p => p.trader_id === trader.id);

    // Get contracts
    const contracts = await sql`SELECT * FROM contracts ORDER BY created_at DESC`;
    const traderContracts = contracts.filter(c => c.trader_id === trader.id);

    return Response.json({
      trader,
      stall,
      bills: traderBills,
      permits: traderPermits,
      contracts: traderContracts,
    });
  } catch (error) {
    console.error(`[GET /api/tenant/dashboard/${params?.traderId}]`, error);
    return Response.json({ error: "Failed to fetch tenant dashboard" }, { status: 500 });
  }
}
