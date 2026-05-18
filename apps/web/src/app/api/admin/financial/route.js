import fs from 'node:fs';
import path from 'node:path';

function loadDB() {
  const dbPath = path.resolve(process.cwd(), 'svms_db.json');
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

export async function GET() {
  try {
    const db = loadDB();
    const { bills, stalls, traders } = db;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    function monthsAgo(billMonth) {
      const [y, m] = billMonth.split('-').map(Number);
      return (currentYear - y) * 12 + (currentMonth - m);
    }

    // ── 1. CASHFLOW – last 6 months ──────────────────────────────────────────
    const cashflow = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
      const monthBills = bills.filter(b => b.bill_month === key);
      const billed = monthBills.reduce((s, b) => s + Number(b.amount), 0);
      const collected = monthBills.filter(b => b.status === 'paid').reduce((s, b) => s + Number(b.amount), 0);
      cashflow.push({ month: key, label, billed, collected, gap: billed - collected, isPrediction: false });
    }

    // ── 2. PREDICTION – linear regression on collected ──────────────────────
    const xs = cashflow.map((_, i) => i);
    const ys = cashflow.map(m => m.collected);
    const n = xs.length;
    const sumX = xs.reduce((a, b) => a + b, 0);
    const sumY = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
    const sumX2 = xs.reduce((s, x) => s + x * x, 0);
    const denom = n * sumX2 - sumX * sumX;
    const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
    const intercept = (sumY - slope * sumX) / n;

    const predictions = [];
    for (let i = 1; i <= 3; i++) {
      const xNext = n - 1 + i;
      const d = new Date(currentYear, currentMonth - 1 + i, 1);
      const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
      const predicted = Math.max(0, Math.round(intercept + slope * xNext));
      const billedEst = Math.round(predicted / 0.82); // assume 82% collection target
      predictions.push({
        month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label,
        billed: billedEst,
        collected: 0,
        gap: 0,
        predicted,
        isPrediction: true,
      });
    }

    const cashflowChart = [...cashflow, ...predictions];

    // ── 3. AGING TUNGGAKAN ───────────────────────────────────────────────────
    const unpaidBills = bills.filter(b => b.status === 'unpaid');
    const aging = [
      { label: 'Bulan Ini', range: '0–30 hari', count: 0, amount: 0, color: '#eab308' },
      { label: '1–2 Bulan', range: '31–60 hari', count: 0, amount: 0, color: '#f97316' },
      { label: '2–3 Bulan', range: '61–90 hari', count: 0, amount: 0, color: '#ef4444' },
      { label: '> 3 Bulan', range: '90+ hari', count: 0, amount: 0, color: '#991b1b' },
    ];

    for (const bill of unpaidBills) {
      const age = monthsAgo(bill.bill_month);
      const amount = Number(bill.amount);
      const bucket = age === 0 ? 0 : age === 1 ? 1 : age === 2 ? 2 : 3;
      aging[bucket].count++;
      aging[bucket].amount += amount;
    }

    // ── 4. ZONE PERFORMANCE ──────────────────────────────────────────────────
    const zonePerformance = ['gold', 'silver', 'bronze'].map(zone => {
      const zoneStalls = stalls.filter(s => s.zone === zone);
      const traderIds = new Set(zoneStalls.filter(s => s.trader_id).map(s => s.trader_id));
      const zoneBills = bills.filter(b => traderIds.has(b.trader_id));
      const billed = zoneBills.reduce((s, b) => s + Number(b.amount), 0);
      const collected = zoneBills.filter(b => b.status === 'paid').reduce((s, b) => s + Number(b.amount), 0);
      const feeEx = zoneStalls.find(s => s.monthly_fee);
      return {
        zone,
        label: zone.charAt(0).toUpperCase() + zone.slice(1),
        totalStalls: zoneStalls.length,
        occupiedStalls: zoneStalls.filter(s => s.status === 'occupied').length,
        monthlyFee: feeEx?.monthly_fee || 0,
        billed,
        collected,
        unpaid: billed - collected,
        complianceRate: billed > 0 ? Math.round((collected / billed) * 100) : 0,
        unpaidCount: zoneBills.filter(b => b.status === 'unpaid').length,
      };
    });

    // ── 5. TOP UNPAID TRADERS ────────────────────────────────────────────────
    const traderDebt = {};
    for (const bill of unpaidBills) {
      if (!traderDebt[bill.trader_id]) traderDebt[bill.trader_id] = { traderId: bill.trader_id, totalDebt: 0, billCount: 0 };
      traderDebt[bill.trader_id].totalDebt += Number(bill.amount);
      traderDebt[bill.trader_id].billCount++;
    }
    const topDebtors = Object.values(traderDebt)
      .sort((a, b) => b.totalDebt - a.totalDebt)
      .slice(0, 5)
      .map(d => {
        const trader = traders.find(t => t.id === d.traderId);
        const stall = trader ? stalls.find(s => s.id === trader.stall_id) : null;
        return {
          name: trader?.name || 'Unknown',
          stall: stall?.stall_code || '-',
          zone: stall?.zone || '-',
          debt: d.totalDebt,
          bills: d.billCount,
        };
      });

    // ── 6. KPI SUMMARY ───────────────────────────────────────────────────────
    const totalBilled = bills.reduce((s, b) => s + Number(b.amount), 0);
    const totalCollected = bills.filter(b => b.status === 'paid').reduce((s, b) => s + Number(b.amount), 0);
    const totalUnpaid = unpaidBills.reduce((s, b) => s + Number(b.amount), 0);
    const activeCashflow = cashflow.filter(m => m.collected > 0);
    const monthlyAvg = activeCashflow.length > 0
      ? Math.round(activeCashflow.reduce((s, m) => s + m.collected, 0) / activeCashflow.length)
      : 0;
    const bestMonth = cashflow.reduce((best, m) => m.collected > (best?.collected || 0) ? m : best, cashflow[0]);
    const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
    const trendDirection = slope > 0 ? 'up' : slope < 0 ? 'down' : 'flat';

    return Response.json({
      cashflowChart,
      aging,
      zonePerformance,
      topDebtors,
      kpis: {
        totalBilled,
        totalCollected,
        totalUnpaid,
        collectionRate,
        monthlyAvg,
        bestMonth: { label: bestMonth?.label || '-', amount: bestMonth?.collected || 0 },
        nextMonthPrediction: predictions[0]?.predicted || 0,
        trendDirection,
        trendPercent: Math.abs(Math.round((slope / (monthlyAvg || 1)) * 100)),
      },
    });
  } catch (err) {
    console.error('Financial route error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
