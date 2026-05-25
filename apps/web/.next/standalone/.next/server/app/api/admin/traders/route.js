"use strict";(()=>{var e={};e.id=8831,e.ids=[8831],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:e=>{e.exports=require("node:fs")},49411:e=>{e.exports=require("node:path")},15090:(e,t,a)=>{a.r(t),a.d(t,{headerHooks:()=>p,originalPathname:()=>c,requestAsyncStorage:()=>d,routeModule:()=>o,serverHooks:()=>E,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>l});var r={};a.r(r),a.d(r,{DELETE:()=>DELETE,GET:()=>GET,PATCH:()=>PATCH,POST:()=>POST}),a(78976);var s=a(10884),n=a(16132),i=a(10117);async function GET(e){try{let{searchParams:t}=new URL(e.url),a=t.get("search")||"",r=t.get("status")||"",s=`
      SELECT t.*, s.stall_code, s.zone, s.category,
             p.permit_number, p.status as permit_status, p.expiry_date
      FROM traders t
      LEFT JOIN stalls s ON t.stall_id = s.id
      LEFT JOIN permits p ON p.trader_id = t.id
      WHERE 1=1
    `,n=[],o=1;a&&(s+=` AND (LOWER(t.name) LIKE LOWER($${o}) OR t.nik LIKE $${o+1} OR t.phone LIKE $${o+2})`,n.push(`%${a}%`,`%${a}%`,`%${a}%`),o+=3),r&&(s+=` AND t.status = $${o}`,n.push(r),o++),s+=" ORDER BY t.joined_at DESC";let d=await (0,i.Z)(s,n);return Response.json(d)}catch(e){return console.error(e),Response.json({error:"Failed to fetch traders"},{status:500})}}async function POST(e){try{let t=await e.json(),{name:a,nik:r,phone:s,trader_type:n,stall_id:o}=t,d=await i.Z`
      INSERT INTO traders (name, nik, phone, trader_type, stall_id)
      VALUES (${a}, ${r}, ${s}, ${n||"tetap"}, ${o||null})
      RETURNING *
    `;o&&await i.Z`UPDATE stalls SET status = 'occupied', trader_id = ${d[0].id} WHERE id = ${o}`;let u=`SIPTU-${new Date().getFullYear()}-${String(d[0].id).padStart(4,"0")}`,E=new Date().toISOString().split("T")[0],p=new Date(new Date().setFullYear(new Date().getFullYear()+1)).toISOString().split("T")[0];return await i.Z`
      INSERT INTO permits (trader_id, permit_number, issue_date, expiry_date, status, qr_token)
      VALUES (${d[0].id}, ${u}, ${E}, ${p}, 'active', ${Math.random().toString(36).slice(2)})
      ON CONFLICT (permit_number) DO NOTHING
    `,await i.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pedagang', 'CREATE', ${`Pedagang baru terdaftar: ${a}`})
    `,Response.json(d[0])}catch(e){return console.error(e),Response.json({error:"Failed to create trader"},{status:500})}}async function PATCH(e){try{let t=await e.json(),{id:a,status:r,name:s,phone:n,stall_id:o}=t,d=await i.Z`
      UPDATE traders SET
        status = COALESCE(${r}, status),
        name = COALESCE(${s}, name),
        phone = COALESCE(${n}, phone),
        stall_id = COALESCE(${o}, stall_id)
      WHERE id = ${a}
      RETURNING *
    `;return await i.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pedagang', 'UPDATE', ${`Data pedagang #${a} diperbarui`})
    `,Response.json(d[0])}catch(e){return console.error(e),Response.json({error:"Failed to update trader"},{status:500})}}async function DELETE(e){try{let{searchParams:t}=new URL(e.url),a=t.get("id"),r=await i.Z`SELECT name FROM traders WHERE id = ${a}`;return await i.Z`UPDATE stalls SET status = 'vacant', trader_id = NULL WHERE trader_id = ${a}`,await i.Z`UPDATE traders SET status = 'inactive' WHERE id = ${a}`,await i.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pedagang', 'DELETE', ${`Pedagang ${r[0]?.name} dinonaktifkan`})
    `,Response.json({success:!0})}catch(e){return console.error(e),Response.json({error:"Failed to delete trader"},{status:500})}}let o=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/traders/route",pathname:"/api/admin/traders",filename:"route",bundlePath:"app/api/admin/traders/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\admin\\traders\\route.js",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:d,staticGenerationAsyncStorage:u,serverHooks:E,headerHooks:p,staticGenerationBailout:l}=o,c="/api/admin/traders/route"}};var t=require("../../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),a=t.X(0,[9364,117],()=>__webpack_exec__(15090));module.exports=a})();