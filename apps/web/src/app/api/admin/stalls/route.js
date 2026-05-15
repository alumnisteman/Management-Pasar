import sql from "@/app/api/utils/sql";

// Dynamic pricing rules per zone
const DYNAMIC_PRICING = {
  gold: { base: 750000, max: 1200000, min: 600000, multiplier: 0.15 },
  silver: { base: 500000, max: 850000, min: 400000, multiplier: 0.12 },
  bronze: { base: 350000, max: 600000, min: 280000, multiplier: 0.1 },
};

function calcDynamicPrice(zone, occupancyRate) {
  const rule = DYNAMIC_PRICING[zone] || DYNAMIC_PRICING.silver;
  const price =
    Math.round(
      (rule.base * (1 + (occupancyRate / 100) * rule.multiplier)) / 10000,
    ) * 10000;
  return Math.min(Math.max(price, rule.min), rule.max);
}

export async function GET() {
  try {
    const rows = await sql`
      SELECT s.*, t.name as trader_name, t.phone as trader_phone
      FROM stalls s
      LEFT JOIN traders t ON s.trader_id = t.id
      ORDER BY s.row_x ASC, s.col_y ASC
    `;

    // Compute occupancy per zone for dynamic pricing suggestions
    const zoneStats = {};
    rows.forEach((s) => {
      if (!zoneStats[s.zone]) zoneStats[s.zone] = { total: 0, occupied: 0 };
      zoneStats[s.zone].total++;
      if (s.status === "occupied") zoneStats[s.zone].occupied++;
    });

    const result = rows.map((s) => {
      const zs = zoneStats[s.zone] || { total: 1, occupied: 0 };
      const occupancyRate = Math.round((zs.occupied / zs.total) * 100);
      return {
        ...s,
        suggested_price: calcDynamicPrice(s.zone, occupancyRate),
        zone_occupancy: occupancyRate,
      };
    });

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch stalls" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const {
      id,
      status,
      trader_id,
      zone,
      category,
      monthly_fee,
      apply_dynamic_pricing,
    } = body;

    // Apply dynamic pricing to an entire zone
    if (apply_dynamic_pricing && zone) {
      const stats = await sql`
        SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'occupied') as occupied
        FROM stalls WHERE zone = ${zone}
      `;
      const occupancyRate =
        Number(stats[0].total) > 0
          ? Math.round(
              (Number(stats[0].occupied) / Number(stats[0].total)) * 100,
            )
          : 0;
      const newPrice = calcDynamicPrice(zone, occupancyRate);

      const updated = await sql`
        UPDATE stalls SET monthly_fee = ${newPrice} WHERE zone = ${zone} RETURNING *
      `;

      await sql`
        INSERT INTO audit_logs (module, action, description)
        VALUES ('Grid', 'DYNAMIC_PRICE', ${`Dynamic pricing diterapkan ke zone ${zone}: Rp ${newPrice.toLocaleString("id-ID")} (hunian ${occupancyRate}%)`})
      `;

      return Response.json({
        updated: updated.length,
        new_price: newPrice,
        zone,
        occupancy_rate: occupancyRate,
      });
    }

    // Single stall update
    const updated = await sql`
      UPDATE stalls SET
        status = COALESCE(${status ?? null}, status),
        trader_id = ${trader_id !== undefined ? trader_id || null : sql`trader_id`},
        zone = COALESCE(${zone ?? null}, zone),
        category = COALESCE(${category ?? null}, category),
        monthly_fee = COALESCE(${monthly_fee ?? null}, monthly_fee)
      WHERE id = ${id}
      RETURNING *
    `;

    await sql`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Grid', 'UPDATE', ${`Lapak #${updated[0]?.stall_code} diperbarui`})
    `;

    return Response.json(updated[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update stall" }, { status: 500 });
  }
}
