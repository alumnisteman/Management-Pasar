import sql from '../../utils/sql';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return Response.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    const users = await sql('SELECT * FROM users WHERE username = $1', [username]);
    const user = users[0];

    if (!user) {
      return Response.json({ error: 'Username tidak ditemukan atau nonaktif' }, { status: 401 });
    }

    // In a real application, you MUST hash the password (e.g. bcrypt).
    // This is just a mock for demonstration.
    if (user.password !== password) {
      return Response.json({ error: 'Password salah' }, { status: 401 });
    }

    // Generate a mock token
    const token = `svms_token_${user.id}_${Date.now()}`;

    // Audit log
    await sql(
      'INSERT INTO audit_logs (module, action, user_name, description, ip_address) VALUES ($1, $2, $3, $4, $5)',
      ['Sistem', 'LOGIN', user.name, `${user.name} masuk ke sistem`, '127.0.0.1']
    );

    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
