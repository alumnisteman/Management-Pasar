import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const rows = await sql`SELECT id, name, email, role, created_at FROM users ORDER BY id ASC`;
    return Response.json(rows);
  } catch (error) {
    console.error("[GET /api/admin/users]", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password || !role) {
      return Response.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }
    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`;
    if (existing.length > 0) {
      return Response.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }
    const created = await sql`
      INSERT INTO users (name, email, password, role) VALUES (${name}, ${email.toLowerCase().trim()}, ${password}, ${role})
    `;
    await sql`
      INSERT INTO audit_logs (module, action, user_name, description)
      VALUES (${"Sistem"}, ${"CREATE"}, ${"Admin"}, ${"Pengguna baru dibuat: " + email + " (" + role + ")"})
    `;
    return Response.json(created[0] || { name, email, role });
  } catch (error) {
    console.error("[POST /api/admin/users]", error);
    return Response.json({ error: "Gagal membuat pengguna" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, password, name } = await request.json();
    if (!id) {
      return Response.json({ error: "id required" }, { status: 400 });
    }
    if (password !== undefined) {
      if (!password || password.length < 6) {
        return Response.json({ error: "Password minimal 6 karakter" }, { status: 400 });
      }
      await sql`UPDATE users SET password = ${password} WHERE id = ${id}`;
      await sql`
        INSERT INTO audit_logs (module, action, user_name, description)
        VALUES (${"Sistem"}, ${"UPDATE"}, ${"Admin"}, ${"Password pengguna #" + id + " diubah"})
      `;
    }
    if (name !== undefined) {
      await sql`UPDATE users SET name = ${name} WHERE id = ${id}`;
    }
    const updated = await sql`SELECT id, name, email, role FROM users WHERE id = ${id}`;
    return Response.json(updated[0] || { id });
  } catch (error) {
    console.error("[PATCH /api/admin/users]", error);
    return Response.json({ error: "Gagal memperbarui pengguna" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    const users = await sql`SELECT * FROM users WHERE id = ${id}`;
    const user = users[0];
    if (!user) return Response.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    if (user.role === "admin") {
      const adminCount = await sql`SELECT COUNT(*) as c FROM users WHERE role = 'admin'`;
      if (Number(adminCount[0]?.c) <= 1) {
        return Response.json({ error: "Tidak dapat menghapus satu-satunya akun Admin" }, { status: 400 });
      }
    }
    await sql`DELETE FROM users WHERE id = ${id}`;
    await sql`
      INSERT INTO audit_logs (module, action, user_name, description)
      VALUES (${"Sistem"}, ${"DELETE"}, ${"Admin"}, ${"Pengguna dihapus: " + user.email})
    `;
    return Response.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/users]", error);
    return Response.json({ error: "Gagal menghapus pengguna" }, { status: 500 });
  }
}
