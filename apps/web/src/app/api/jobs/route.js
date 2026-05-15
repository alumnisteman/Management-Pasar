import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const porterId = searchParams.get("porterId");

    if (porterId) {
      const jobs = await sql`
        SELECT * FROM porter_jobs 
        WHERE porter_id = ${porterId} 
        ORDER BY created_at DESC
      `;
      return Response.json(jobs);
    }

    const allJobs =
      await sql`SELECT * FROM porter_jobs ORDER BY created_at DESC`;
    return Response.json(allJobs);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      porter_id,
      customer_name,
      location_from,
      location_to,
      weight_category,
      fee,
    } = body;

    const newJob = await sql`
      INSERT INTO porter_jobs (porter_id, customer_name, location_from, location_to, weight_category, fee, status)
      VALUES (${porter_id}, ${customer_name}, ${location_from}, ${location_to}, ${weight_category}, ${fee}, 'pending')
      RETURNING *
    `;

    // Also update porter status to active if a porter is assigned immediately
    if (porter_id) {
      await sql`UPDATE porters SET status = 'active' WHERE id = ${porter_id}`;
    }

    return Response.json(newJob[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create job" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const updatedJob = await sql`
      UPDATE porter_jobs 
      SET status = ${status}, 
          completed_at = ${status === "completed" ? "NOW()" : null}
      WHERE id = ${id} 
      RETURNING *
    `;

    // If job is completed or cancelled, make porter available again
    if (status === "completed" || status === "cancelled") {
      const job = updatedJob[0];
      await sql`UPDATE porters SET status = 'available' WHERE id = ${job.porter_id}`;
    }

    return Response.json(updatedJob[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update job" }, { status: 500 });
  }
}
