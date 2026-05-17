import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.resolve(process.cwd(), 'svms_db.json');

const DEFAULT_DB = {
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
    { id: 6, stall_code: "C-01", zone: "bronze", category: "jasa", status: "vacant", trader_id: null, monthly_fee: 350000, row_x: 2, col_y: 0 }
  ],
  bills: [
    { id: 1, trader_id: 1, stall_id: 1, bill_month: "2026-05", amount: 750000, status: "paid", paid_at: "2026-05-02T10:00:00.000Z", created_at: "2026-05-01T00:00:00.000Z" },
    { id: 2, trader_id: 2, stall_id: 2, bill_month: "2026-05", amount: 750000, status: "paid", paid_at: "2026-05-03T11:00:00.000Z", created_at: "2026-05-01T00:00:00.000Z" },
    { id: 3, trader_id: 3, stall_id: 3, bill_month: "2026-05", amount: 750000, status: "unpaid", paid_at: null, created_at: "2026-05-01T00:00:00.000Z" },
    { id: 4, trader_id: 4, stall_id: 4, bill_month: "2026-05", amount: 500000, status: "paid", paid_at: "2026-05-05T09:00:00.000Z", created_at: "2026-05-01T00:00:00.000Z" }
  ],
  porters: [
    { id: 1, name: "Slamet", phone: "089876543210", id_number: "ID001", daily_target: 100000, status: "available", rating: 4.8 },
    { id: 2, name: "Koko", phone: "089876543211", id_number: "ID002", daily_target: 100000, status: "active", rating: 4.6 },
    { id: 3, name: "Mamat", phone: "089876543212", id_number: "ID003", daily_target: 100000, status: "inactive", rating: 4.5 }
  ],
  porter_jobs: [
    { id: 1, porter_id: 1, customer_name: "Ibu Ratna", location_from: "Gerbang A", location_to: "Lapak A-01", weight_category: "sedang", fee: 25000, status: "completed", rating: 5, feedback: "Cepat dan baik", rated_at: "2026-05-15T10:30:00.000Z", completed_at: "2026-05-15T10:00:00.000Z", created_at: "2026-05-15T09:45:00.000Z" },
    { id: 2, porter_id: 2, customer_name: "Pak Bambang", location_from: "Gerbang B", location_to: "Lapak B-01", weight_category: "berat", fee: 50000, status: "completed", rating: 4, feedback: "Baik", rated_at: "2026-05-15T14:00:00.000Z", completed_at: "2026-05-15T13:30:00.000Z", created_at: "2026-05-15T13:00:00.000Z" },
    { id: 3, porter_id: 1, customer_name: "Ibu Sri", location_from: "Parkir", location_to: "Lapak A-02", weight_category: "ringan", fee: 15000, status: "completed", rating: 5, feedback: "Sangat membantu", rated_at: "2026-05-16T09:00:00.000Z", completed_at: "2026-05-16T08:45:00.000Z", created_at: "2026-05-16T08:30:00.000Z" }
  ],
  porter_incentives: [
    { id: 1, porter_id: 1, week_start: "2026-05-11", week_end: "2026-05-17", jobs_completed: 20, avg_rating: 4.9, total_earnings: 400000, days_hit_target: 5, tier: "gold", bonus_amount: 100000, status: "approved", paid_at: null },
    { id: 2, porter_id: 2, week_start: "2026-05-11", week_end: "2026-05-17", jobs_completed: 12, avg_rating: 4.5, total_earnings: 250000, days_hit_target: 3, tier: "silver", bonus_amount: 60000, status: "approved", paid_at: null }
  ],
  permits: [
    { id: 1, trader_id: 1, permit_number: "SIPTU-2026-0001", issue_date: "2026-01-15", expiry_date: "2027-01-15", status: "active", qr_token: "permit1" },
    { id: 2, trader_id: 2, permit_number: "SIPTU-2026-0002", issue_date: "2026-02-10", expiry_date: "2027-02-10", status: "active", qr_token: "permit2" },
    { id: 3, trader_id: 3, permit_number: "SIPTU-2026-0003", issue_date: "2026-02-20", expiry_date: "2026-05-10", status: "expired", qr_token: "permit3" }
  ],
  audit_logs: [
    { id: 1, module: "Sistem", action: "LOGIN", user_name: "Admin", description: "Admin masuk ke sistem", ip_address: "127.0.0.1", created_at: "2026-05-17T12:00:00.000Z" },
    { id: 2, module: "Pedagang", action: "CREATE", user_name: "Admin", description: "Pedagang baru terdaftar: Dewi Lestari", ip_address: "127.0.0.1", created_at: "2026-05-17T11:00:00.000Z" },
    { id: 3, module: "Billing", action: "PAYMENT", user_name: "Admin", description: "Tagihan lunas - Budi Santoso", ip_address: "127.0.0.1", created_at: "2026-05-17T10:00:00.000Z" }
  ]
};

