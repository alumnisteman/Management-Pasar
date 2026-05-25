"use strict";(()=>{var e={};e.id=614,e.ids=[614],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:e=>{e.exports=require("node:fs")},49411:e=>{e.exports=require("node:path")},31838:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>l,originalPathname:()=>E,requestAsyncStorage:()=>p,routeModule:()=>o,serverHooks:()=>u,staticGenerationAsyncStorage:()=>d,staticGenerationBailout:()=>_});var a={};r.r(a),r.d(a,{GET:()=>GET,PATCH:()=>PATCH,POST:()=>POST}),r(78976);var n=r(10884),s=r(16132),i=r(10117);async function GET(e){try{let{searchParams:t}=new URL(e.url),r=t.get("porterId"),a=t.get("recalculate");if("true"===a&&r){let e=new Date;e.setDate(e.getDate()-e.getDay()+1),e.setHours(0,0,0,0);let t=new Date(e);t.setDate(t.getDate()+6),t.setHours(23,59,59,999);let a=e.toISOString().split("T")[0],n=t.toISOString().split("T")[0],s=await i.Z`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'completed') as jobs_completed,
          ROUND(AVG(rating) FILTER (WHERE rating IS NOT NULL)::numeric, 2) as avg_rating,
          COALESCE(SUM(fee) FILTER (WHERE status = 'completed'), 0) as total_earnings
        FROM porter_jobs
        WHERE porter_id = ${r}
          AND created_at >= ${a}::date
          AND created_at <= (${n}::date + INTERVAL '1 day')
      `,o=await i.Z`SELECT daily_target FROM porters WHERE id = ${r}`,p=o[0]?.daily_target||1e5,d=await i.Z`
        SELECT DATE(created_at) as day, SUM(fee) as day_total
        FROM porter_jobs
        WHERE porter_id = ${r}
          AND status = 'completed'
          AND created_at >= ${a}::date
          AND created_at <= (${n}::date + INTERVAL '1 day')
        GROUP BY DATE(created_at)
      `,u=d.filter(e=>Number(e.day_total)>=p).length,l=Number(s[0]?.jobs_completed||0),_=Number(s[0]?.avg_rating||0),E=Number(s[0]?.total_earnings||0),{tier:c,bonus:R,label:T}=function(e,t,r){let a=(e>=50?3:e>=30?2:e>=15?1:0)+(t>=4.8?3:t>=4.5?2:t>=4?1:0)+(r>=6?3:r>=4?2:r>=2?1:0);return a>=8?{tier:"platinum",bonus:15e4,label:"Platinum"}:a>=6?{tier:"gold",bonus:1e5,label:"Gold"}:a>=4?{tier:"silver",bonus:6e4,label:"Silver"}:a>=2?{tier:"bronze",bonus:3e4,label:"Bronze"}:{tier:"none",bonus:0,label:"Belum Memenuhi"}}(l,_,u);return Response.json({porterId:Number(r),weekStart:a,weekEnd:n,jobsCompleted:l,avgRating:_,totalEarnings:E,daysHitTarget:u,tier:c,bonus:R,tierLabel:T,progress:{jobs:l,jobsNextTier:l<15?15:l<30?30:50,rating:_,ratingNextTier:_<4?4:_<4.5?4.5:4.8,daysHit:u,daysNextTier:u<2?2:u<4?4:6}})}if(r){let e=await i.Z`
        SELECT pi.*, p.name as porter_name
        FROM porter_incentives pi
        JOIN porters p ON pi.porter_id = p.id
        WHERE pi.porter_id = ${r}
        ORDER BY pi.week_start DESC
        LIMIT 12
      `;return Response.json(e)}let n=await i.Z`
      SELECT pi.*, p.name as porter_name
      FROM porter_incentives pi
      JOIN porters p ON pi.porter_id = p.id
      ORDER BY pi.week_start DESC, pi.bonus_amount DESC
    `;return Response.json(n)}catch(e){return console.error(e),Response.json({error:"Failed to fetch incentives"},{status:500})}}async function POST(e){try{let t=await e.json(),{porter_id:r,week_start:a,week_end:n,jobs_completed:s,avg_rating:o,total_earnings:p,days_hit_target:d,tier:u,bonus_amount:l}=t,_=await i.Z`
      SELECT id FROM porter_incentives WHERE porter_id = ${r} AND week_start = ${a}
    `;if(_.length>0){let e=await i.Z`
        UPDATE porter_incentives
        SET jobs_completed = ${s}, avg_rating = ${o},
            total_earnings = ${p}, days_hit_target = ${d},
            tier = ${u}, bonus_amount = ${l}, status = 'approved'
        WHERE porter_id = ${r} AND week_start = ${a}
        RETURNING *
      `;return Response.json(e[0])}let E=await i.Z`
      INSERT INTO porter_incentives (porter_id, week_start, week_end, jobs_completed, avg_rating, total_earnings, days_hit_target, tier, bonus_amount, status)
      VALUES (${r}, ${a}, ${n}, ${s}, ${o}, ${p}, ${d}, ${u}, ${l}, 'approved')
      RETURNING *
    `;return Response.json(E[0])}catch(e){return console.error(e),Response.json({error:"Failed to save incentive"},{status:500})}}async function PATCH(e){try{let t=await e.json(),{id:r}=t,a=await i.Z`
      UPDATE porter_incentives
      SET status = 'paid', paid_at = NOW()
      WHERE id = ${r}
      RETURNING *
    `;return Response.json(a[0])}catch(e){return console.error(e),Response.json({error:"Failed to mark as paid"},{status:500})}}let o=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/incentives/route",pathname:"/api/incentives",filename:"route",bundlePath:"app/api/incentives/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\incentives\\route.js",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:d,serverHooks:u,headerHooks:l,staticGenerationBailout:_}=o,E="/api/incentives/route"}};var t=require("../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[9364,117],()=>__webpack_exec__(31838));module.exports=r})();