"use strict";(()=>{var e={};e.id=2836,e.ids=[2836],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:e=>{e.exports=require("node:fs")},49411:e=>{e.exports=require("node:path")},69226:(e,t,a)=>{a.r(t),a.d(t,{headerHooks:()=>p,originalPathname:()=>E,requestAsyncStorage:()=>l,routeModule:()=>o,serverHooks:()=>u,staticGenerationAsyncStorage:()=>d,staticGenerationBailout:()=>c});var s={};a.r(s),a.d(s,{GET:()=>GET,PATCH:()=>PATCH,POST:()=>POST}),a(78976);var i=a(10884),r=a(16132),n=a(10117);async function GET(e){try{let{searchParams:t}=new URL(e.url),a=t.get("month")||"",s=t.get("status")||"",i=`
      SELECT b.*, t.name as trader_name, t.phone, s.stall_code, s.zone
      FROM bills b
      JOIN traders t ON b.trader_id = t.id
      LEFT JOIN stalls s ON b.stall_id = s.id
      WHERE 1=1
    `,r=[],o=1;a&&(i+=` AND b.bill_month = $${o}`,r.push(a),o++),s&&(i+=` AND b.status = $${o}`,r.push(s),o++),i+=" ORDER BY b.created_at DESC";let l=await (0,n.Z)(i,r);return Response.json(l)}catch(e){return console.error(e),Response.json({error:"Failed to fetch bills"},{status:500})}}async function POST(e){try{let t=await e.json(),{bill_month:a}=t,s=await n.Z`
      SELECT t.id, t.stall_id, s.monthly_fee
      FROM traders t
      JOIN stalls s ON t.stall_id = s.id
      WHERE t.status = 'active'
        AND NOT EXISTS (
          SELECT 1 FROM bills b WHERE b.trader_id = t.id AND b.bill_month = ${a}
        )
    `,i=0;for(let e of s)await n.Z`
        INSERT INTO bills (trader_id, stall_id, bill_month, amount, status)
        VALUES (${e.id}, ${e.stall_id}, ${a}, ${e.monthly_fee}, 'unpaid')
      `,i++;return await n.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Billing', 'GENERATE', ${`Tagihan ${a} dibuat untuk ${i} pedagang`})
    `,Response.json({created:i,month:a})}catch(e){return console.error(e),Response.json({error:"Failed to generate bills"},{status:500})}}async function PATCH(e){try{let t=await e.json(),{id:a,trader_name:s}=t,i=await n.Z`
      UPDATE bills SET status = 'paid', paid_at = NOW()
      WHERE id = ${a}
      RETURNING *
    `;return await n.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Billing', 'PAYMENT', ${`Tagihan lunas - ${s||"Pedagang"}`})
    `,Response.json(i[0])}catch(e){return console.error(e),Response.json({error:"Failed to mark bill as paid"},{status:500})}}let o=new i.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/admin/bills/route",pathname:"/api/admin/bills",filename:"route",bundlePath:"app/api/admin/bills/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\admin\\bills\\route.js",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:l,staticGenerationAsyncStorage:d,serverHooks:u,headerHooks:p,staticGenerationBailout:c}=o,E="/api/admin/bills/route"}};var t=require("../../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),a=t.X(0,[9364,117],()=>__webpack_exec__(69226));module.exports=a})();