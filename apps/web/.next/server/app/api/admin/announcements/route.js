"use strict";(()=>{var e={};e.id=1510,e.ids=[1510],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:e=>{e.exports=require("node:fs")},49411:e=>{e.exports=require("node:path")},26336:(e,n,a)=>{a.r(n),a.d(n,{headerHooks:()=>m,originalPathname:()=>l,requestAsyncStorage:()=>i,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>c,staticGenerationBailout:()=>p});var t={};a.r(t),a.d(t,{DELETE:()=>DELETE,GET:()=>GET,PATCH:()=>PATCH,POST:()=>POST}),a(78976);var s=a(10884),r=a(16132),o=a(10117);async function GET(e){try{let e=await o.Z`SELECT * FROM announcements ORDER BY created_at DESC`;return Response.json(e)}catch(e){return console.error(e),Response.json({error:"Failed to fetch announcements"},{status:500})}}async function POST(e){try{let{title:n,body:a,urgency:t,target_zone:s,start_date:r,end_date:u}=await e.json();if(!n||!a||!t||!r)return Response.json({error:"Judul, isi, urgensi, dan tanggal mulai wajib diisi"},{status:400});let i=await o.Z`
      INSERT INTO announcements (title, body, urgency, target_zone, start_date, end_date)
      VALUES (${n}, ${a}, ${t}, ${s||"all"}, ${r}, ${u||null})
    `;return await o.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pengumuman', 'CREATE', ${`Pengumuman baru: ${n}`})
    `,Response.json({success:!0,announcement:i[0]})}catch(e){return console.error(e),Response.json({error:"Gagal membuat pengumuman"},{status:500})}}async function PATCH(e){try{let n=await e.json(),{id:a,title:t,body:s,urgency:r,target_zone:u,start_date:i,end_date:c}=n;if(!a)return Response.json({error:"ID pengumuman tidak valid"},{status:400});if(2===Object.keys(n).length&&"end_date"in n){let e=await o.Z`UPDATE announcements SET end_date = ${c} WHERE id = ${a}`;return Response.json({success:!0,announcement:e[0]})}let d=await o.Z`
      UPDATE announcements SET
        title = ${t},
        body = ${s},
        urgency = ${r},
        target_zone = ${u},
        start_date = ${i},
        end_date = ${c}
      WHERE id = ${a}
    `;return await o.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pengumuman', 'UPDATE', ${`Pengumuman diupdate: ${t}`})
    `,Response.json({success:!0,announcement:d[0]})}catch(e){return console.error(e),Response.json({error:"Gagal mengupdate pengumuman"},{status:500})}}async function DELETE(e){try{let n=new URL(e.url),a=n.searchParams.get("id");if(!a)return Response.json({error:"ID pengumuman tidak valid"},{status:400});return await o.Z`DELETE FROM announcements WHERE id = ${a}`,await o.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Pengumuman', 'DELETE', ${`Pengumuman ID ${a} dihapus`})
    `,Response.json({success:!0})}catch(e){return console.error(e),Response.json({error:"Gagal menghapus pengumuman"},{status:500})}}let u=new s.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/admin/announcements/route",pathname:"/api/admin/announcements",filename:"route",bundlePath:"app/api/admin/announcements/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\admin\\announcements\\route.js",nextConfigOutput:"standalone",userland:t}),{requestAsyncStorage:i,staticGenerationAsyncStorage:c,serverHooks:d,headerHooks:m,staticGenerationBailout:p}=u,l="/api/admin/announcements/route"}};var n=require("../../../../webpack-runtime.js");n.C(e);var __webpack_exec__=e=>n(n.s=e),a=n.X(0,[9364,117],()=>__webpack_exec__(26336));module.exports=a})();