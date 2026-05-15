import sql from "@/app/api/utils/sql";

// Incentive tier calculation logic
function calculateTier(jobsCompleted, avgRating, daysHitTarget) {
  const score =
    (jobsCompleted >= 50
      ? 3
      : jobsCompleted >= 30
        ? 2
        : jobsCompleted >= 15
          ? 1
          : 0) +
    (avgRating >= 4.8 ? 3 : avgRating >= 4.5 ? 2 : avgRating >= 4.0 ? 1 : 0) +
    (daysHitTarget >= 6
      ? 3
      : daysHitTarget >= 4
        ? 2
        : daysHitTarget >= 2
          ? 1
          : 0);

  if (score >= 8) return { tier: "platinum", bonus: 150000, label: "Platinum" };
  if (score >= 6) return { tier: "gold", bonus: 100000, label: "Gold" };
  if (score >= 4) return { tier: "silver", bonus: 60000, label: "Silver" };
  if (score >= 2) return { tier: "bronze", bonus: 30000, label: "Bronze" };
  return { tier: "none", bonus: 0, label: "Belum Memenuhi" };
}

// GET: fetch incentives for a porter or all incentives
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const porterId = searchParams.get("porterId");
    const recalculate = searchParams.get("recalculate");

    if (recalculate === "true" && porterId) {
      // Calculate weekly stats for this porter
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekStartStr = weekStart.toISOString().split("T")[0];
      const weekEndStr = weekEnd.toISOString().split("T")[0];

      const stats = await sql`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'completed') as jobs_completed,
          ROUND(AVG(rating) FILTER (WHERE rating IS NOT NULL)::numeric, 2) as avg_rating,
          COALESCE(SUM(fee) FILTER (WHERE status = 'completed'), 0) as total_earnings
        FROM porter_jobs
        WHERE porter_id = ${porterId}
          AND created_at >= ${weekStartStr}::date
          AND created_at <= (${weekEndStr}::date + INTERVAL '1 day')
      `;

      const porterInfo =
        await sql`SELECT daily_target FROM porters WHERE id = ${porterId}`;
      const dailyTarget = porterInfo[0]?.daily_target || 100000;

      // Count days where porter hit their daily target
      const dailyEarnings = await sql`
        SELECT DATE(created_at) as day, SUM(fee) as day_total
        FROM porter_jobs
        WHERE porter_id = ${porterId}
          AND status = 'completed'
          AND created_at >= ${weekStartStr}::date
          AND created_at <= (${weekEndStr}::date + INTERVAL '1 day')
        GROUP BY DATE(created_at)
      `;

      const daysHitTarget = dailyEarnings.filter(
        (d) => Number(d.day_total) >= dailyTarget,
      ).length;

      const jobsCompleted = Number(stats[0]?.jobs_completed || 0);
      const avgRating = Number(stats[0]?.avg_rating || 0);
      const totalEarnings = Number(stats[0]?.total_earnings || 0);

      const { tier, bonus, label } = calculateTier(
        jobsCompleted,
        avgRating,
        daysHitTarget,
      );

      return Response.json({
        porterId: Number(porterId),
        weekStart: weekStartStr,
        weekEnd: weekEndStr,
        jobsCompleted,
        avgRating,
        totalEarnings,
        daysHitTarget,
        tier,
        bonus,
        tierLabel: label,
        // Progress to next tier info
        progress: {
          jobs: jobsCompleted,
          jobsNextTier:
            jobsCompleted < 15
              ? 15
              : jobsCompleted < 30
                ? 30
                : jobsCompleted < 50
                  ? 50
                  : 50,
          rating: avgRating,
          ratingNextTier:
            avgRating < 4.0
              ? 4.0
              : avgRating < 4.5
                ? 4.5
                : avgRating < 4.8
                  ? 4.8
                  : 4.8,
          daysHit: daysHitTarget,
          daysNextTier:
            daysHitTarget < 2
              ? 2
              : daysHitTarget < 4
                ? 4
                : daysHitTarget < 6
                  ? 6
                  : 6,
        },
      });
    }

    // Fetch saved incentive history
    if (porterId) {
      const rows = await sql`
        SELECT pi.*, p.name as porter_name
        FROM porter_incentives pi
        JOIN porters p ON pi.porter_id = p.id
        WHERE pi.porter_id = ${porterId}
        ORDER BY pi.week_start DESC
        LIMIT 12
      `;
      return Response.json(rows);
    }

    // All porters incentive overview (current week)
    const allRows = await sql`
      SELECT pi.*, p.name as porter_name
      FROM porter_incentives pi
      JOIN porters p ON pi.porter_id = p.id
      ORDER BY pi.week_start DESC, pi.bonus_amount DESC
    `;
    return Response.json(allRows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch incentives" },
      { status: 500 },
    );
  }
}

// POST: save / lock in a weekly incentive record
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      porter_id,
      week_start,
      week_end,
      jobs_completed,
      avg_rating,
      total_earnings,
      days_hit_target,
      tier,
      bonus_amount,
    } = body;

    const existing = await sql`
      SELECT id FROM porter_incentives WHERE porter_id = ${porter_id} AND week_start = ${week_start}
    `;

    if (existing.length > 0) {
      const updated = await sql`
        UPDATE porter_incentives
        SET jobs_completed = ${jobs_completed}, avg_rating = ${avg_rating},
            total_earnings = ${total_earnings}, days_hit_target = ${days_hit_target},
            tier = ${tier}, bonus_amount = ${bonus_amount}, status = 'approved'
        WHERE porter_id = ${porter_id} AND week_start = ${week_start}
        RETURNING *
      `;
      return Response.json(updated[0]);
    }

    const newRecord = await sql`
      INSERT INTO porter_incentives (porter_id, week_start, week_end, jobs_completed, avg_rating, total_earnings, days_hit_target, tier, bonus_amount, status)
      VALUES (${porter_id}, ${week_start}, ${week_end}, ${jobs_completed}, ${avg_rating}, ${total_earnings}, ${days_hit_target}, ${tier}, ${bonus_amount}, 'approved')
      RETURNING *
    `;
    return Response.json(newRecord[0]);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to save incentive" },
      { status: 500 },
    );
  }
}

// PATCH: mark incentive as paid
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id } = body;

    const updated = await sql`
      UPDATE porter_incentives
      SET status = 'paid', paid_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return Response.json(updated[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to mark as paid" }, { status: 500 });
  }
}
