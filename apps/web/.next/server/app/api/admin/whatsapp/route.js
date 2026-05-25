"use strict";(()=>{var e={};e.id=5923,e.ids=[5923],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},87561:e=>{e.exports=require("node:fs")},49411:e=>{e.exports=require("node:path")},15065:(e,a,t)=>{t.r(a),t.d(a,{headerHooks:()=>m,originalPathname:()=>c,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>l,staticGenerationAsyncStorage:()=>d,staticGenerationBailout:()=>h});var n={};t.r(n),t.d(n,{GET:()=>GET,POST:()=>POST}),t(78976);var r=t(10884),s=t(16132),o=t(10117);let i={billing_reminder:e=>`Yth. *${e.trader_name}*,

Tagihan sewa lapak *${e.stall_code}* untuk bulan *${e.bill_month}* sebesar *Rp ${Number(e.amount).toLocaleString("id-ID")}* belum terbayar.

Mohon segera melakukan pembayaran ke kantor manajemen pasar.

Terima kasih 🙏
_Manajemen Pasar Modern_`,siptu_expiry:e=>`Yth. *${e.trader_name}*,

SIPTU Anda nomor *${e.permit_number}* akan kadaluarsa pada *${e.expiry_date}*.

Silakan perpanjang SIPTU Anda di kantor manajemen sebelum tanggal tersebut.

Terima kasih 🙏
_Manajemen Pasar Modern_`,porter_incentive:e=>`Yth. *${e.porter_name}*,

Selamat! Insentif minggu ini Anda telah disetujui.

🏅 Tier: *${e.tier}*
💰 Bonus: *Rp ${Number(e.bonus).toLocaleString("id-ID")}*
⭐ Rating: ${e.rating}
📦 Job selesai: ${e.jobs} job

Bonus akan dibayarkan segera. Terima kasih atas kerja kerasnya!
_Manajemen Pasar Modern_`,general:e=>e.message};async function sendWhatsApp(e,a){let t=process.env.WHATSAPP_API_KEY;if(!t)return console.log(`[WA QUEUE] To: ${e} | Msg: ${a.slice(0,60)}...`),{status:"queued_dev",phone:e};let n=e.replace(/\D/g,"");n.startsWith("0")&&(n="62"+n.slice(1)),n.startsWith("62")||(n="62"+n);let r=await fetch("https://api.fonnte.com/send",{method:"POST",headers:{Authorization:t,"Content-Type":"application/json"},body:JSON.stringify({target:n,message:a,countryCode:"62"})}),s=await r.json();return s}async function GET(e){try{let{searchParams:a}=new URL(e.url),t=a.get("type")||"",n="SELECT * FROM audit_logs WHERE module = 'WhatsApp'",r=[];t&&(n+=" AND action = $1",r.push(t)),n+=" ORDER BY created_at DESC LIMIT 50";let s=await (0,o.Z)(n,r);return Response.json(s)}catch(e){return console.error(e),Response.json({error:"Failed to fetch WA queue"},{status:500})}}async function POST(e){try{let a=await e.json(),{type:t,targets:n}=a;if(!t||!n||!n.length)return Response.json({error:"type and targets[] required"},{status:400});let r=[];for(let e of n){let a=i[t]||i.general,n=a(e);try{let a=await sendWhatsApp(e.phone,n);r.push({phone:e.phone,name:e.trader_name||e.porter_name,status:"sent",result:a}),await o.Z`
          INSERT INTO audit_logs (module, action, user_name, description)
          VALUES ('WhatsApp', ${t}, 'Sistem', ${`Notifikasi ${t} dikirim ke ${e.trader_name||e.porter_name} (${e.phone})`})
        `}catch(a){r.push({phone:e.phone,status:"failed",error:a.message})}}return Response.json({sent:r.filter(e=>"sent"===e.status).length,failed:r.filter(e=>"failed"===e.status).length,results:r})}catch(e){return console.error(e),Response.json({error:"Failed to send WhatsApp"},{status:500})}}let p=new r.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/admin/whatsapp/route",pathname:"/api/admin/whatsapp",filename:"route",bundlePath:"app/api/admin/whatsapp/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\admin\\whatsapp\\route.js",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:l,headerHooks:m,staticGenerationBailout:h}=p,c="/api/admin/whatsapp/route"}};var a=require("../../../../webpack-runtime.js");a.C(e);var __webpack_exec__=e=>a(a.s=e),t=a.X(0,[9364,117],()=>__webpack_exec__(15065));module.exports=t})();