import fs from 'node:fs';
import path from 'node:path';

// Local database persistence file path
const DB_PATH = path.resolve(process.cwd(), 'svms_db.json');

// Default initial seed data
const DEFAULT_DB = {
  users: [
    { id: 1, username: "admin", name: "Administrator Utama", password: "123", role: "admin", status: "active", created_at: "2026-05-01T00:00:00.000Z" },
    { id: 2, username: "petugas", name: "Petugas Lapangan", password: "123", role: "petugas", status: "active", created_at: "2026-05-01T00:00:00.000Z" }
  ],
  traders: [
    { id: 1, name: "Budi Santoso", nik: "3171012345670001", phone: "081234567890", trader_type: "tetap", stall_id: 1, joined_at: "2026-01-15T08:00:00.000Z", status: "active" },
    { id: 2, name: "Siti Aminah", nik: "3171012345670002", phone: "081234567891", trader_type: "tetap", stall_id: 2, joined_at: "2026-02-10T09:30:00.000Z", status: "active" },
    { id: 3, name: "Joko Widodo", nik: "3171012345670003", phone: "081234567892", trader_type: "tetap", stall_id: 3, joined_at: "2026-02-20T10:00:00.000Z", status: "warning" },
    { id: 4, name: "Dewi Lestari", nik: "3171012345670004", phone: "081234567893", trader_type: "tetap", stall_id: 4, joined_at: "2026-03-01T11:15:00.000Z", status: "active" },
    { id: 5, name: "Ahmad Fauzi", nik: "3171012345670005", phone: "081234567894", trader_type: "tetap", stall_id: 5, joined_at: "2026-03-12T14:20:00.000Z", status: "inactive" }
  ],
  stalls: [
    { id: 1, stall_code: "A-01", zone: "gold", category: "sembako", status: "occupied", trader_id: 1, monthly_fee: 750000, row_x: 0, col_y: 0 },
    { id: 2, stall_code: "A-02", zone: "gold", category: "sayuran", status: "occupied", trader_id: 2, monthly_fee: 750000, row_x: 0, col_y: 1 },
    { id: 3, stall_code: "A-03", zone: "gold", category: "daging", status: "occupied", trader_id: 3, monthly_fee: 750000, row_x: 0, col_y: 2 },
    { id: 4, stall_code: "B-01", zone: "silver", category: "pakaian", status: "occupied", trader_id: 4, monthly_fee: 500000, row_x: 1, col_y: 0 },
    { id: 5, stall_code: "B-02", zone: "silver", category: "bumbu", status: "vacant", trader_id: null, monthly_fee: 500000, row_x: 1, col_y: 1 },
    { id: 6, stall_code: "C-01", zone: "bronze", category: "jasa", status: "vacant", trader_id: null, monthly_fee: 350000, row_x: 2, col_y: 0 },
    { id: 7, stall_code: "A-04", zone: "gold", category: "sembako", status: "vacant", trader_id: null, monthly_fee: 750000, row_x: 0, col_y: 3 },
    { id: 8, stall_code: "A-05", zone: "gold", category: "sembako", status: "vacant", trader_id: null, monthly_fee: 750000, row_x: 0, col_y: 4 }
  ],
  bills: [
    { id: 1, trader_id: 1, stall_id: 1, bill_month: "2026-05", amount: 750000, status: "paid", paid_at: "2026-05-02T10:00:00.000Z", created_at: "2026-05-01T00:00:00.000Z" },
    { id: 2, trader_id: 2, stall_id: 2, bill_month: "2026-05", amount: 750000, status: "paid", paid_at: "2026-05-03T11:00:00.000Z", created_at: "2026-05-01T00:00:00.000Z" },
    { id: 3, trader_id: 3, stall_id: 3, bill_month: "2026-05", amount: 750000, status: "unpaid", paid_at: null, created_at: "2026-05-01T00:00:00.000Z" },
    { id: 4, trader_id: 4, stall_id: 4, bill_month: "2026-05", amount: 500000, status: "paid", paid_at: "2026-05-05T09:00:00.000Z", created_at: "2026-05-01T00:00:00.000Z" }
  ],
  porters: [
    { id: 1, name: "Slamet", phone: "089876543210", status: "available", rating: 4.8 },
    { id: 2, name: "Koko", phone: "089876543211", status: "active", rating: 4.6 },
    { id: 3, name: "Mamat", phone: "089876543212", status: "inactive", rating: 4.5 }
  ],
  porter_incentives: [
    { id: 1, porter_id: 1, tier: "platinum", bonus_amount: 250000, week_start: "2026-05-01", week_end: "2026-05-07" },
    { id: 2, porter_id: 2, tier: "gold", bonus_amount: 150000, week_start: "2026-05-01", week_end: "2026-05-07" }
  ],
  permits: [
    { id: 1, trader_id: 1, permit_number: "SIPTU-2026-0001", issue_date: "2026-01-15", expiry_date: "2027-01-15", status: "active", qr_token: "permit1" },
    { id: 2, trader_id: 2, permit_number: "SIPTU-2026-0002", issue_date: "2026-02-10", expiry_date: "2027-02-10", status: "active", qr_token: "permit2" },
    { id: 3, trader_id: 3, permit_number: "SIPTU-2026-0003", issue_date: "2026-02-20", expiry_date: "2026-05-10", status: "expired", qr_token: "permit3" }
  ],
  audit_logs: [
    { id: 1, module: "Sistem", action: "LOGIN", user_name: "Admin", description: "Admin masuk ke sistem", ip_address: "127.0.0.1", created_at: "2026-05-17T12:00:00.000Z" },
    { id: 2, module: "Pedagang", action: "CREATE", user_name: "Admin", description: "Pedagang baru terdaftar: Dewi Lestari", ip_address: "127.0.0.1", created_at: "2026-05-17T11:00:00.000Z" }
  ],
  announcements: [
    { id: 1, title: "Pembersihan Rutin Saluran Air", body: "Diberitahukan kepada seluruh pedagang bahwa besok akan diadakan pembersihan saluran air. Mohon rapikan barang dagangan Anda.", urgency: "INFO", target_zone: "all", start_date: "2026-05-10T00:00:00.000Z", end_date: "2026-05-20T23:59:59.000Z", created_at: "2026-05-10T08:00:00.000Z" },
    { id: 2, title: "Peringatan Tunggakan SIPTU", body: "Bagi pedagang di zona Bronze yang belum memperpanjang SIPTU, segera lakukan pembayaran sebelum akhir bulan untuk menghindari sanksi penutupan lapak.", urgency: "PENTING", target_zone: "bronze", start_date: "2026-05-15T00:00:00.000Z", end_date: "2026-05-31T23:59:59.000Z", created_at: "2026-05-15T09:00:00.000Z" },
    { id: 3, title: "KEBAKARAN KECIL DI ZONA SILVER!", body: "Harap evakuasi segera! Sedang dilakukan penanganan darurat oleh pihak damkar di Blok Silver B-01.", urgency: "DARURAT", target_zone: "all", start_date: "2026-05-18T00:00:00.000Z", end_date: null, created_at: "2026-05-18T08:30:00.000Z" }
  ],
  contracts: [
    { id: 1, trader_id: 1, start_date: "2026-01-15", end_date: "2027-01-14", rent_amount: 750000, terms: "Pembayaran dilakukan setiap tanggal 1. Dilarang mengubah struktur lapak tanpa izin.", status: "active", created_at: "2026-01-15T08:00:00.000Z" },
    { id: 2, trader_id: 2, start_date: "2026-02-10", end_date: "2027-02-09", rent_amount: 750000, terms: "Pedagang wajib menjaga kebersihan area lapak.", status: "active", created_at: "2026-02-10T09:00:00.000Z" },
    { id: 3, trader_id: 3, start_date: "2025-06-01", end_date: "2026-05-31", rent_amount: 750000, terms: "Kontrak satu tahun. Perpanjangan 30 hari sebelum kedaluwarsa.", status: "expired", created_at: "2025-06-01T08:00:00.000Z" }
  ],
  porter_requests: [],
  porter_jobs: [],
  iot_readings: [],
  complaints: []
};

