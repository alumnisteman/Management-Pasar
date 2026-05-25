"use strict";(()=>{var e={};e.id=2003,e.ids=[2003],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:e=>{e.exports=require("node:fs")},49411:e=>{e.exports=require("node:path")},46221:(e,a,t)=>{t.r(a),t.d(a,{headerHooks:()=>p,originalPathname:()=>m,requestAsyncStorage:()=>u,routeModule:()=>l,serverHooks:()=>d,staticGenerationAsyncStorage:()=>c,staticGenerationBailout:()=>E});var s={};t.r(s),t.d(s,{DELETE:()=>DELETE,GET:()=>GET,PATCH:()=>PATCH,POST:()=>POST}),t(78976);var r=t(10884),o=t(16132),n=t(10117);let i={gold:{base:75e4,max:12e5,min:6e5,multiplier:.15},silver:{base:5e5,max:85e4,min:4e5,multiplier:.12},bronze:{base:35e4,max:6e5,min:28e4,multiplier:.1}};function calcDynamicPrice(e,a){let t=i[e]||i.silver,s=1e4*Math.round(t.base*(1+a/100*t.multiplier)/1e4);return Math.min(Math.max(s,t.min),t.max)}async function GET(){try{let e=await n.Z`
      SELECT s.*, t.name as trader_name, t.phone as trader_phone
      FROM stalls s
      LEFT JOIN traders t ON s.trader_id = t.id
      ORDER BY s.row_x ASC, s.col_y ASC
    `,a={};e.forEach(e=>{a[e.zone]||(a[e.zone]={total:0,occupied:0}),a[e.zone].total++,"occupied"===e.status&&a[e.zone].occupied++});let t=e.map(e=>{let t=a[e.zone]||{total:1,occupied:0},s=Math.round(t.occupied/t.total*100);return{...e,suggested_price:calcDynamicPrice(e.zone,s),zone_occupancy:s}});return Response.json(t)}catch(e){return console.error(e),Response.json({error:"Failed to fetch stalls"},{status:500})}}async function PATCH(e){try{let a=await e.json(),{id:t,status:s,trader_id:r,zone:o,category:i,monthly_fee:l,apply_dynamic_pricing:u,custom_price:c}=a;if(u&&o){let e=await n.Z`
        SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'occupied') as occupied
        FROM stalls WHERE zone = ${o}
      `,a=Number(e[0].total)>0?Math.round(Number(e[0].occupied)/Number(e[0].total)*100):0,t=c?parseInt(c):calcDynamicPrice(o,a),s=await n.Z`
        UPDATE stalls SET monthly_fee = ${t} WHERE zone = ${o} RETURNING *
      `;return await n.Z`
        INSERT INTO audit_logs (module, action, description)
        VALUES ('Grid', 'DYNAMIC_PRICE', ${`Pricing diterapkan ke zone ${o}: Rp ${t.toLocaleString("id-ID")} (hunian ${a}%)`})
      `,Response.json({updated:s.length,new_price:t,zone:o,occupancy_rate:a})}let d=await n.Z`
      UPDATE stalls SET
        status = COALESCE(${s??null}, status),
        trader_id = ${void 0!==r?r||null:void 0},
        zone = COALESCE(${o??null}, zone),
        category = COALESCE(${i??null}, category),
        monthly_fee = COALESCE(${l??null}, monthly_fee)
      WHERE id = ${t}
      RETURNING *
    `;return await n.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Grid', 'UPDATE', ${`Lapak #${d[0]?.stall_code} diperbarui`})
    `,Response.json(d[0])}catch(e){return console.error(e),Response.json({error:"Failed to update stall"},{status:500})}}async function POST(e){try{let{stall_code:a,zone:t,category:s,monthly_fee:r,row_x:o,col_y:i}=await e.json();if(!a||!t||!s||void 0===r||void 0===o||void 0===i)return Response.json({error:"Semua field wajib diisi"},{status:400});let l=await n.Z`
      INSERT INTO stalls (stall_code, zone, category, monthly_fee, row_x, col_y)
      VALUES (${a}, ${t}, ${s}, ${r}, ${o}, ${i})
    `;return await n.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Grid', 'CREATE', ${`Lapak baru ditambahkan: ${a} di Zona ${t}`})
    `,Response.json({success:!0,stall:l[0]})}catch(e){return console.error(e),Response.json({error:"Gagal membuat lapak"},{status:500})}}async function DELETE(e){try{let a=new URL(e.url),t=a.searchParams.get("id");if(!t)return Response.json({error:"ID lapak tidak valid"},{status:400});let s=await n.Z`SELECT * FROM stalls WHERE id = ${t}`;if(0===s.length)return Response.json({error:"Lapak tidak ditemukan"},{status:404});if("occupied"===s[0].status)return Response.json({error:"Lapak yang terisi tidak dapat dihapus"},{status:400});return await n.Z`DELETE FROM stalls WHERE id = ${t}`,await n.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Grid', 'DELETE', ${`Lapak dihapus: ${s[0].stall_code}`})
    `,Response.json({success:!0})}catch(e){return console.error(e),Response.json({error:"Gagal menghapus lapak"},{status:500})}}let l=new r.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/admin/stalls/route",pathname:"/api/admin/stalls",filename:"route",bundlePath:"app/api/admin/stalls/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\admin\\stalls\\route.js",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:u,staticGenerationAsyncStorage:c,serverHooks:d,headerHooks:p,staticGenerationBailout:E}=l,m="/api/admin/stalls/route"}};var a=require("../../../../webpack-runtime.js");a.C(e);var __webpack_exec__=e=>a(a.s=e),t=a.X(0,[9364,117],()=>__webpack_exec__(46221));module.exports=t})();