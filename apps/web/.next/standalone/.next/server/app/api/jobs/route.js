"use strict";(()=>{var e={};e.id=4204,e.ids=[4204],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:e=>{e.exports=require("node:fs")},49411:e=>{e.exports=require("node:path")},64119:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>d,originalPathname:()=>E,requestAsyncStorage:()=>p,routeModule:()=>i,serverHooks:()=>c,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>l});var o={};r.r(o),r.d(o,{GET:()=>GET,PATCH:()=>PATCH,POST:()=>POST}),r(78976);var a=r(10884),s=r(16132),n=r(10117);async function GET(e){try{let{searchParams:t}=new URL(e.url),r=t.get("porterId");if(r){let e=await n.Z`
        SELECT * FROM porter_jobs 
        WHERE porter_id = ${r} 
        ORDER BY created_at DESC
      `;return Response.json(e)}let o=await n.Z`SELECT * FROM porter_jobs ORDER BY created_at DESC`;return Response.json(o)}catch(e){return console.error(e),Response.json({error:"Failed to fetch jobs"},{status:500})}}async function POST(e){try{let t=await e.json(),{porter_id:r,customer_name:o,location_from:a,location_to:s,weight_category:i,fee:p}=t,u=await n.Z`
      INSERT INTO porter_jobs (porter_id, customer_name, location_from, location_to, weight_category, fee, status)
      VALUES (${r}, ${o}, ${a}, ${s}, ${i}, ${p}, 'pending')
      RETURNING *
    `;return r&&await n.Z`UPDATE porters SET status = 'active' WHERE id = ${r}`,Response.json(u[0])}catch(e){return console.error(e),Response.json({error:"Failed to create job"},{status:500})}}async function PATCH(e){try{let t=await e.json(),{id:r,status:o}=t,a=await n.Z`
      UPDATE porter_jobs 
      SET status = ${o}, 
          completed_at = ${"completed"===o?"NOW()":null}
      WHERE id = ${r} 
      RETURNING *
    `;if("completed"===o||"cancelled"===o){let e=a[0];await n.Z`UPDATE porters SET status = 'available' WHERE id = ${e.porter_id}`}return Response.json(a[0])}catch(e){return console.error(e),Response.json({error:"Failed to update job"},{status:500})}}let i=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/jobs/route",pathname:"/api/jobs",filename:"route",bundlePath:"app/api/jobs/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\jobs\\route.js",nextConfigOutput:"standalone",userland:o}),{requestAsyncStorage:p,staticGenerationAsyncStorage:u,serverHooks:c,headerHooks:d,staticGenerationBailout:l}=i,E="/api/jobs/route"}};var t=require("../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[9364,117],()=>__webpack_exec__(64119));module.exports=r})();