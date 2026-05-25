"use strict";(()=>{var e={};e.id=6808,e.ids=[6808],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6113:e=>{e.exports=require("crypto")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},47261:e=>{e.exports=require("node:util")},89127:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>d,originalPathname:()=>h,requestAsyncStorage:()=>i,routeModule:()=>n,serverHooks:()=>c,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>l});var s={};r.r(s),r.d(s,{GET:()=>GET}),r(78976);var o=r(10884),a=r(16132),p=r(61804);async function GET(e){let t=process.env.AUTH_URL?.startsWith("https")??e.url?.startsWith("https")??!1,[r,s]=await Promise.all([(0,p.LP)({req:e,secret:process.env.AUTH_SECRET,secureCookie:t,raw:!0}),(0,p.LP)({req:e,secret:process.env.AUTH_SECRET,secureCookie:t})]);if(!s)return new Response(`
			<html>
				<body>
					<script>
						window.parent.postMessage({ type: 'AUTH_ERROR', error: 'Unauthorized' }, '*');
					</script>
				</body>
			</html>
			`,{status:401,headers:{"Content-Type":"text/html"}});let o={type:"AUTH_SUCCESS",jwt:r,user:{id:s.sub,email:s.email,name:s.name}};return new Response(`
		<html>
			<body>
				<script>
					window.parent.postMessage(${JSON.stringify(o)}, '*');
				</script>
			</body>
		</html>
		`,{headers:{"Content-Type":"text/html"}})}let n=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/auth/expo-web-success/route",pathname:"/api/auth/expo-web-success",filename:"route",bundlePath:"app/api/auth/expo-web-success/route"},resolvedPagePath:"D:\\management-pasar\\apps\\web\\src\\app\\api\\auth\\expo-web-success\\route.js",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:i,staticGenerationAsyncStorage:u,serverHooks:c,headerHooks:d,staticGenerationBailout:l}=n,h="/api/auth/expo-web-success/route"}};var t=require("../../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[9364,1804],()=>__webpack_exec__(89127));module.exports=r})();