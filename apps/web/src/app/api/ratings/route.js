import sql from "@/app/api/utils/sql";

// GET: fetch ratings for a porter
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const porterId = searchParams.get("porterId");
    const jobId = searchParams.get("jobId");

    if (jobId) {
      const rows = await sql`
        SELECT pj.id, pj.rating, pj.feedback, pj.rated_at, pj.customer_name, pj.location_to, pj.fee, pj.completed_at
        FROM porter_jobs pj
        WHERE pj.id = ${jobId}
      `;
      return Response.json(rows[0] || null);
    }

    if (porterId) {
      const rows = await sql`
        SELECT pj.id, pj.rating, pj.feedback, pj.rated_at, pj.customer_name, pj.location_to, pj.fee, pj.completed_at
        FROM porter_jobs pj
        WHERE pj.porter_id = ${porterId} AND pj.rating IS NOT NULL
        ORDER BY pj.rated_at DESC
        LIMIT 20
      `;
      return Response.json(rows);
    }

    return Response.json(
      { error: "porterId or jobId required" },
      { status: 400 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch ratings" }, { status: 500 });
  }
}

// POST: submit a rating for a completed job
export async function POST(request) {
  try {
    const body = await request.json();
    const { job_id, rating, feedback } = body;

    if (!job_id || !rating || rating < 1 || rating > 5) {
      return Response.json(
        { error: "job_id and rating (1-5) required" },
        { status: 400 },
      );
    }

    // Update job with rating
    const updatedJob = await sql`
      UPDATE porter_jobs
      SET rating = ${rating}, feedback = ${feedback || null}, rated_at = NOW()
      WHERE id = ${job_id} AND status = 'completed'
      RETURNING *
    `;

    if (!updatedJob[0]) {
      return Response.json(
        { error: "Job not found or not completed" },
        { status: 404 },
      );
    }

    // Recalculate porter avg rating
    const porterId = updatedJob[0].porter_id;
    const avgResult = await sql`
      SELECT ROUND(AVG(rating)::numeric, 2) as avg_rating
      FROM porter_jobs
      WHERE porter_id = ${porterId} AND rating IS NOT NULL
    `;
    const newAvg = avgResult[0]?.avg_rating || 5.0;

    await sql`UPDATE porters SET rating = ${newAvg} WHERE id = ${porterId}`;

    return Response.json({
      success: true,
      job: updatedJob[0],
      new_avg_rating: newAvg,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
