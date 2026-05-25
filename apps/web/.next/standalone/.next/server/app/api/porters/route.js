"use strict";(()=>{var e={};e.id=3471,e.ids=[3471],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:e=>{e.exports=require("node:fs")},49411:e=>{e.exports=require("node:path")},85377:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>l,originalPathname:()=>R,requestAsyncStorage:()=>p,routeModule:()=>i,serverHooks:()=>d,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>c});var s={};t.r(s),t.d(s,{GET:()=>GET,PATCH:()=>PATCH,POST:()=>POST}),t(78976);var a=t(10884),o=t(16132),n=t(10117);async function GET(e){try{let{searchParams:r}=new URL(e.url),t=r.get("id");if(t){let e=await n.Z`
        SELECT p.*, 
        (SELECT COALESCE(SUM(fee), 0) FROM porter_jobs WHERE porter_id = p.id AND status = 'completed' AND created_at >= CURRENT_DATE) as daily_earnings
        FROM porters p 
        WHERE p.id = ${t}
      `;return Response.json(e[0]||null)}let s=await n.Z`SELECT * FROM porters ORDER BY name ASC`;return Response.json(s)}catch(e){return console.error(e),Response.json({error:"Failed to fetch porters"},{status:500})}}async function PATCH(e){try{let r=await e.json(),{id:t,status:s}=r;if(!t||!s)return Response.json({error:"ID and status are required"},{status:400});let a=await n.Z`
      UPDATE porters 
      SET status = ${s} 
      WHERE id = ${t} 
      RETURNING *
    `;return Response.json(a[0])}catch(e){return console.error(e),Response.json({error:"Failed to update porter status"},{status:500})}}async function POST(e){try{let r=await e.json(),{name:t,phone:s,id_number:a,daily_target:o}=r;if(!t||!s||!a)return Response.json({error:"name, phone, dan id_number wajib diisi"},{status:400});let i=await n.Z`
      INSERT INTO porters (name, phone, id_number, daily_target, status, rating)
      VALUES (${t}, ${s}, ${a}, ${o||1e5}, 'available', 5.00)
      RETURNING *
    `;return Response.json(i[0])}catch(e){if(console.error(e),e.message?.includes("unique"))return Response.json({error:"Nomor HP atau ID sudah terdaftar"},{status:409});return Response.json({error:"Failed to create porter"},{status:500})}}let i=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/porters/route",pathname:"/api/porters",filename:"route",bundlePath:"app/api/porters/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\porters\\route.js",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:p,staticGenerationAsyncStorage:u,serverHooks:d,headerHooks:l,staticGenerationBailout:c}=i,R="/api/porters/route"}};var r=require("../../../webpack-runtime.js");r.C(e);var __webpack_exec__=e=>r(r.s=e),t=r.X(0,[9364,117],()=>__webpack_exec__(85377));module.exports=t})();