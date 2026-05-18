import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.resolve(process.cwd(), 'svms_db.json');

function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

export async function GET() {
  try {
    const db = loadDB();

    const traders = db.traders || [];
    const stalls = db.stalls || [];
    const bills = db.bills || [];
    const permits = db.permits || [];
    const porters = db.porters || [];
    const iotReadings = db.iot_readings || [];

    const activeTraders = traders.filter(t => t.status === 'active').length;
    const warningTraders = traders.filter(t => t.status === 'warning').length;
    const occupiedStalls = stalls.filter(s => s.status === 'occupied').length;
    const totalStalls = stalls.length;
    const occupancyRate = totalStalls > 0 ? Math.round((occupiedStalls / totalStalls) * 100) : 0;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthBills = bills.filter(b => b.bill_month === currentMonth);
    const paidBills = monthBills.filter(b => b.status === 'paid');
    const complianceRate = monthBills.length > 0 ? Math.round((paidBills.length / monthBills.length) * 100) : 100;
    const totalCollected = paidBills.reduce((sum, b) => sum + Number(b.amount), 0);

    const expiredPermits = permits.filter(p => p.status === 'expired').length;
    const availablePorters = porters.filter(p => p.status === 'available').length;
    const iotAlerts = iotReadings.filter(r =>
      (r.type === 'electricity' && r.reading > 500) || (r.type === 'water' && r.reading > 50)
    ).length;

    let insights = [];

    if (occupancyRate < 70) {
      insights.push(`tingkat hunian kios ${occupancyRate}% masih di bawah target optimal 80%`);
    } else {
      insights.push(`tingkat hunian kios mencapai ${occupancyRate}% — performa baik`);
    }

    if (complianceRate < 80) {
      insights.push(`kepatuhan tagihan bulan ini ${complianceRate}% memerlukan tindak lanjut segera`);
    } else {
      insights.push(`kepatuhan tagihan bulan ini ${complianceRate}% — tertib administrasi`);
    }

    if (warningTraders > 0) {
      insights.push(`terdapat ${warningTraders} pedagang berstatus peringatan yang perlu diverifikasi`);
    }

    if (expiredPermits > 0) {
      insights.push(`${expiredPermits} SIPTU sudah kedaluwarsa dan memerlukan perpanjangan`);
    }

    if (iotAlerts > 0) {
      insights.push(`${iotAlerts} lonjakan utilitas IoT terdeteksi — pantau konsumsi listrik/air`);
    }

    if (availablePorters === 0) {
      insights.push(`tidak ada porter tersedia saat ini — semua sedang bertugas`);
    }

    const totalCollectedFmt = new Intl.NumberFormat('id-ID').format(totalCollected);
    const summary =
      `Sistem pasar berjalan normal. Dari ${traders.length} pedagang terdaftar, ${activeTraders} aktif beroperasi. ` +
      `Pendapatan sewa bulan ${currentMonth} mencapai Rp ${totalCollectedFmt}. ` +
      `Analisis menunjukkan: ${insights.slice(0, 3).join('; ')}. ` +
      (insights.length > 3 ? `Rekomendasi: prioritaskan ${insights[3]}.` : `Seluruh sistem operasional dalam kondisi terkendali.`);

    return Response.json({ summary });
  } catch (error) {
    console.error('[GET /api/ai/brief]', error);
    return Response.json({ summary: 'Sistem analitik sedang memuat data pasar terbaru...' });
  }
}
