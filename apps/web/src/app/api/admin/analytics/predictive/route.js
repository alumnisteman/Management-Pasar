export async function GET() {
  return Response.json({
    success: true,
    data: {
      forecast: [
        { date: "2026-05-23", predicted_traffic: 1350 },
        { date: "2026-05-24", predicted_traffic: 1420 },
        { date: "2026-05-25", predicted_traffic: 1200 }
      ],
      risk_zones: [
        { zone: "silver", risk: "high", reason: "Potential crowd bottleneck at gate 2" }
      ]
    }
  });
}