function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure all tables exist (migrate if needed)
      if (!parsed.porter_jobs) parsed.porter_jobs = DEFAULT_DB.porter_jobs;
      if (!parsed.porter_incentives) parsed.porter_incentives = DEFAULT_DB.porter_incentives;
      return parsed;
    }
  } catch (err) {
    console.error('Error loading local DB file:', err);
  }
  saveDB(DEFAULT_DB);
  return { ...DEFAULT_DB };
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to local DB file:', err);
  }
}

// Parse literal VALUES from a SQL INSERT string, e.g. VALUES ('Module', 'ACTION', $1)
function parseLiteralValues(query, paramValues) {
  // Match VALUES clause
  const valMatch = query.match(/VALUES\s*\(([^)]+)\)/i);
  if (!valMatch) return paramValues;
  const parts = valMatch[1].split(',').map(s => s.trim());
  let paramIdx = 0;
  return parts.map(part => {
    if (part.startsWith("'") && part.endsWith("'")) {
      return part.slice(1, -1);
    }
    if (part.startsWith('$')) {
      return paramValues[paramIdx++];
    }
    return paramValues[paramIdx++];
  });
}

export async function executeSQL(queryStr, values = []) {
  if (typeof queryStr !== 'string') return queryStr;
  const db = loadDB();
  const query = queryStr.trim().replace(/\s+/g, ' ');

  // ── AUDIT LOGS SELECT ──
  if (query.includes('SELECT * FROM audit_logs') || (query.includes('FROM audit_logs') && query.includes('module = '))) {
    let logs = [...db.audit_logs];
    const moduleIdx = query.indexOf("module = $");
    if (moduleIdx !== -1) {
      const idx = parseInt(query.substring(moduleIdx + 10, moduleIdx + 12).trim()) - 1;
      const filterModule = values[idx];
      if (filterModule) logs = logs.filter(l => l.module === filterModule);
    }
    if (query.includes("module = 'WhatsApp'")) {
      logs = logs.filter(l => l.module === 'WhatsApp');
      if (query.includes('action = $1')) {
        const type = values[0];
        if (type) logs = logs.filter(l => l.action === type);
      }
    }
    logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const limitMatch = query.match(/LIMIT \$(\d+)/i);
    if (limitMatch) {
      const idx = parseInt(limitMatch[1]) - 1;
      const limitVal = parseInt(values[idx]) || 50;
      logs = logs.slice(0, limitVal);
    } else if (query.includes('LIMIT 8')) {
      logs = logs.slice(0, 8);
    } else if (query.includes('LIMIT 50')) {
      logs = logs.slice(0, 50);
    }
    return logs;
  }

  // ── STATS: trader counts ──
  if (query.includes('FROM traders') && query.includes('COUNT(*) as total') && !query.includes('SELECT t.*')) {
    return [{
      total: db.traders.length,
      active: db.traders.filter(t => t.status === 'active').length,
      warning: db.traders.filter(t => t.status === 'warning').length,
      inactive: db.traders.filter(t => t.status === 'inactive').length
    }];
  }

  // ── STATS: stall occupancy (all zones) ──
  // Distinguished from zone-specific queries by presence of gold_count column alias
  if (query.includes('FROM stalls') && query.includes('gold_count')) {
    return [{
      total: db.stalls.length,
      occupied: db.stalls.filter(s => s.status === 'occupied').length,
      vacant: db.stalls.filter(s => s.status === 'vacant').length,
      gold_count: db.stalls.filter(s => s.zone === 'gold').length,
      silver_count: db.stalls.filter(s => s.zone === 'silver').length,
      bronze_count: db.stalls.filter(s => s.zone === 'bronze').length
    }];
  }

  // ── STATS: stall zone count for dynamic pricing ──
  if (query.includes('FROM stalls') && query.includes('WHERE zone =') && query.includes('COUNT(*) as total') && !query.includes('gold_count')) {
    const zoneVal = values[0];
    const zoneStalls = db.stalls.filter(s => s.zone === zoneVal);
    return [{
      total: zoneStalls.length,
      occupied: zoneStalls.filter(s => s.status === 'occupied').length
    }];
  }

  // ── STATS: billing for current month ──
  if (query.includes('FROM bills') && query.includes('total_bills')) {
    const now = new Date();
    const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
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

  // ── STATS: porter counts ──
  if (query.includes('FROM porters') && query.includes('COUNT(*) as total') && !query.includes('WHERE p.id')) {
    const ratingSum = db.porters.reduce((sum, p) => sum + Number(p.rating || 0), 0);
    return [{
      total: db.porters.length,
      available: db.porters.filter(p => p.status === 'available').length,
      on_duty: db.porters.filter(p => p.status === 'active').length,
      avg_rating: db.porters.length > 0 ? (ratingSum / db.porters.length).toFixed(2) : '5.00'
    }];
  }

  // ── STATS: revenue by month ──
  if (query.includes('FROM bills') && query.includes('GROUP BY bill_month')) {
    const monthsMap = {};
    db.bills.forEach(b => {
      if (!monthsMap[b.bill_month]) {
        monthsMap[b.bill_month] = { bill_month: b.bill_month, collected: 0, billed: 0 };
      }
      monthsMap[b.bill_month].billed += Number(b.amount);
      if (b.status === 'paid') monthsMap[b.bill_month].collected += Number(b.amount);
    });
    return Object.values(monthsMap)
      .sort((a, b) => b.bill_month.localeCompare(a.bill_month))
      .slice(0, 6);
  }

  // ── STATS: permit counts ──
  if (query.includes('FROM permits') && query.includes('expiring_soon')) {
    const today = new Date().toISOString().split('T')[0];
    const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return [{
      total: db.permits.length,
      active: db.permits.filter(p => p.status === 'active').length,
      expired: db.permits.filter(p => p.status === 'expired').length,
      expiring_soon: db.permits.filter(p => p.status === 'active' && p.expiry_date <= in30).length
    }];
  }

  // ── TRADERS: SELECT all (plain, no alias) ──
  if (query.match(/^SELECT \* FROM traders/) && !query.includes('COUNT') && !query.includes('JOIN')) {
    return [...db.traders];
  }

  // ── STALLS: SELECT all (plain, no alias) ──
  if (query.match(/^SELECT \* FROM stalls/) && !query.includes('COUNT') && !query.includes('JOIN')) {
    return [...db.stalls];
  }

  // ── TRADERS: SELECT with joins ──
  if ((query.includes('SELECT t.*') || (query.includes('FROM traders t') && query.includes('SELECT'))) && !query.includes('INSERT') && !query.includes('UPDATE')) {
    let rows = db.traders.map(t => {
      const stall = db.stalls.find(s => s.id === t.stall_id) || {};
      const permit = db.permits.find(p => p.trader_id === t.id) || {};
      return {
        ...t,
        stall_code: stall.stall_code || null,
        zone: stall.zone || null,
        category: stall.category || null,
        monthly_fee: stall.monthly_fee || null,
        permit_number: permit.permit_number || null,
        permit_status: permit.status || null,
        expiry_date: permit.expiry_date || null
      };
    });

    const searchMatch = query.match(/LOWER\(t\.name\) LIKE LOWER\(\$(\d+)\)/);
    if (searchMatch) {
      const idx = parseInt(searchMatch[1]) - 1;
      const searchVal = (values[idx] || '').replace(/%/g, '').toLowerCase();
      if (searchVal) {
        rows = rows.filter(r =>
          (r.name || '').toLowerCase().includes(searchVal) ||
          (r.nik || '').includes(searchVal) ||
          (r.phone || '').includes(searchVal)
        );
      }
    }

    const statusMatch = query.match(/t\.status = \$(\d+)/);
    if (statusMatch) {
      const idx = parseInt(statusMatch[1]) - 1;
      const statusVal = values[idx];
      if (statusVal) rows = rows.filter(r => r.status === statusVal);
    }

    rows.sort((a, b) => new Date(b.joined_at) - new Date(a.joined_at));
    return rows;
  }

  // ── TRADERS: SELECT name for delete audit ──
  if (query.includes('SELECT name FROM traders WHERE id =')) {
    const id = values[0];
    const trader = db.traders.find(t => t.id == id);
    return trader ? [{ name: trader.name }] : [];
  }

  // ── TRADERS: INSERT ──
  if (query.includes('INSERT INTO traders')) {
    const [name, nik, phone, trader_type, stall_id] = values;
    const newId = db.traders.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    const newTrader = {
      id: newId, name, nik, phone,
      trader_type: trader_type || 'tetap',
      stall_id: stall_id || null,
      joined_at: new Date().toISOString(),
      status: 'active'
    };
    db.traders.push(newTrader);
    saveDB(db);
    return [newTrader];
  }

  // ── TRADERS: UPDATE status = 'inactive' WHERE id (from DELETE flow) ──
  if (query.includes('UPDATE traders SET') && query.includes("status = 'inactive'") && !query.includes('COALESCE')) {
    const id = values[0];
    const trader = db.traders.find(t => t.id == id);
    if (trader) {
      trader.status = 'inactive';
      saveDB(db);
      return [trader];
    }
    return [];
  }

  // ── TRADERS: UPDATE PATCH (multiple fields with COALESCE) ──
  if (query.includes('UPDATE traders SET') && query.includes('COALESCE')) {
    // values: [status, name, phone, stall_id, id]
    const id = values[4];
    const trader = db.traders.find(t => t.id == id);
    if (trader) {
      if (values[0] != null) trader.status = values[0];
      if (values[1] != null) trader.name = values[1];
      if (values[2] != null) trader.phone = values[2];
      if (values[3] != null) trader.stall_id = values[3];
      saveDB(db);
      return [trader];
    }
    return [];
  }

  // ── STALLS: SELECT with trader joins ──
  if (query.includes('FROM stalls s') && query.includes('SELECT s.*')) {
    return db.stalls.map(s => {
      const trader = db.traders.find(t => t.id === s.trader_id) || {};
      return { ...s, trader_name: trader.name || null, trader_phone: trader.phone || null };
    }).sort((a, b) => a.row_x - b.row_x || a.col_y - b.col_y);
  }

  // ── STALLS: UPDATE dynamic pricing for zone ──
  if (query.includes('UPDATE stalls SET monthly_fee =') && query.includes('WHERE zone =')) {
    const feeVal = values[0];
    const zoneVal = values[1];
    const zoneStalls = db.stalls.filter(s => s.zone === zoneVal);
    zoneStalls.forEach(s => { s.monthly_fee = Number(feeVal); });
    saveDB(db);
    return zoneStalls;
  }

  // ── STALLS: UPDATE vacate by trader_id ──
  if (query.includes('UPDATE stalls SET') && query.includes("status = 'vacant'") && query.includes('WHERE trader_id =')) {
    const traderId = values[0];
    db.stalls.filter(s => s.trader_id == traderId).forEach(s => {
      s.status = 'vacant';
      s.trader_id = null;
    });
    saveDB(db);
    return [];
  }

  // ── STALLS: UPDATE occupied by id ──
  if (query.includes('UPDATE stalls SET') && query.includes("status = 'occupied'") && query.includes('WHERE id =')) {
    const [traderId, stallId] = values;
    const stall = db.stalls.find(s => s.id == stallId);
    if (stall) {
      stall.status = 'occupied';
      stall.trader_id = Number(traderId);
      saveDB(db);
      return [stall];
    }
    return [];
  }

  // ── STALLS: UPDATE PATCH (general, multiple fields) ──
  if (query.includes('UPDATE stalls SET') && query.includes('WHERE id =') && !query.includes("status = 'occupied'")) {
    // values: [status, trader_id, zone, category, monthly_fee, id]
    const id = values[5];
    const stall = db.stalls.find(s => s.id == id);
    if (stall) {
      if (values[0] != null) stall.status = values[0];
      // Only update trader_id if explicitly provided (not null from omission)
      if (values[1] !== null && values[1] !== undefined) stall.trader_id = values[1];
      if (values[2] != null) stall.zone = values[2];
      if (values[3] != null) stall.category = values[3];
      if (values[4] != null) stall.monthly_fee = Number(values[4]);
      saveDB(db);
      return [stall];
    }
    return [];
  }

  // ── BILLS: SELECT with joins ──
  if (query.includes('FROM bills b') && query.includes('SELECT b.*')) {
    let rows = db.bills.map(b => {
      const trader = db.traders.find(t => t.id === b.trader_id) || {};
      const stall = db.stalls.find(s => s.id === b.stall_id) || {};
      return { ...b, trader_name: trader.name || null, phone: trader.phone || null, stall_code: stall.stall_code || null, zone: stall.zone || null };
    });

    const monthMatch = query.match(/b\.bill_month = \$(\d+)/);
    if (monthMatch) {
      const idx = parseInt(monthMatch[1]) - 1;
      const monthVal = values[idx];
      if (monthVal) rows = rows.filter(r => r.bill_month === monthVal);
    }

    const statusMatch = query.match(/b\.status = \$(\d+)/);
    if (statusMatch) {
      const idx = parseInt(statusMatch[1]) - 1;
      const statusVal = values[idx];
      if (statusVal) rows = rows.filter(r => r.status === statusVal);
    }

    rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return rows;
  }

  // ── BILLS: SELECT for billing report ──
  if (query.includes('FROM bills b') && query.includes('JOIN traders t ON b.trader_id = t.id') && !query.includes('SELECT b.*')) {
    const monthMatch = query.match(/WHERE b\.bill_month = \$(\d+)/);
    let rows = db.bills.map(b => {
      const trader = db.traders.find(t => t.id === b.trader_id) || {};
      const stall = db.stalls.find(s => s.id === b.stall_id) || {};
      return { ...b, trader_name: trader.name || null, phone: trader.phone || null, stall_code: stall.stall_code || null, zone: stall.zone || null };
    });
    if (monthMatch) {
      const idx = parseInt(monthMatch[1]) - 1;
      const monthVal = values[idx];
      if (monthVal) rows = rows.filter(r => r.bill_month === monthVal);
    }
    return rows.sort((a, b) => (a.trader_name || '').localeCompare(b.trader_name || ''));
  }

  // ── BILLS: SELECT active traders without bills (for generate) ──
  if (query.includes('SELECT t.id, t.stall_id, s.monthly_fee FROM traders t')) {
    const billMonth = values[0];
    return db.traders
      .filter(t => t.status === 'active')
      .filter(t => !db.bills.some(b => b.trader_id === t.id && b.bill_month === billMonth))
      .map(t => {
        const stall = db.stalls.find(s => s.id === t.stall_id) || {};
        return { id: t.id, stall_id: t.stall_id, monthly_fee: stall.monthly_fee || 500000 };
      });
  }

  // ── BILLS: INSERT ──
  if (query.includes('INSERT INTO bills')) {
    const [trader_id, stall_id, bill_month, amount] = values;
    const newId = db.bills.reduce((max, b) => Math.max(max, b.id), 0) + 1;
    const newBill = {
      id: newId, trader_id, stall_id, bill_month,
      amount: Number(amount), status: 'unpaid', paid_at: null,
      created_at: new Date().toISOString()
    };
    db.bills.push(newBill);
    saveDB(db);
    return [newBill];
  }

  // ── BILLS: UPDATE paid ──
  if (query.includes("UPDATE bills SET status = 'paid'")) {
    const id = values[0];
    const bill = db.bills.find(b => b.id == id);
    if (bill) {
      bill.status = 'paid';
      bill.paid_at = new Date().toISOString();
      saveDB(db);
      return [bill];
    }
    return [];
  }

  // ── PORTERS: SELECT individual with daily earnings ──
  if (query.includes('FROM porters p') && query.includes('WHERE p.id =')) {
    const porterId = values[0];
    const porter = db.porters.find(p => p.id == porterId);
    if (!porter) return [undefined];
    const today = new Date().toISOString().split('T')[0];
    const dailyEarnings = (db.porter_jobs || [])
      .filter(j => j.porter_id == porterId && j.status === 'completed' && j.created_at && j.created_at.startsWith(today))
      .reduce((sum, j) => sum + Number(j.fee || 0), 0);
    return [{ ...porter, daily_earnings: dailyEarnings }];
  }

  // ── PORTERS: SELECT all ──
  if ((query.includes('FROM porters') || query.includes('FROM porters p')) && query.includes('SELECT *') && !query.includes('WHERE')) {
    return [...db.porters].sort((a, b) => a.name.localeCompare(b.name));
  }

  // ── PORTERS: UPDATE status ──
  if (query.includes('UPDATE porters SET status =')) {
    let status_val, porter_id;
    if (values.length >= 2) {
      [status_val, porter_id] = values;
    } else {
      const match = query.match(/status = '(\w+)'/);
      status_val = match ? match[1] : 'available';
      porter_id = values[0];
    }
    const porter = db.porters.find(p => p.id == porter_id);
    if (porter) {
      porter.status = status_val;
      saveDB(db);
      return [porter];
    }
    return [];
  }

  // ── PORTERS: UPDATE rating ──
  if (query.includes('UPDATE porters SET rating =')) {
    const [newRating, porter_id] = values;
    const porter = db.porters.find(p => p.id == porter_id);
    if (porter) {
      porter.rating = Number(newRating);
      saveDB(db);
      return [porter];
    }
    return [];
  }

  // ── PORTERS: INSERT ──
  if (query.includes('INSERT INTO porters')) {
    const [name, phone, id_number, daily_target] = values;
    const newId = db.porters.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const newPorter = { id: newId, name, phone, id_number, daily_target: Number(daily_target || 100000), status: 'available', rating: 5.0 };
    db.porters.push(newPorter);
    saveDB(db);
    return [newPorter];
  }

  // ── PORTER JOBS: SELECT ratings (pj.id, pj.rating ...) ──
  if (query.includes('FROM porter_jobs pj') && query.includes('pj.rating')) {
    const jobs = db.porter_jobs || [];
    if (query.includes('WHERE pj.id =')) {
      const jobId = values[0];
      return [jobs.find(j => j.id == jobId) || null];
    }
    if (query.includes('WHERE pj.porter_id =')) {
      const porterId = values[0];
      return jobs
        .filter(j => j.porter_id == porterId && j.rating != null)
        .sort((a, b) => new Date(b.rated_at || b.created_at) - new Date(a.rated_at || a.created_at))
        .slice(0, 20);
    }
    return jobs;
  }

  // ── PORTER JOBS: incentive weekly stats ──
  if (query.includes('FROM porter_jobs') && query.includes('jobs_completed')) {
    const porterId = values[0];
    const jobs = (db.porter_jobs || []).filter(j => j.porter_id == porterId && j.status === 'completed');
    const ratedJobs = jobs.filter(j => j.rating != null);
    const avgRating = ratedJobs.length > 0
      ? (ratedJobs.reduce((s, j) => s + j.rating, 0) / ratedJobs.length).toFixed(2)
      : '0.00';
    return [{
      jobs_completed: jobs.length,
      avg_rating: avgRating,
      total_earnings: jobs.reduce((s, j) => s + Number(j.fee || 0), 0)
    }];
  }

  // ── PORTER JOBS: daily earnings aggregation ──
  if (query.includes('FROM porter_jobs') && query.includes('SUM(fee)') && query.includes('GROUP BY')) {
    const porterId = values[0];
    const jobs = (db.porter_jobs || []).filter(j => j.porter_id == porterId && j.status === 'completed');
    const byDay = {};
    jobs.forEach(j => {
      const day = (j.created_at || '').split('T')[0];
      if (!byDay[day]) byDay[day] = 0;
      byDay[day] += Number(j.fee || 0);
    });
    return Object.entries(byDay).map(([day, day_total]) => ({ day, day_total }));
  }

  // ── PORTER JOBS: SELECT all / by porter ──
  if (query.includes('FROM porter_jobs') && query.includes('SELECT *')) {
    let jobs = db.porter_jobs || [];
    if (query.includes('WHERE porter_id =')) {
      const porterId = values[0];
      jobs = jobs.filter(j => j.porter_id == porterId);
    }
    return [...jobs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // ── PORTER JOBS: INSERT ──
  if (query.includes('INSERT INTO porter_jobs')) {
    const [porter_id, customer_name, location_from, location_to, weight_category, fee] = values;
    if (!db.porter_jobs) db.porter_jobs = [];
    const newId = db.porter_jobs.reduce((max, j) => Math.max(max, j.id), 0) + 1;
    const newJob = {
      id: newId, porter_id: Number(porter_id), customer_name,
      location_from, location_to, weight_category,
      fee: Number(fee || 0), status: 'pending',
      rating: null, feedback: null, rated_at: null,
      completed_at: null, created_at: new Date().toISOString()
    };
    db.porter_jobs.push(newJob);
    saveDB(db);
    return [newJob];
  }

  // ── PORTER JOBS: UPDATE status ──
  if (query.includes('UPDATE porter_jobs') && query.includes('status =') && !query.includes('rating =')) {
    const [status_val, id_val] = values;
    const job = (db.porter_jobs || []).find(j => j.id == id_val);
    if (job) {
      job.status = status_val;
      if (status_val === 'completed') job.completed_at = new Date().toISOString();
      saveDB(db);
      return [job];
    }
    return [];
  }

  // ── PORTER JOBS: UPDATE rating/feedback ──
  if (query.includes('UPDATE porter_jobs') && query.includes('rating =')) {
    const [rating_val, feedback_val, id_val] = values;
    const job = (db.porter_jobs || []).find(j => j.id == id_val);
    if (job && job.status === 'completed') {
      job.rating = Number(rating_val);
      job.feedback = feedback_val || null;
      job.rated_at = new Date().toISOString();
      saveDB(db);
      return [job];
    }
    return job ? [] : [];
  }

  // ── PORTER INCENTIVES: SELECT check existing ──
  if (query.includes('SELECT id FROM porter_incentives')) {
    const [porterId, weekStart] = values;
    return (db.porter_incentives || []).filter(pi => pi.porter_id == porterId && pi.week_start === weekStart);
  }

  // ── PORTER INCENTIVES: SELECT with join ──
  if (query.includes('FROM porter_incentives pi') && query.includes('SELECT pi.*')) {
    let rows = (db.porter_incentives || []).map(pi => {
      const porter = db.porters.find(p => p.id === pi.porter_id) || {};
      return { ...pi, porter_name: porter.name || null };
    });
    if (query.includes('WHERE pi.porter_id =')) {
      const porterId = values[0];
      rows = rows.filter(pi => pi.porter_id == porterId);
    }
    rows.sort((a, b) => b.week_start.localeCompare(a.week_start) || b.bonus_amount - a.bonus_amount);
    if (query.includes('LIMIT 12')) rows = rows.slice(0, 12);
    if (query.includes('LIMIT 50')) rows = rows.slice(0, 50);
    return rows;
  }

  // ── PORTER INCENTIVES: UPDATE fields ──
  if (query.includes('UPDATE porter_incentives') && query.includes('SET jobs_completed')) {
    const [jobs_completed, avg_rating, total_earnings, days_hit_target, tier, bonus_amount, porterId, weekStart] = values;
    const pi = (db.porter_incentives || []).find(p => p.porter_id == porterId && p.week_start === weekStart);
    if (pi) {
      Object.assign(pi, { jobs_completed, avg_rating, total_earnings, days_hit_target, tier, bonus_amount, status: 'approved' });
      saveDB(db);
      return [pi];
    }
    return [];
  }

  // ── PORTER INCENTIVES: UPDATE paid ──
  if (query.includes('UPDATE porter_incentives') && query.includes("status = 'paid'")) {
    const id = values[0];
    const pi = (db.porter_incentives || []).find(p => p.id == id);
    if (pi) {
      pi.status = 'paid';
      pi.paid_at = new Date().toISOString();
      saveDB(db);
      return [pi];
    }
    return [];
  }

  // ── PORTER INCENTIVES: INSERT ──
  if (query.includes('INSERT INTO porter_incentives')) {
    const [porter_id, week_start, week_end, jobs_completed, avg_rating, total_earnings, days_hit_target, tier, bonus_amount] = values;
    if (!db.porter_incentives) db.porter_incentives = [];
    const newId = db.porter_incentives.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const newRecord = {
      id: newId, porter_id: Number(porter_id), week_start, week_end,
      jobs_completed: Number(jobs_completed), avg_rating: Number(avg_rating),
      total_earnings: Number(total_earnings), days_hit_target: Number(days_hit_target),
      tier, bonus_amount: Number(bonus_amount), status: 'approved', paid_at: null
    };
    db.porter_incentives.push(newRecord);
    saveDB(db);
    return [newRecord];
  }

  // ── PERMITS: SELECT by qr_token ──
  if (query.includes('FROM permits') && query.includes('qr_token')) {
    const token = values[0];
    return db.permits.filter(p => p.qr_token === token);
  }

  // ── PERMITS: SELECT all ──
  if (query.includes('FROM permits') && query.includes('SELECT *') && !query.includes('expiring_soon')) {
    return [...db.permits];
  }

  // ── PERMITS: SELECT for reports (with trader join) ──
  if (query.includes('FROM traders t') && query.includes('LEFT JOIN permits p ON p.trader_id = t.id')) {
    return db.traders.map(t => {
      const stall = db.stalls.find(s => s.id === t.stall_id) || {};
      const permit = db.permits.find(p => p.trader_id === t.id) || {};
      return { ...t, stall_code: stall.stall_code || null, zone: stall.zone || null, category: stall.category || null, monthly_fee: stall.monthly_fee || null, permit_number: permit.permit_number || null, permit_status: permit.status || null, expiry_date: permit.expiry_date || null };
    }).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  // ── PERMITS: SELECT for porter incentive report ──
  if (query.includes('FROM porters') && query.includes('SELECT *') && query.includes('ORDER BY rating')) {
    return [...db.porters].sort((a, b) => Number(b.rating) - Number(a.rating));
  }

  // ── PERMITS: INSERT ──
  if (query.includes('INSERT INTO permits')) {
    const [trader_id, permit_number, issue_date, expiry_date, status, qr_token] = values;
    const newId = db.permits.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const newPermit = { id: newId, trader_id: Number(trader_id), permit_number, issue_date, expiry_date, status: status || 'active', qr_token };
    // Check ON CONFLICT DO NOTHING
    if (query.includes('ON CONFLICT') && db.permits.find(p => p.permit_number === permit_number)) {
      return [db.permits.find(p => p.permit_number === permit_number)];
    }
    db.permits.push(newPermit);
    saveDB(db);
    return [newPermit];
  }

  // ── PERMITS: UPDATE ──
  if (query.includes('UPDATE permits SET')) {
    // values: [status, expiry_date, id]
    const [status_val, expiry_val, id_val] = values;
    const permit = db.permits.find(p => p.id == id_val);
    if (permit) {
      if (status_val != null) permit.status = status_val;
      if (expiry_val != null) permit.expiry_date = expiry_val;
      saveDB(db);
      return [permit];
    }
    return [];
  }

  // ── AUDIT LOGS: INSERT ──
  if (query.includes('INSERT INTO audit_logs')) {
    // Parse literal vs param values from the query
    const parsed = parseLiteralValues(query, values);
    const [module, action, user_name, description, ip_address] = parsed;
    const newId = db.audit_logs.reduce((max, l) => Math.max(max, l.id), 0) + 1;
    const newLog = {
      id: newId,
      module: module || 'Sistem',
      action: action || 'INFO',
      user_name: user_name || 'Admin',
      description: description || '',
      ip_address: ip_address || '127.0.0.1',
      created_at: new Date().toISOString()
    };
    db.audit_logs.push(newLog);
    saveDB(db);
    return [newLog];
  }

  // Generic fallback
  return [];
}

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
