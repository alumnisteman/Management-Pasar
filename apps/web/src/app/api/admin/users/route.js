import sql from '../../utils/sql';

// Get all users
export async function GET(req) {
  try {
    const users = await sql('SELECT * FROM users');
    // Sanitize passwords before sending to frontend
    const sanitized = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    return Response.json(sanitized);
  } catch (error) {
    console.error('Fetch users error:', error);
    return Response.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// Add new user
export async function POST(req) {
  try {
    const { username, name, password, role } = await req.json();

    if (!username || !name || !password || !role) {
      return Response.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    // Check if username exists
    const existing = await sql('SELECT * FROM users WHERE username = $1', [username]);
    if (existing.length > 0) {
      return Response.json({ error: 'Username sudah digunakan' }, { status: 400 });
    }

    const result = await sql(
      'INSERT INTO users (username, name, password, role) VALUES ($1, $2, $3, $4)',
      [username, name, password, role]
    );

    await sql(
      'INSERT INTO audit_logs (module, action, user_name, description, ip_address) VALUES ($1, $2, $3, $4, $5)',
      ['Manajemen Akun', 'CREATE', 'Admin', `Akun baru terdaftar: ${name} (${role})`, '127.0.0.1']
    );

    const { password: _, ...newUser } = result[0];
    return Response.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Create user error:', error);
    return Response.json({ error: 'Gagal membuat user' }, { status: 500 });
  }
}

// Update user
export async function PATCH(req) {
  try {
    const { id, name, role, status, password } = await req.json();

    if (!id) {
      return Response.json({ error: 'ID wajib diisi' }, { status: 400 });
    }

    // Construct update query manually since our mock sql.js expects specific formats
    // We will pass values in this exact order: name, role, status, password, id
    // and rely on our sql parser fallback logic to catch them by their parameter values
    
    // In our sql.js we wrote:
    // if (query.includes('name = $')) user.name = values[0];
    // if (query.includes('role = $')) user.role = values[1];
    // if (query.includes('status = $')) user.status = values[2];
    // if (query.includes('password = $')) user.password = values[3];
    // id = values[4] or values[length-1]

    let finalPassword = password;
    if (!password) {
      const allUsers = await sql('SELECT * FROM users');
      const existingUser = allUsers.find(u => u.id === Number(id));
      if (existingUser) {
        finalPassword = existingUser.password;
      }
    }

    const vals = [name, role, status, finalPassword, id];
    
    // Create dummy string to satisfy our parser
    const dummyQuery = 'UPDATE users SET name = $1, role = $2, status = $3, password = $4 WHERE id = $5';
    
    const result = await sql(dummyQuery, vals);

    if (result.length === 0) {
      return Response.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    await sql(
      'INSERT INTO audit_logs (module, action, user_name, description, ip_address) VALUES ($1, $2, $3, $4, $5)',
      ['Manajemen Akun', 'UPDATE', 'Admin', `Akun diupdate: ${name || id}`, '127.0.0.1']
    );

    return Response.json({ success: true, user: result[0] });
  } catch (error) {
    console.error('Update user error:', error);
    return Response.json({ error: 'Gagal mengupdate user' }, { status: 500 });
  }
}
