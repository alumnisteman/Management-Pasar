import { NextResponse } from 'next/server';
import sql from '../../utils/sql';
import { verifyAuth } from '../../utils/auth';

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { action, payload } = data;

    if (action === 'send_bill_reminder') {
      // Simulate network delay for API connection to WA gateway
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this is where Twilio/Qiscus API is called
      const message = `[SIMULASI WA]\nYth. Bapak/Ibu,\nTagihan SIPTU/Sewa lapak Anda bulan ${payload.bill_month} sebesar Rp ${Number(payload.amount).toLocaleString('id-ID')} belum dibayar. Mohon segera dilunasi.`;
      
      // Log it to audit_logs
      await sql`INSERT INTO audit_logs (module, action, user_name, description, ip_address) VALUES ('Notifikasi', 'WA_SENT', ${user.username}, 'Mengirim WA tagihan ke ' || ${payload.trader_name}, '127.0.0.1')`;

      return NextResponse.json({
        success: true,
        message: 'Notification sent successfully',
        simulatedMessage: message
      });
    }

    if (action === 'bulk_reminders') {
      const { bills } = payload;
      if (!bills || bills.length === 0) {
        return NextResponse.json({ error: 'No bills provided' }, { status: 400 });
      }

      // Simulate a bit longer network delay for batch processing
      await new Promise(resolve => setTimeout(resolve, 2500));

      await sql`INSERT INTO audit_logs (module, action, user_name, description, ip_address) VALUES ('Notifikasi', 'BULK_WA_SENT', ${user.username}, 'Mengirim WA tagihan massal ke ' || ${bills.length} || ' pedagang', '127.0.0.1')`;

      return NextResponse.json({
        success: true,
        message: `${bills.length} notifications sent successfully`,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Notification API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process notification request' },
      { status: 500 }
    );
  }
}
