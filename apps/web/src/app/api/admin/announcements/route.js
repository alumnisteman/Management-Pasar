import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const rows = await sql`SELECT * FROM announcements ORDER BY created_at DESC`;
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, body, urgency, target_zone, start_date, end_date } = await request.json();

    if (!title || !body || !urgency || !start_date) {
      return Response.json({ error: "Judul, isi, urgensi, dan tanggal mulai wajib diisi" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO announcements (title, body, urgency, target_zone, start_date, end_date)
      VALUES (${title}, ${body}, ${urgency}, ${target_zone || 'all'}, ${start_date}, ${end_date || null})
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pengumuman', 'CREATE', ${`Pengumuman baru: ${title}`})
    `;

    return Response.json({ success: true, announcement: result[0] });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal membuat pengumuman" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const bodyObj = await request.json();
    const { id, title, body, urgency, target_zone, start_date, end_date } = bodyObj;

    if (!id) {
      return Response.json({ error: "ID pengumuman tidak valid" }, { status: 400 });
    }

    // Check if it's a simple status update (archive/restore)
    if (Object.keys(bodyObj).length === 2 && 'end_date' in bodyObj) {
      const result = await sql`UPDATE announcements SET end_date = ${end_date} WHERE id = ${id}`;
      return Response.json({ success: true, announcement: result[0] });
    }

    // Full update
    const result = await sql`
      UPDATE announcements SET
        title = ${title},
        body = ${body},
        urgency = ${urgency},
        target_zone = ${target_zone},
        start_date = ${start_date},
        end_date = ${end_date}
      WHERE id = ${id}
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pengumuman', 'UPDATE', ${`Pengumuman diupdate: ${title}`})
    `;

    return Response.json({ success: true, announcement: result[0] });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal mengupdate pengumuman" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ error: "ID pengumuman tidak valid" }, { status: 400 });
    }

    await sql`DELETE FROM announcements WHERE id = ${id}`;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pengumuman', 'DELETE', ${`Pengumuman ID ${id} dihapus`})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal menghapus pengumuman" }, { status: 500 });
  }
}
