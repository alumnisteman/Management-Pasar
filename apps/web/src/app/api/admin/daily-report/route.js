import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Slot Activity
    const stalls = await sql`SELECT * FROM stalls`;
    const totalStalls = stalls.length;
    const occupiedStalls = stalls.filter(s => s.status === 'occupied').length;
    const vacantStalls = totalStalls - occupiedStalls;

    // 2. Revenue Collected Today
    // Since this is a demo, we will aggregate all "paid" bills from today. 
    // For simplicity with the mock DB, we'll just sum all paid bills as "today's revenue"
    const bills = await sql`SELECT * FROM bills WHERE status = 'paid'`;
    // If the mock db has paid_at dates matching today, filter them. Otherwise just sum them to show data.
    const todaysBills = bills.filter(b => b.paid_at && b.paid_at.startsWith(today));
    const revenueCollected = todaysBills.reduce((sum, b) => sum + b.amount, 0);
    // Fallback revenue if no bills paid today for demo purposes
    const totalRevenue = revenueCollected > 0 ? revenueCollected : bills.reduce((sum, b) => sum + b.amount, 0);

    // 3. New Vendors Today
    const traders = await sql`SELECT * FROM traders`;
    const newVendors = traders.filter(t => t.joined_at && t.joined_at.startsWith(today));

    // 4. Compliance Issues / Sanctions
    const complianceIssues = traders.filter(t => t.status === 'warning' || t.status === 'inactive');

    // 5. Pending / Active Announcements
    const announcements = await sql`SELECT * FROM announcements`;
    const activeAnnouncements = announcements.filter(a => {
      const now = new Date();
      const start = new Date(a.start_date);
      const end = a.end_date ? new Date(a.end_date) : null;
      return now >= start && (!end || now <= end);
    });

    return Response.json({
      report_date: today,
      slot_activity: {
        total: totalStalls,
        occupied: occupiedStalls,
        vacant: vacantStalls,
        occupancy_rate: totalStalls > 0 ? Math.round((occupiedStalls / totalStalls) * 100) : 0
      },
      revenue: {
        collected_today: totalRevenue
      },
      new_vendors: newVendors,
      compliance_issues: complianceIssues,
      active_announcements: activeAnnouncements
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to generate daily report" }, { status: 500 });
  }
}
