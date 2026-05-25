"use strict";(()=>{var t={};t.id=4529,t.ids=[4529],t.modules={30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:t=>{t.exports=require("node:fs")},49411:t=>{t.exports=require("node:path")},56437:(t,e,a)=>{a.r(e),a.d(e,{headerHooks:()=>c,originalPathname:()=>x,requestAsyncStorage:()=>n,routeModule:()=>r,serverHooks:()=>l,staticGenerationAsyncStorage:()=>p,staticGenerationBailout:()=>b});var i={};a.r(i),a.d(i,{POST:()=>POST}),a(78976);var d=a(10884),o=a(16132),s=a(10117);function fmtRp(t){return"Rp "+Number(t||0).toLocaleString("id-ID")}function fmtDate(t){return t?new Date(t).toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"}):"—"}async function buildBillingHTML(t){let e=await s.Z`
    SELECT b.*, t.name as trader_name, t.phone, s.stall_code, s.zone
    FROM bills b
    JOIN traders t ON b.trader_id = t.id
    LEFT JOIN stalls s ON b.stall_id = s.id
    WHERE b.bill_month = ${t}
    ORDER BY t.name ASC
  `,a=e.reduce((t,e)=>t+Number(e.amount),0),i=e.filter(t=>"paid"===t.status).reduce((t,e)=>t+Number(e.amount),0),d=e.filter(t=>"paid"===t.status).length,o=e.length>0?Math.round(d/e.length*100):0,r=e.map(t=>`
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 12px;">${t.trader_name}</td>
      <td style="padding:10px 12px; font-family:monospace; font-size:12px;">${t.stall_code||"—"}</td>
      <td style="padding:10px 12px; text-transform:capitalize;">${t.zone||"—"}</td>
      <td style="padding:10px 12px;">${fmtRp(t.amount)}</td>
      <td style="padding:10px 12px;">
        <span style="background:${"paid"===t.status?"#dcfce7":"#fee2e2"};color:${"paid"===t.status?"#166534":"#991b1b"};padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;">
          ${"paid"===t.status?"Lunas":"Belum Bayar"}
        </span>
      </td>
      <td style="padding:10px 12px; font-size:12px; color:#6b7280;">${t.paid_at?fmtDate(t.paid_at):"—"}</td>
    </tr>
  `).join("");return`<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', sans-serif; color: #111827; background: white; padding: 40px; }
    .header { border-bottom: 3px solid #1d4ed8; padding-bottom: 20px; margin-bottom: 28px; }
    .title { font-size: 22px; font-weight: 700; color: #1d4ed8; }
    .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .kpi { display: flex; gap: 16px; margin-bottom: 28px; }
    .kpi-box { flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; font-weight: 600; }
    .kpi-val { font-size: 20px; font-weight: 700; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #1d4ed8; color: white; }
    th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #9ca3af; }
    .compliance { color: ${o>=80?"#166534":o>=50?"#92400e":"#991b1b"}; }
  </style></head><body>
  <div class="header">
    <div class="title">📊 Laporan Tagihan Bulanan — ${t}</div>
    <div class="subtitle">SVMS v6.0 Enterprise \xb7 Dicetak: ${fmtDate(new Date)}</div>
  </div>
  <div class="kpi">
    <div class="kpi-box"><div class="kpi-label">Total Ditagihkan</div><div class="kpi-val">${fmtRp(a)}</div></div>
    <div class="kpi-box"><div class="kpi-label">Terkumpul</div><div class="kpi-val" style="color:#166534;">${fmtRp(i)}</div></div>
    <div class="kpi-box"><div class="kpi-label">Compliance Rate</div><div class="kpi-val compliance">${o}%</div></div>
    <div class="kpi-box"><div class="kpi-label">Total Tagihan</div><div class="kpi-val">${e.length} tagihan</div></div>
  </div>
  <table>
    <thead><tr>
      <th>Pedagang</th><th>Kode Lapak</th><th>Zona</th><th>Nominal</th><th>Status</th><th>Tgl Bayar</th>
    </tr></thead>
    <tbody>${r}</tbody>
  </table>
  <div class="footer">Dokumen ini digenerate otomatis oleh SVMS v6.0 Enterprise \xb7 ${fmtDate(new Date)}</div>
  </body></html>`}async function buildTradersHTML(){let t=await s.Z`
    SELECT t.*, s.stall_code, s.zone, s.category, s.monthly_fee,
           p.permit_number, p.status as permit_status, p.expiry_date
    FROM traders t
    LEFT JOIN stalls s ON t.stall_id = s.id
    LEFT JOIN permits p ON p.trader_id = t.id
    ORDER BY t.name ASC
  `,e=t.length,a=t.filter(t=>"active"===t.status).length,i=t.filter(t=>t.permit_number).length,d=t.map(t=>`
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 12px; font-weight:500;">${t.name}</td>
      <td style="padding:10px 12px; font-size:12px;">${t.nik||"—"}</td>
      <td style="padding:10px 12px; font-size:12px;">${t.phone||"—"}</td>
      <td style="padding:10px 12px; text-transform:capitalize;">${t.trader_type}</td>
      <td style="padding:10px 12px; font-family:monospace; font-size:12px;">${t.stall_code||"—"}</td>
      <td style="padding:10px 12px;">
        <span style="background:${"active"===t.status?"#dcfce7":"warning"===t.status?"#fef3c7":"#f3f4f6"};
          color:${"active"===t.status?"#166534":"warning"===t.status?"#92400e":"#374151"};
          padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;">
          ${"active"===t.status?"Aktif":"warning"===t.status?"Peringatan":"Nonaktif"}
        </span>
      </td>
      <td style="padding:10px 12px; font-size:12px;">${t.permit_number||"Belum ada"}</td>
    </tr>
  `).join("");return`<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', sans-serif; color: #111827; background: white; padding: 40px; }
    .header { border-bottom: 3px solid #7c3aed; padding-bottom: 20px; margin-bottom: 28px; }
    .title { font-size: 22px; font-weight: 700; color: #7c3aed; }
    .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .kpi { display: flex; gap: 16px; margin-bottom: 28px; }
    .kpi-box { flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; font-weight: 600; }
    .kpi-val { font-size: 20px; font-weight: 700; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #7c3aed; color: white; }
    th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #9ca3af; }
  </style></head><body>
  <div class="header">
    <div class="title">👥 Laporan Data Pedagang</div>
    <div class="subtitle">SVMS v6.0 Enterprise \xb7 Dicetak: ${fmtDate(new Date)}</div>
  </div>
  <div class="kpi">
    <div class="kpi-box"><div class="kpi-label">Total Pedagang</div><div class="kpi-val">${e}</div></div>
    <div class="kpi-box"><div class="kpi-label">Aktif</div><div class="kpi-val" style="color:#166534;">${a}</div></div>
    <div class="kpi-box"><div class="kpi-label">Memiliki SIPTU</div><div class="kpi-val">${i}</div></div>
    <div class="kpi-box"><div class="kpi-label">Tanpa SIPTU</div><div class="kpi-val" style="color:#991b1b;">${e-i}</div></div>
  </div>
  <table>
    <thead><tr><th>Nama</th><th>NIK</th><th>Telepon</th><th>Tipe</th><th>Lapak</th><th>Status</th><th>No. SIPTU</th></tr></thead>
    <tbody>${d}</tbody>
  </table>
  <div class="footer">Dokumen ini digenerate otomatis oleh SVMS v6.0 Enterprise \xb7 ${fmtDate(new Date)}</div>
  </body></html>`}async function buildPorterHTML(){let t=await s.Z`SELECT * FROM porters ORDER BY rating DESC`,e=await s.Z`
    SELECT pi.*, p.name as porter_name
    FROM porter_incentives pi
    JOIN porters p ON pi.porter_id = p.id
    ORDER BY pi.week_start DESC
    LIMIT 50
  `,a=t.map(t=>{let a=e.find(e=>e.porter_id===t.id);return`
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 12px; font-weight:500;">${t.name}</td>
      <td style="padding:10px 12px; font-size:12px;">${t.phone}</td>
      <td style="padding:10px 12px;">
        <span style="background:${"available"===t.status?"#dcfce7":"active"===t.status?"#dbeafe":"#f3f4f6"};
          color:${"available"===t.status?"#166534":"active"===t.status?"#1e40af":"#374151"};
          padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;">
          ${"available"===t.status?"Tersedia":"active"===t.status?"Bertugas":"Off"}
        </span>
      </td>
      <td style="padding:10px 12px; text-align:center;">⭐ ${Number(t.rating).toFixed(1)}</td>
      <td style="padding:10px 12px;">${a?`${({platinum:"\uD83D\uDC8E",gold:"\uD83E\uDD47",silver:"\uD83E\uDD48",bronze:"\uD83E\uDD49"})[a.tier]||"—"} ${a.tier}`:"—"}</td>
      <td style="padding:10px 12px;">${a?`Rp ${Number(a.bonus_amount).toLocaleString("id-ID")}`:"—"}</td>
      <td style="padding:10px 12px; font-size:12px;">${a?.week_start||"—"} s/d ${a?.week_end||"—"}</td>
    </tr>`}).join("");return`<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', sans-serif; color: #111827; background: white; padding: 40px; }
    .header { border-bottom: 3px solid #0891b2; padding-bottom: 20px; margin-bottom: 28px; }
    .title { font-size: 22px; font-weight: 700; color: #0891b2; }
    .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .kpi { display: flex; gap: 16px; margin-bottom: 28px; }
    .kpi-box { flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; font-weight: 600; }
    .kpi-val { font-size: 20px; font-weight: 700; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #0891b2; color: white; }
    th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #9ca3af; }
  </style></head><body>
  <div class="header">
    <div class="title">📦 Laporan Kuli Panggul & Insentif</div>
    <div class="subtitle">SVMS v6.0 Enterprise \xb7 Dicetak: ${fmtDate(new Date)}</div>
  </div>
  <div class="kpi">
    <div class="kpi-box"><div class="kpi-label">Total Porter</div><div class="kpi-val">${t.length}</div></div>
    <div class="kpi-box"><div class="kpi-label">Tersedia</div><div class="kpi-val" style="color:#166534;">${t.filter(t=>"available"===t.status).length}</div></div>
    <div class="kpi-box"><div class="kpi-label">Rating Avg</div><div class="kpi-val" style="color:#d97706;">⭐ ${t.length>0?(t.reduce((t,e)=>t+Number(e.rating),0)/t.length).toFixed(2):"5.00"}</div></div>
    <div class="kpi-box"><div class="kpi-label">Punya Insentif</div><div class="kpi-val">${new Set(e.map(t=>t.porter_id)).size}</div></div>
  </div>
  <table>
    <thead><tr><th>Nama</th><th>Telepon</th><th>Status</th><th>Rating</th><th>Tier Insentif</th><th>Bonus</th><th>Periode</th></tr></thead>
    <tbody>${a}</tbody>
  </table>
  <div class="footer">Dokumen ini digenerate otomatis oleh SVMS v6.0 Enterprise \xb7 ${fmtDate(new Date)}</div>
  </body></html>`}async function POST(t){try{let e=await t.json(),{type:a,month:i}=e,d="",o="laporan.pdf";if("billing"===a){let t=i||new Date().toISOString().slice(0,7);d=await buildBillingHTML(t),o=`tagihan-${t}.pdf`}else if("traders"===a)d=await buildTradersHTML(),o=`pedagang-${new Date().toISOString().slice(0,10)}.pdf`;else{if("porter"!==a)return Response.json({error:"type must be billing | traders | porter"},{status:400});d=await buildPorterHTML(),o=`porter-insentif-${new Date().toISOString().slice(0,10)}.pdf`}let r=await fetch(`${process.env.NEXT_PUBLIC_CREATE_APP_URL||""}/integrations/pdf-generation/pdf`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({source:{html:d}})});if(!r.ok)throw Error(`PDF generation failed: ${r.status}`);let n=await r.arrayBuffer();return await s.Z`
      INSERT INTO audit_logs (module, action, description)
      VALUES ('Laporan', 'EXPORT', ${`Laporan PDF ${a} digenerate: ${o}`})
    `,new Response(n,{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${o}"`}})}catch(t){return console.error(t),Response.json({error:"Failed to generate PDF: "+t.message},{status:500})}}let r=new d.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/admin/reports/route",pathname:"/api/admin/reports",filename:"route",bundlePath:"app/api/admin/reports/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\admin\\reports\\route.js",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:n,staticGenerationAsyncStorage:p,serverHooks:l,headerHooks:c,staticGenerationBailout:b}=r,x="/api/admin/reports/route"}};var e=require("../../../../webpack-runtime.js");e.C(t);var __webpack_exec__=t=>e(e.s=t),a=e.X(0,[9364,117],()=>__webpack_exec__(56437));module.exports=a})();