// Read database helper
function loadDB() {
  if (fs.existsSync(DB_PATH)) {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      if (!content.trim()) {
         return JSON.parse(JSON.stringify(DEFAULT_DB)); // If file is empty, return default copy
      }
      return JSON.parse(content);
    } catch (err) {
      console.error('CRITICAL: Error reading/parsing local DB file. Halting to prevent data loss:', err);
      throw new Error("Database file is corrupted or locked. Please try again.");
    }
  } else {
    // Initialize file only if it truly does not exist
    const initialDb = JSON.parse(JSON.stringify(DEFAULT_DB));
    saveDB(initialDb);
    return initialDb;
  }
}

// Write database helper
function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to local DB file:', err);
  }
}

// Auto-backup mechanism
async function runAutoBackup() {
  try {
    if (!fs.existsSync(DB_PATH)) return;
    
    const backupDir = path.resolve(process.cwd(), 'backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const today = new Date().toISOString().split('T')[0];
    const backupFile = path.resolve(backupDir, `svms_db_backup_${today}.json`);
    
    if (!fs.existsSync(backupFile)) {
      fs.copyFileSync(DB_PATH, backupFile);
      
      // Cleanup old backups (> 7 days)
      const files = fs.readdirSync(backupDir);
      const now = Date.now();
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      
      files.forEach(file => {
        if (file.startsWith('svms_db_backup_')) {
          const filePath = path.resolve(backupDir, file);
          const stats = fs.statSync(filePath);
          if (now - stats.mtime.getTime() > SEVEN_DAYS) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }
  } catch (err) {
    console.error('Failed to run auto backup:', err);
  }
}

// Custom SQL query parser and executor
export async function executeSQL(queryStr, values = []) {
  runAutoBackup().catch(() => {});
  if (typeof queryStr !== 'string') {
    return queryStr;
  }
  const db = loadDB();
  const query = queryStr.trim().replace(/\s+/g, ' ');

  // ── 0. SIMPLE SELECT * FROM <table> ──
  // Handle plain un-aliased full-table reads used by analytics, daily-report etc.
  if (query === 'SELECT * FROM stalls' || query === 'SELECT * FROM stalls ORDER BY zone, row_x, col_y') {
    return [...db.stalls];
  }
  if (query === 'SELECT * FROM bills' || query.match(/^SELECT \* FROM bills WHERE status = '\w+'$/)) {
    const statusMatch = query.match(/status = '(\w+)'/);
    if (statusMatch) return db.bills.filter(b => b.status === statusMatch[1]);
    return [...db.bills];
  }
  if (query === 'SELECT * FROM traders') {
    return [...db.traders];
  }
  if (query === 'SELECT * FROM porters ORDER BY name ASC' || query === 'SELECT * FROM porters') {
    return [...db.porters].sort((a, b) => a.name.localeCompare(b.name));
  }
  if (query === 'SELECT * FROM permits') {
    return [...db.permits];
  }
  if (query === 'SELECT * FROM contracts ORDER BY created_at DESC') {
    return [...(db.contracts || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  if (query === 'SELECT * FROM announcements') {
    return [...(db.announcements || [])];
  }
  if (query === 'SELECT * FROM porter_requests ORDER BY created_at DESC') {
    return [...(db.porter_requests || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // ── 1. SELECT AUDIT LOGS ──
  if (query.startsWith('SELECT * FROM audit_logs')) {
    let logs = [...db.audit_logs];
    // Check module filter parameter
    const moduleIndex = query.indexOf('module = $');
    if (moduleIndex !== -1) {
      const idx = parseInt(query.substring(moduleIndex + 10, moduleIndex + 12).trim()) - 1;
      const filterModule = values[idx];
      logs = logs.filter(l => l.module === filterModule);
    }
    // ORDER BY
    logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    // LIMIT
    const limitIndex = query.indexOf('LIMIT $');
    if (limitIndex !== -1) {
      const idx = parseInt(query.substring(limitIndex + 7, limitIndex + 9).trim()) - 1;
      const limitVal = parseInt(values[idx]) || 50;
      logs = logs.slice(0, limitVal);
    } else if (query.includes('LIMIT 8')) {
      logs = logs.slice(0, 8);
    }
    return logs;
  }

  // ── 2. STATS QUERIES ──
  if (query.includes('FROM traders') && query.includes('COUNT(*) as total')) {
    return [{
      total: db.traders.length,
      active: db.traders.filter(t => t.status === 'active').length,
      warning: db.traders.filter(t => t.status === 'warning').length,
      inactive: db.traders.filter(t => t.status === 'inactive').length
    }];
  }

  if (query.includes('FROM stalls') && query.includes('COUNT(*) as total')) {
    return [{
      total: db.stalls.length,
      occupied: db.stalls.filter(s => s.status === 'occupied').length,
      vacant: db.stalls.filter(s => s.status === 'vacant').length,
      gold_count: db.stalls.filter(s => s.zone === 'gold').length,
      silver_count: db.stalls.filter(s => s.zone === 'silver').length,
      bronze_count: db.stalls.filter(s => s.zone === 'bronze').length
    }];
  }

  if (query.includes('FROM bills') && query.includes('total_bills')) {
    const curMonth = values[0] || '2026-05';
    const monthBills = db.bills.filter(b => b.bill_month === curMonth);
    const paid = monthBills.filter(b => b.status === 'paid');
    return [{
      total_bills: monthBills.length,
      paid_count: paid.length,
      unpaid_count: monthBills.length - paid.length,
      total_collected: paid.reduce((sum, b) => sum + Number(b.amount), 0),
      total_billed: monthBills.reduce((sum, b) => sum + Number(b.amount), 0)
    }];
  }

  if (query.includes('FROM porters') && query.includes('COUNT(*)')) {
    return [{
      total: db.porters.length,
      available: db.porters.filter(p => p.status === 'available').length,
      on_duty: db.porters.filter(p => p.status === 'active').length,
      avg_rating: (db.porters.reduce((sum, p) => sum + p.rating, 0) / db.porters.length) || 5.0
    }];
  }

  if (query.includes('FROM bills') && query.includes('GROUP BY bill_month')) {
    // Last 6 months aggregate
    const monthsMap = {};
    db.bills.forEach(b => {
      if (!monthsMap[b.bill_month]) {
        monthsMap[b.bill_month] = { bill_month: b.bill_month, collected: 0, billed: 0 };
      }
      monthsMap[b.bill_month].billed += Number(b.amount);
      if (b.status === 'paid') {
        monthsMap[b.bill_month].collected += Number(b.amount);
      }
    });
    return Object.values(monthsMap)
      .sort((a, b) => b.bill_month.localeCompare(a.bill_month))
      .slice(0, 6);
  }

  if (query.includes('FROM permits') && query.includes('expiring_soon')) {
    return [{
      total: db.permits.length,
      active: db.permits.filter(p => p.status === 'active').length,
      expired: db.permits.filter(p => p.status === 'expired').length,
      expiring_soon: db.permits.filter(p => p.status === 'active' && p.expiry_date <= '2026-06-17').length
    }];
  }

  // ── 3. TRADERS QUERIES ──
  if (query.includes('SELECT t.*') || (query.includes('FROM traders t') && query.includes('SELECT'))) {
    // Return combined trader + stall + permit records
    let rows = db.traders.map(t => {
      const stall = db.stalls.find(s => s.id === t.stall_id) || {};
      const permit = db.permits.find(p => p.trader_id === t.id) || {};
      return {
        ...t,
        stall_code: stall.stall_code || null,
        zone: stall.zone || null,
        category: stall.category || null,
        permit_number: permit.permit_number || null,
        permit_status: permit.status || null,
        expiry_date: permit.expiry_date || null
      };
    });

    // Handle search filter (values[0])
    const searchIdx = query.indexOf('LOWER(t.name) LIKE LOWER($');
    if (searchIdx !== -1) {
      const idx = parseInt(query.substring(searchIdx + 26, searchIdx + 28).trim()) - 1;
      const searchVal = (values[idx] || '').replace(/%/g, '').toLowerCase();
      if (searchVal) {
        rows = rows.filter(r => 
          (r.name || '').toLowerCase().includes(searchVal) || 
          (r.nik || '').includes(searchVal) || 
          (r.phone || '').includes(searchVal)
        );
      }
    }

    // Handle status filter
    const statusIdx = query.indexOf('t.status = $');
    if (statusIdx !== -1) {
      const idx = parseInt(query.substring(statusIdx + 12, statusIdx + 14).trim()) - 1;
      const statusVal = values[idx];
      if (statusVal) {
        rows = rows.filter(r => r.status === statusVal);
      }
    }

    return rows;
  }

  if (query.includes('INSERT INTO traders')) {
    // Insert new trader
    const [name, nik, phone, trader_type, stall_id] = values;
    const newId = db.traders.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    const newTrader = {
      id: newId,
      name,
      nik,
      phone,
      trader_type: trader_type || "tetap",
      stall_id: stall_id || null,
      joined_at: new Date().toISOString(),
      status: "active"
    };
    db.traders.push(newTrader);
    saveDB(db);
    return [newTrader];
  }

  if (query.includes('UPDATE traders SET')) {
    const id = values[4] || values[0];
    const trader = db.traders.find(t => t.id === id);
    if (trader) {
      if (values[0] !== undefined) trader.status = values[0];
      if (values[1] !== undefined) trader.name = values[1];
      if (values[2] !== undefined) trader.phone = values[2];
      if (values[3] !== undefined) trader.stall_id = values[3];
      saveDB(db);
      return [trader];
    }
    return [];
  }

  // ── 4. STALLS QUERIES ──
  if (query.includes('FROM stalls s') && query.includes('SELECT s.*')) {
    return db.stalls.map(s => {
      const trader = db.traders.find(t => t.id === s.trader_id) || {};
      return {
        ...s,
        trader_name: trader.name || null,
        trader_phone: trader.phone || null
      };
    });
  }

  if (query.includes('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = \'occupied\') as occupied FROM stalls WHERE zone =')) {
    const zoneVal = values[0];
    const zoneStalls = db.stalls.filter(s => s.zone === zoneVal);
    return [{
      total: zoneStalls.length,
      occupied: zoneStalls.filter(s => s.status === 'occupied').length
    }];
  }

  if (query.includes('UPDATE stalls SET monthly_fee =') && query.includes('WHERE zone =')) {
    const feeVal = values[0];
    const zoneVal = values[1];
    const zoneStalls = db.stalls.filter(s => s.zone === zoneVal);
    zoneStalls.forEach(s => {
      s.monthly_fee = feeVal;
    });
    saveDB(db);
    return zoneStalls;
  }

  if (query.includes('UPDATE stalls SET') && query.includes('WHERE trader_id =')) {
    // Vacate stall: UPDATE stalls SET status = 'vacant', trader_id = NULL WHERE trader_id = $1
    const traderId = values[0];
    const stall = db.stalls.find(s => s.trader_id === traderId || s.trader_id === Number(traderId));
    if (stall) {
      stall.status = 'vacant';
      stall.trader_id = null;
      saveDB(db);
      return [stall];
    }
    return [];
  }

  if (query.includes('UPDATE stalls SET') && query.includes('WHERE id =')) {
    // id is always the last value in the template
    const id = values[values.length - 1];
    const stall = db.stalls.find(s => s.id === id || s.id === Number(id));
    if (stall) {
      // values order: status(0), trader_id(1), zone(2), category(3), monthly_fee(4), id is last
      if (values[0] !== undefined && values[0] !== null) stall.status = values[0];
      if (values[1] !== undefined) stall.trader_id = values[1] === null ? null : (values[1] || null);
      if (values[2] !== undefined && values[2] !== null) stall.zone = values[2];
      if (values[3] !== undefined && values[3] !== null) stall.category = values[3];
      if (values[4] !== undefined && values[4] !== null) stall.monthly_fee = values[4];
      saveDB(db);
      return [stall];
    }
    return [];
  }

  if (query.includes('INSERT INTO stalls')) {
    const [stall_code, zone, category, monthly_fee, row_x, col_y] = values;
    const newId = db.stalls.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    const newStall = {
      id: newId,
      stall_code,
      zone,
      category,
      status: "vacant",
      trader_id: null,
      monthly_fee: parseInt(monthly_fee),
      row_x: parseInt(row_x),
      col_y: parseInt(col_y)
    };
    db.stalls.push(newStall);
    saveDB(db);
    return [newStall];
  }

  if (query.includes('DELETE FROM stalls')) {
    const id = values[0];
    const initialLength = db.stalls.length;
    db.stalls = db.stalls.filter(s => s.id !== id);
    saveDB(db);
    if (db.stalls.length < initialLength) {
      return [{ success: true }];
    }
    return [];
  }

  // ── 5. BILLS QUERIES ──
  if (query.includes('FROM bills b') && query.includes('SELECT b.*')) {
    let rows = db.bills.map(b => {
      const trader = db.traders.find(t => t.id === b.trader_id) || {};
      const stall = db.stalls.find(s => s.id === b.stall_id) || {};
      return {
        ...b,
        trader_name: trader.name || null,
        phone: trader.phone || null,
        stall_code: stall.stall_code || null,
        zone: stall.zone || null
      };
    });

    const monthIdx = query.indexOf('b.bill_month = $');
    if (monthIdx !== -1) {
      const idx = parseInt(query.substring(monthIdx + 16, monthIdx + 18).trim()) - 1;
      const monthVal = values[idx];
      if (monthVal) rows = rows.filter(r => r.bill_month === monthVal);
    }

    const statusIdx = query.indexOf('b.status = $');
    if (statusIdx !== -1) {
      const idx = parseInt(query.substring(statusIdx + 12, statusIdx + 14).trim()) - 1;
      const statusVal = values[idx];
      if (statusVal) rows = rows.filter(r => r.status === statusVal);
    }

    return rows;
  }

  if (query.includes('SELECT t.id, t.stall_id, s.monthly_fee FROM traders t')) {
    const billMonth = values[0];
    // Return all active traders who don't have bills yet for this month
    return db.traders
      .filter(t => t.status === 'active')
      .filter(t => !db.bills.some(b => b.trader_id === t.id && b.bill_month === billMonth))
      .map(t => {
        const stall = db.stalls.find(s => s.id === t.stall_id) || {};
        return {
          id: t.id,
          stall_id: t.stall_id,
          monthly_fee: stall.monthly_fee || 500000
        };
      });
  }

  if (query.includes('INSERT INTO bills')) {
    const [trader_id, stall_id, bill_month, amount] = values;
    const newId = db.bills.reduce((max, b) => Math.max(max, b.id), 0) + 1;
    const newBill = {
      id: newId,
      trader_id,
      stall_id,
      bill_month,
      amount,
      status: 'unpaid',
      paid_at: null,
      created_at: new Date().toISOString()
    };
    db.bills.push(newBill);
    saveDB(db);
    return [newBill];
  }

  if (query.includes('UPDATE bills SET status = \'paid\'')) {
    const id = values[0];
    const bill = db.bills.find(b => b.id === id);
    if (bill) {
      bill.status = 'paid';
      bill.paid_at = new Date().toISOString();
      saveDB(db);
      return [bill];
    }
    return [];
  }

  // ── 6. PORTERS QUERIES ──
  if (query.includes('UPDATE porters SET status =')) {
    const statusVal = values[0];
    const idVal = values[1];
    const porter = db.porters.find(p => p.id === Number(idVal) || p.id === idVal);
    if (porter) {
      porter.status = statusVal;
      saveDB(db);
      return [porter];
    }
    return [];
  }

  if (query.includes('UPDATE porters SET status')) {
    // Handle: UPDATE porters SET status = $1 WHERE id = $2
    const idVal = values[values.length - 1];
    const porter = db.porters.find(p => p.id === Number(idVal) || p.id === idVal);
    if (porter) {
      if (values[0] !== undefined) porter.status = values[0];
      saveDB(db);
      return [porter];
    }
    return [];
  }

  if (query.includes('INSERT INTO porters')) {
    const [name, phone, id_number, daily_target] = values;
    const newId = db.porters.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const newPorter = {
      id: newId,
      name,
      phone,
      id_number: id_number || null,
      daily_target: daily_target || 100000,
      status: 'available',
      rating: 5.0
    };
    db.porters.push(newPorter);
    saveDB(db);
    return [newPorter];
  }

  if (query.includes('FROM porters')) {
    if (query.includes('WHERE p.id =') || query.includes('WHERE id =')) {
      const idVal = values[0];
      const p = db.porters.find(p => p.id === Number(idVal)) || db.porters[0] || null;
      if (p) {
        return [{
          ...p,
          daily_earnings: 0
        }];
      }
      return [];
    }
    return db.porters;
  }

  // ── PORTER JOBS QUERIES ──
  if (query.includes('FROM porter_jobs')) {
    const jobs = db.porter_jobs || [];
    if (query.includes('WHERE porter_id =')) {
      const porterId = values[0];
      return jobs.filter(j => j.porter_id === Number(porterId) || j.porter_id === porterId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return [...jobs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  if (query.includes('INSERT INTO porter_jobs')) {
    const [porter_id, customer_name, location_from, location_to, weight_category, fee] = values;
    if (!db.porter_jobs) db.porter_jobs = [];
    const newId = db.porter_jobs.reduce((max, j) => Math.max(max, j.id), 0) + 1;
    const newJob = {
      id: newId,
      porter_id: Number(porter_id),
      customer_name,
      location_from,
      location_to,
      weight_category,
      fee: Number(fee),
      status: 'pending',
      created_at: new Date().toISOString(),
      completed_at: null
    };
    db.porter_jobs.push(newJob);
    saveDB(db);
    return [newJob];
  }

  if (query.includes('UPDATE porter_jobs SET')) {
    const jobs = db.porter_jobs || [];
    const idVal = values[values.length - 1];
    const job = jobs.find(j => j.id === Number(idVal) || j.id === idVal);
    if (job) {
      if (values[0] !== undefined) job.status = values[0];
      if (values[0] === 'completed') job.completed_at = new Date().toISOString();
      saveDB(db);
      return [job];
    }
    return [];
  }

  if (query.includes('FROM porter_incentives') && query.includes('SELECT pi.*')) {
    const incentives = db.porter_incentives || [];
    if (query.includes('WHERE pi.porter_id =')) {
      const porterId = values[0];
      return incentives
        .filter(pi => pi.porter_id === Number(porterId) || pi.porter_id === porterId)
        .sort((a, b) => b.week_start.localeCompare(a.week_start))
        .slice(0, 12)
        .map(pi => {
          const porter = db.porters.find(p => p.id === pi.porter_id) || {};
          return { ...pi, porter_name: porter.name || null };
        });
    }
    return incentives
      .sort((a, b) => b.week_start.localeCompare(a.week_start))
      .map(pi => {
        const porter = db.porters.find(p => p.id === pi.porter_id) || {};
        return { ...pi, porter_name: porter.name || null };
      });
  }

  if (query.includes('SELECT id FROM porter_incentives')) {
    const porterId = values[0];
    const weekStart = values[1];
    return (db.porter_incentives || []).filter(
      pi => (pi.porter_id === Number(porterId) || pi.porter_id === porterId) && pi.week_start === weekStart
    );
  }

  if (query.includes('INSERT INTO porter_incentives')) {
    const [porter_id, week_start, week_end, jobs_completed, avg_rating, total_earnings, days_hit_target, tier, bonus_amount, status] = values;
    if (!db.porter_incentives) db.porter_incentives = [];
    const newId = db.porter_incentives.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const newInc = {
      id: newId,
      porter_id: Number(porter_id),
      week_start,
      week_end,
      jobs_completed: Number(jobs_completed || 0),
      avg_rating: Number(avg_rating || 0),
      total_earnings: Number(total_earnings || 0),
      days_hit_target: Number(days_hit_target || 0),
      tier,
      bonus_amount: Number(bonus_amount || 0),
      status: status || 'approved'
    };
    db.porter_incentives.push(newInc);
    saveDB(db);
    return [newInc];
  }

  if (query.includes('UPDATE porter_incentives')) {
    const incentives = db.porter_incentives || [];
    if (query.includes('SET status = \'paid\'') || (query.includes('SET status') && query.includes('paid_at'))) {
      const idVal = values[0];
      const inc = incentives.find(i => i.id === Number(idVal) || i.id === idVal);
      if (inc) {
        inc.status = 'paid';
        inc.paid_at = new Date().toISOString();
        saveDB(db);
        return [inc];
      }
      return [];
    }
    if (query.includes('SET jobs_completed')) {
      // Update incentive stats
      const porterId = values[values.length - 2];
      const weekStart = values[values.length - 1];
      const inc = incentives.find(i =>
        (i.porter_id === Number(porterId) || i.porter_id === porterId) && i.week_start === weekStart
      );
      if (inc) {
        if (values[0] !== undefined) inc.jobs_completed = Number(values[0]);
        if (values[1] !== undefined) inc.avg_rating = Number(values[1]);
        if (values[2] !== undefined) inc.total_earnings = Number(values[2]);
        if (values[3] !== undefined) inc.days_hit_target = Number(values[3]);
        if (values[4] !== undefined) inc.tier = values[4];
        if (values[5] !== undefined) inc.bonus_amount = Number(values[5]);
        inc.status = 'approved';
        saveDB(db);
        return [inc];
      }
      return [];
    }
    return [];
  }

  // ── 7. PERMITS QUERIES ──
  if (query.includes('FROM permits') && query.includes('SELECT *')) {
    return db.permits;
  }

  if (query.includes('INSERT INTO permits')) {
    const [trader_id, permit_number, issue_date, expiry_date, status, qr_token] = values;
    const newId = db.permits.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const newPermit = {
      id: newId,
      trader_id,
      permit_number,
      issue_date,
      expiry_date,
      status,
      qr_token
    };
    db.permits.push(newPermit);
    saveDB(db);
    return [newPermit];
  }

  if (query.includes('UPDATE permits SET')) {
    const id = values[values.length - 1];
    const permit = db.permits.find(p => p.id === Number(id));
    if (permit) {
      if (values[0] !== undefined) permit.status = values[0];
      if (values[1] !== undefined) permit.expiry_date = values[1];
      saveDB(db);
      return [permit];
    }
    return [];
  }

  // ── 8. AUDIT LOGS INSERTS ──
  if (query.includes('INSERT INTO audit_logs')) {
    const [module, action, user_name, description, ip_address] = values;
    const newId = db.audit_logs.reduce((max, l) => Math.max(max, l.id), 0) + 1;
    const newLog = {
      id: newId,
      module,
      action,
      user_name: user_name || 'Admin',
      description,
      ip_address: ip_address || '127.0.0.1',
      created_at: new Date().toISOString()
    };
    db.audit_logs.push(newLog);
    saveDB(db);
    return [newLog];
  }

  // ── 8.5 COMPLAINTS INSERTS ──
  if (query.includes('INSERT INTO complaints')) {
    const [trader_id, stall_id, category, title, description, priority] = values;
    if (!db.complaints) db.complaints = [];
    const newId = db.complaints.reduce((max, c) => Math.max(max, c.id), 0) + 1;
    const newComplaint = {
      id: newId,
      trader_id,
      stall_id,
      category,
      title,
      description,
      priority: priority || 'medium',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    db.complaints.push(newComplaint);
    saveDB(db);
    return [newComplaint];
  }

  // ── 9. USERS QUERIES ──
  if (query.includes('FROM users')) {
    if (query.includes('WHERE username =')) {
      const username = values[0];
      return db.users.filter(u => u.username === username && u.status === 'active');
    }
    return db.users;
  }

  if (query.includes('INSERT INTO users')) {
    const [username, name, password, role] = values;
    const newId = db.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
    const newUser = {
      id: newId,
      username,
      name,
      password, // In a real app, hash this!
      role,
      status: 'active',
      created_at: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDB(db);
    return [newUser];
  }

  if (query.includes('UPDATE users SET')) {
    const id = values[4] || values[3] || values[2]; // fallback index depending on query structure
    // Let's make it robust by checking the values array
    // Assuming query is UPDATE users SET name = $1, role = $2, status = $3, password = $4 WHERE id = $5
    // But since it varies, let's parse based on standard indices we'll use in our route.
    
    // We will find the user by ID (always the last parameter we pass in our route)
    const targetId = values[values.length - 1];
    const user = db.users.find(u => u.id === targetId);
    
    if (user) {
      if (query.includes('name = $')) user.name = values[0];
      if (query.includes('role = $')) user.role = values[1];
      if (query.includes('status = $')) user.status = values[2];
      if (query.includes('password = $')) user.password = values[3];
      saveDB(db);
      return [user];
    }
    return [];
  }

  // ── 8. ANNOUNCEMENTS QUERIES ──
  if (query.includes('FROM announcements') && query.includes('SELECT')) {
    let rows = db.announcements.map(a => ({...a}));
    if (query.includes('ORDER BY')) {
      if (query.includes('created_at DESC')) {
        rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
    }
    return rows;
  }

  if (query.includes('INSERT INTO announcements')) {
    const [title, body, urgency, target_zone, start_date, end_date] = values;
    const newId = db.announcements.reduce((max, a) => Math.max(max, a.id), 0) + 1;
    const newAnn = {
      id: newId,
      title,
      body,
      urgency,
      target_zone,
      start_date,
      end_date,
      created_at: new Date().toISOString()
    };
    db.announcements.push(newAnn);
    saveDB(db);
    return [newAnn];
  }

  if (query.includes('UPDATE announcements')) {
    const id = values[values.length - 1]; // id is the last parameter
    const ann = db.announcements.find(a => a.id === id);
    if (!ann) return [];
    
    // Simple positional mapping based on typical query structure
    if (query.includes('title = $')) ann.title = values[0];
    if (query.includes('body = $')) ann.body = values[1];
    if (query.includes('urgency = $')) ann.urgency = values[2];
    if (query.includes('target_zone = $')) ann.target_zone = values[3];
    if (query.includes('start_date = $')) ann.start_date = values[4];
    if (query.includes('end_date = $')) ann.end_date = values[5];
    
    // For single field updates (like archiving/restoring)
    if (query.includes('end_date = $1 WHERE id = $2')) {
      ann.end_date = values[0];
    }
    
    saveDB(db);
    return [ann];
  }

  if (query.includes('DELETE FROM announcements')) {
    const id = values[0];
    db.announcements = db.announcements.filter(a => a.id !== id);
    saveDB(db);
    return [{ success: true }];
  }

  // ── CONTRACTS QUERIES ──
  if (query.includes('FROM contracts') && query.includes('SELECT')) {
    const rows = (db.contracts || []).map(c => ({...c}));
    rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return rows;
  }

  if (query.includes('INSERT INTO contracts')) {
    const [trader_id, start_date, end_date, rent_amount, terms, status, created_at] = values;
    if (!db.contracts) db.contracts = [];
    const newId = db.contracts.reduce((max, c) => Math.max(max, c.id), 0) + 1;
    const newContract = { id: newId, trader_id, start_date, end_date, rent_amount, terms, status, created_at };
    db.contracts.push(newContract);
    saveDB(db);
    return [newContract];
  }

  if (query.includes('UPDATE contracts SET')) {
    const id = values[2] || values[1];
    const contract = (db.contracts || []).find(c => c.id === id);
    if (contract) {
      if (values[0] !== undefined) contract.status = values[0];
      if (values[1] !== undefined) contract.end_date = values[1];
      saveDB(db);
      return [contract];
    }
    return [];
  }

  if (query.includes('DELETE FROM contracts')) {
    const id = values[0];
    if (db.contracts) db.contracts = db.contracts.filter(c => c.id !== id);
    saveDB(db);
    return [{ success: true }];
  }

  // ── PORTER REQUESTS QUERIES ──
  if (query.includes('FROM porter_requests') && query.includes('SELECT')) {
    const rows = (db.porter_requests || []).map(r => ({...r}));
    rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return rows;
  }

  if (query.includes('INSERT INTO porter_requests')) {
    const [trader_name, location_from, location_to, weight_category, notes] = values;
    if (!db.porter_requests) db.porter_requests = [];
    const newId = db.porter_requests.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    const req = { id: newId, trader_name, location_from, location_to, weight_category, notes: notes || '', status: 'pending', porter_id: null, created_at: new Date().toISOString() };
    db.porter_requests.push(req);
    saveDB(db);
    return [req];
  }

  if (query.includes('UPDATE porter_requests SET')) {
    const id = values[values.length - 1];
    const req = (db.porter_requests || []).find(r => r.id === id);
    if (req) {
      if (values[0] !== undefined) req.status = values[0];
      if (values[1] !== undefined) req.porter_id = values[1];
      saveDB(db);
      return [req];
    }
    return [];
  }

  // Fallback
  console.log('Unmatched Query:', query);
  return [];
}

// Callable function and template tag implementation
const sql = async (stringsOrQuery, ...values) => {
  let query = '';
  let queryValues = [];

  if (Array.isArray(stringsOrQuery)) {
    stringsOrQuery.forEach((str, i) => {
      query += str;
      if (i < values.length) {
        query += `$${i + 1}`;
        queryValues.push(values[i]);
      }
    });
  } else {
    query = stringsOrQuery;
    queryValues = values[0] || [];
  }

  return executeSQL(query, queryValues);
};

// Transaction wrapper
sql.transaction = async (queries) => {
  const results = [];
  for (const q of queries) {
    if (q instanceof Promise || (q && typeof q.then === 'function')) {
      results.push(await q);
    } else if (typeof q === 'string') {
      results.push(await executeSQL(q));
    } else if (q && q.strings) {
      results.push(await executeSQL(q.strings.join('?'), q.values || []));
    } else {
      results.push(await q);
    }
  }
  return results;
};

export default sql;