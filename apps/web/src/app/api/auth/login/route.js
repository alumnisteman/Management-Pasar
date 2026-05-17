import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}`;
    const user = users[0];

    if (!user || user.password !== password) {
      return Response.json({ error: "Email atau password salah" }, { status: 401 });
    }

    await sql`
      INSERT INTO audit_logs (module, action, user_name, description)
      VALUES (${"Sistem"}, ${"LOGIN"}, ${user.name}, ${"User login: " + user.email})
    `;

    return Response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return Response.json({ error: "Login gagal" }, { status: 500 });
  }
}
