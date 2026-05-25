"use strict";(()=>{var e={};e.id=2098,e.ids=[2098],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:e=>{e.exports=require("node:fs")},49411:e=>{e.exports=require("node:path")},34834:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>j,originalPathname:()=>l,requestAsyncStorage:()=>p,routeModule:()=>i,serverHooks:()=>d,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>c});var a={};t.r(a),t.d(a,{GET:()=>GET,POST:()=>POST}),t(78976);var o=t(10884),n=t(16132),s=t(10117);async function GET(e){try{let{searchParams:r}=new URL(e.url),t=r.get("porterId"),a=r.get("jobId");if(a){let e=await s.Z`
        SELECT pj.id, pj.rating, pj.feedback, pj.rated_at, pj.customer_name, pj.location_to, pj.fee, pj.completed_at
        FROM porter_jobs pj
        WHERE pj.id = ${a}
      `;return Response.json(e[0]||null)}if(t){let e=await s.Z`
        SELECT pj.id, pj.rating, pj.feedback, pj.rated_at, pj.customer_name, pj.location_to, pj.fee, pj.completed_at
        FROM porter_jobs pj
        WHERE pj.porter_id = ${t} AND pj.rating IS NOT NULL
        ORDER BY pj.rated_at DESC
        LIMIT 20
      `;return Response.json(e)}return Response.json({error:"porterId or jobId required"},{status:400})}catch(e){return console.error(e),Response.json({error:"Failed to fetch ratings"},{status:500})}}async function POST(e){try{let r=await e.json(),{job_id:t,rating:a,feedback:o}=r;if(!t||!a||a<1||a>5)return Response.json({error:"job_id and rating (1-5) required"},{status:400});let n=await s.Z`
      UPDATE porter_jobs
      SET rating = ${a}, feedback = ${o||null}, rated_at = NOW()
      WHERE id = ${t} AND status = 'completed'
      RETURNING *
    `;if(!n[0])return Response.json({error:"Job not found or not completed"},{status:404});let i=n[0].porter_id,p=await s.Z`
      SELECT ROUND(AVG(rating)::numeric, 2) as avg_rating
      FROM porter_jobs
      WHERE porter_id = ${i} AND rating IS NOT NULL
    `,u=p[0]?.avg_rating||5;return await s.Z`UPDATE porters SET rating = ${u} WHERE id = ${i}`,Response.json({success:!0,job:n[0],new_avg_rating:u})}catch(e){return console.error(e),Response.json({error:"Failed to submit rating"},{status:500})}}let i=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/ratings/route",pathname:"/api/ratings",filename:"route",bundlePath:"app/api/ratings/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\ratings\\route.js",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:u,serverHooks:d,headerHooks:j,staticGenerationBailout:c}=i,l="/api/ratings/route"}};var r=require("../../../webpack-runtime.js");r.C(e);var __webpack_exec__=e=>r(r.s=e),t=r.X(0,[9364,117],()=>__webpack_exec__(34834));module.exports=t})();