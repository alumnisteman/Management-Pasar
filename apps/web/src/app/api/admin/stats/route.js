import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const [
      tradersStats,
      stallsStats,
      billsStats,
      porterStats,
      revenueStats,
      auditRecent,
    ] = await sql.transaction([
      // Trader counts
      sql`SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'warning') as warning,
        COUNT(*) FILTER (WHERE status = 'inactive') as inactive
      FROM traders`,

      // Stall occupancy
      sql`SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'occupied') as occupied,
        COUNT(*) FILTER (WHERE status = 'vacant') as vacant,
        COUNT(*) FILTER (WHERE zone = 'gold') as gold_count,
        COUNT(*) FILTER (WHERE zone = 'silver') as silver_count,
        COUNT(*) FILTER (WHERE zone = 'bronze') as bronze_count
      FROM stalls`,

      // Billing stats this month
      sql`SELECT
        COUNT(*) as total_bills,
        COUNT(*) FILTER (WHERE status = 'paid') as paid_count,
        COUNT(*) FILTER (WHERE status = 'unpaid') as unpaid_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as total_collected,
        COALESCE(SUM(amount), 0) as total_billed
      FROM bills
      WHERE bill_month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')`,

      // Porter stats
      sql`SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'available') as available,
        COUNT(*) FILTER (WHERE status = 'active') as on_duty,
        ROUND(AVG(rating)::numeric, 2) as avg_rating
      FROM porters`,

      // Revenue last 6 months
      sql`SELECT
        bill_month,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as collected,
        COALESCE(SUM(amount), 0) as billed
      FROM bills
      GROUP BY bill_month
      ORDER BY bill_month DESC
      LIMIT 6`,

      // Recent activity
      sql`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 8`,
    ]);

    const traders = tradersStats[0];
    const stalls = stallsStats[0];
    const billing = billsStats[0];
    const porters = porterStats[0];
    const occupancyRate =
      stalls.total > 0
        ? Math.round((Number(stalls.occupied) / Number(stalls.total)) * 100)
        : 0;
    const complianceRate =
      billing.total_bills > 0
        ? Math.round(
            (Number(billing.paid_count) / Number(billing.total_bills)) * 100,
          )
        : 0;

    // Permit stats
    const permitStats = await sql`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'expired') as expired,
        COUNT(*) FILTER (WHERE status = 'active' AND expiry_date <= CURRENT_DATE + INTERVAL '30 days') as expiring_soon
      FROM permits
    `;

    return Response.json({
      traders: {
        total: Number(traders.total),
        active: Number(traders.active),
        warning: Number(traders.warning),
        inactive: Number(traders.inactive),
      },
      stalls: {
        total: Number(stalls.total),
        occupied: Number(stalls.occupied),
        vacant: Number(stalls.vacant),
        occupancyRate,
        gold: Number(stalls.gold_count),
        silver: Number(stalls.silver_count),
        bronze: Number(stalls.bronze_count),
      },
      billing: {
        totalBills: Number(billing.total_bills),
        paid: Number(billing.paid_count),
        unpaid: Number(billing.unpaid_count),
        totalCollected: Number(billing.total_collected),
        totalBilled: Number(billing.total_billed),
        complianceRate,
      },
      porters: {
        total: Number(porters.total),
        available: Number(porters.available),
        onDuty: Number(porters.on_duty),
        avgRating: Number(porters.avg_rating || 5),
      },
      permits: {
        total: Number(permitStats[0].total),
        active: Number(permitStats[0].active),
        expired: Number(permitStats[0].expired),
        expiringSoon: Number(permitStats[0].expiring_soon),
      },
      revenue: revenueStats.map((r) => ({
        month: r.bill_month,
        collected: Number(r.collected),
        billed: Number(r.billed),
      })),
      recentActivity: auditRecent,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
