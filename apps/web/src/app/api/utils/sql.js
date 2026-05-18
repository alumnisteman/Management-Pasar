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
  porter_requests: []
};

// Read database helper
function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading local DB file:', err);
  }
  // Initialize file if not exist
  saveDB(DEFAULT_DB);
  return DEFAULT_DB;
}

// Write database helper
function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to local DB file:', err);
  }
}

// Custom SQL query parser and executor
export async function executeSQL(queryStr, values = []) {
  if (typeof queryStr !== 'string') {
    return queryStr;
  }
  const db = loadDB();
  const query = queryStr.trim().replace(/\s+/g, ' ');

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

  if (query.includes('UPDATE stalls SET') && query.includes('WHERE id =')) {
    const id = values[4];
    const stall = db.stalls.find(s => s.id === id);
    if (stall) {
      if (values[0] !== undefined && values[0] !== null) stall.status = values[0];
      if (values[1] !== undefined) stall.trader_id = values[1] || null;
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
  if (query.includes('FROM porters')) {
    if (query.includes('WHERE p.id =') || query.includes('WHERE id =')) {
      const idVal = values[0];
      const p = db.porters.find(p => p.id === Number(idVal)) || db.porters[0] || null;
      if (p) {
        return [{
          ...p,
          daily_earnings: 25000
        }];
      }
      return [];
    }
    return db.porters;
  }

  if (query.includes('FROM porter_incentives') && query.includes('SELECT pi.*')) {
    return db.porter_incentives.map(pi => {
      const porter = db.porters.find(p => p.id === pi.porter_id) || {};
      return {
        ...pi,
        porter_name: porter.name || null
      };
    });
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