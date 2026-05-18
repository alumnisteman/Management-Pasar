import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const stalls = await sql`SELECT * FROM stalls`;
    const bills = await sql`SELECT * FROM bills`;
    const porters = await sql`SELECT * FROM porters`;

    // 1. Revenue Trend (6 Months)
    // We will generate a structured array for the last 6 months.
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    const revenueTrend = [];
    
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const mStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
      const label = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
      
      // Use bill_month field to match billing records
      const monthBills = bills.filter(b => b.bill_month === mStr);

      const billed = monthBills.reduce((acc, b) => acc + Number(b.amount || 0), 0);
      const collected = monthBills.filter(b => b.status === 'paid').reduce((acc, b) => acc + Number(b.amount || 0), 0);

      revenueTrend.push({
        month: label,
        Ditagihkan: billed,
        Terkumpul: collected,
      });
    }

    // 2. Occupancy by Zone
    const zones = ['gold', 'silver', 'bronze'];
    const occupancyData = zones.map(z => {
      const zoneStalls = stalls.filter(s => s.zone === z);
      const occupied = zoneStalls.filter(s => s.status === 'occupied').length;
      const vacant = zoneStalls.length - occupied;
      return {
        name: `Zone ${z.charAt(0).toUpperCase() + z.slice(1)}`,
        Terisi: occupied,
        Kosong: vacant,
        Total: zoneStalls.length
      };
    });

    // 3. Billing Status Overview
    const totalPaid = bills.filter(b => b.status === 'paid').length;
    const totalUnpaid = bills.filter(b => b.status === 'unpaid').length;
    // Determine overdue by bill_month age (past months = overdue)
    const currentMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const unpaidBills = bills.filter(b => b.status === 'unpaid');
    const totalOverdue = unpaidBills.filter(b => b.bill_month < currentMonth).length;
    const totalUnpaidCurrent = Math.max(0, bills.filter(b => b.status === 'unpaid').length - totalOverdue);

    const billingStats = [
      { name: 'Lunas', value: totalPaid, fill: '#22c55e' },
      { name: 'Belum Bayar', value: totalUnpaidCurrent, fill: '#eab308' },
      { name: 'Jatuh Tempo', value: totalOverdue, fill: '#ef4444' }
    ];

    // 4. Porter Performance Distribution
    const porterRatings = [
      { rating: '5 Bintang', count: porters.filter(p => p.rating >= 4.5).length },
      { rating: '4 Bintang', count: porters.filter(p => p.rating >= 3.5 && p.rating < 4.5).length },
      { rating: '3 Bintang', count: porters.filter(p => p.rating >= 2.5 && p.rating < 3.5).length },
      { rating: '< 3 Bintang', count: porters.filter(p => p.rating < 2.5).length }
    ];

    return Response.json({
      revenueTrend,
      occupancyData,
      billingStats,
      porterRatings
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to load analytics data" }, { status: 500 });
  }
}
