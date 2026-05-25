"use strict";(()=>{var t={};t.id=6553,t.ids=[6553],t.modules={30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:t=>{t.exports=require("node:fs")},49411:t=>{t.exports=require("node:path")},56299:(t,a,e)=>{e.r(a),e.d(a,{headerHooks:()=>c,originalPathname:()=>p,requestAsyncStorage:()=>n,routeModule:()=>l,serverHooks:()=>E,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>d});var s={};e.r(s),e.d(s,{GET:()=>GET}),e(78976);var o=e(10884),i=e(16132),r=e(10117);async function GET(){try{let[t,a,e,s,o,i]=await r.Z.transaction([r.Z`SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'warning') as warning,
        COUNT(*) FILTER (WHERE status = 'inactive') as inactive
      FROM traders`,r.Z`SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'occupied') as occupied,
        COUNT(*) FILTER (WHERE status = 'vacant') as vacant,
        COUNT(*) FILTER (WHERE zone = 'gold') as gold_count,
        COUNT(*) FILTER (WHERE zone = 'silver') as silver_count,
        COUNT(*) FILTER (WHERE zone = 'bronze') as bronze_count
      FROM stalls`,r.Z`SELECT
        COUNT(*) as total_bills,
        COUNT(*) FILTER (WHERE status = 'paid') as paid_count,
        COUNT(*) FILTER (WHERE status = 'unpaid') as unpaid_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as total_collected,
        COALESCE(SUM(amount), 0) as total_billed
      FROM bills
      WHERE bill_month = TO_CHAR(CURRENT_DATE, 'YYYY-MM')`,r.Z`SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'available') as available,
        COUNT(*) FILTER (WHERE status = 'active') as on_duty,
        ROUND(AVG(rating)::numeric, 2) as avg_rating
      FROM porters`,r.Z`SELECT
        bill_month,
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as collected,
        COALESCE(SUM(amount), 0) as billed
      FROM bills
      GROUP BY bill_month
      ORDER BY bill_month DESC
      LIMIT 6`,r.Z`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 8`]),l=t[0],n=a[0],u=e[0],E=s[0],c=n.total>0?Math.round(Number(n.occupied)/Number(n.total)*100):0,d=u.total_bills>0?Math.round(Number(u.paid_count)/Number(u.total_bills)*100):0,p=await r.Z`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'expired') as expired,
        COUNT(*) FILTER (WHERE status = 'active' AND expiry_date <= CURRENT_DATE + INTERVAL '30 days') as expiring_soon
      FROM permits
    `;return Response.json({traders:{total:Number(l.total),active:Number(l.active),warning:Number(l.warning),inactive:Number(l.inactive)},stalls:{total:Number(n.total),occupied:Number(n.occupied),vacant:Number(n.vacant),occupancyRate:c,gold:Number(n.gold_count),silver:Number(n.silver_count),bronze:Number(n.bronze_count)},billing:{totalBills:Number(u.total_bills),paid:Number(u.paid_count),unpaid:Number(u.unpaid_count),totalCollected:Number(u.total_collected),totalBilled:Number(u.total_billed),complianceRate:d},porters:{total:Number(E.total),available:Number(E.available),onDuty:Number(E.on_duty),avgRating:Number(E.avg_rating||5)},permits:{total:Number(p[0].total),active:Number(p[0].active),expired:Number(p[0].expired),expiringSoon:Number(p[0].expiring_soon)},revenue:o.map(t=>({month:t.bill_month,collected:Number(t.collected),billed:Number(t.billed)})),recentActivity:i})}catch(t){return console.error(t),Response.json({error:"Failed to fetch stats"},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/stats/route",pathname:"/api/admin/stats",filename:"route",bundlePath:"app/api/admin/stats/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\admin\\stats\\route.js",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:n,staticGenerationAsyncStorage:u,serverHooks:E,headerHooks:c,staticGenerationBailout:d}=l,p="/api/admin/stats/route"}};var a=require("../../../../webpack-runtime.js");a.C(t);var __webpack_exec__=t=>a(a.s=t),e=a.X(0,[9364,117],()=>__webpack_exec__(56299));module.exports=e})();