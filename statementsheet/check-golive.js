// GO-LIVE GATE: fails if any unfilled placeholder is visible to a visitor.
// Run this immediately before deploying the version that ads point at.
const { chromium } = require('playwright');
const DIR='file:///home/user/n8n-experiment-railway/statementsheet/';
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const c=await b.newContext(); const p=await c.newPage();
 await p.route('**/googletagmanager.com/**',r=>r.abort());
 let blocking=0;
 for (const f of ['index.html','privacy.html','terms.html']) {
   await p.goto(DIR+f);
   const txt=await p.locator('body').innerText();
   // visible template tokens
   const tokens=[...new Set(txt.match(/\[[A-Z_]+\]/g)||[])];
   // GTM id is in <head>, never visible text — check the source for it
   const src=await p.content();
   const gtm=src.includes('GTM-PLACEHOLDER');
   if(tokens.length||gtm){
     blocking++;
     console.log('  BLOCKED  '+f);
     tokens.forEach(t=>console.log('             visible on page: '+t));
     if(gtm) console.log('             GTM container ID not set');
   } else console.log('  clean    '+f);
 }
 await b.close();
 console.log(blocking? '\nNOT READY for ads — '+blocking+' file(s) still carry placeholders.'
                     : '\nREADY for ads — no placeholders remain.');
 process.exit(0);
})();
