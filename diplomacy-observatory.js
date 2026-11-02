/* HINOMOTO DIPLOMATIC OBSERVATORY — adaptive document navigation */
(()=>{"use strict";
const root=document.documentElement;if(root.dataset.dpxObservatory)return;root.dataset.dpxObservatory="1";
const main=document.querySelector("main");if(!main)return;
const candidates=[...main.children].filter(el=>/^(SECTION|ARTICLE)$/.test(el.tagName)&&!el.hidden&&!el.matches("[aria-hidden='true']"));
const sections=candidates.map((el,index)=>{const h=el.querySelector(":scope > h1,:scope > h2,:scope > header h1,:scope > header h2,h1,h2");if(!h)return null;if(!el.id)el.id="dpx-chapter-"+(index+1);return{el,id:el.id,title:h.textContent.trim().replace(/\s+/g," ").slice(0,48)}}).filter(Boolean);
if(sections.length<2)return;
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
let active=0,focusMode=false,started=Date.now(),visibleMs=0,lastTick=Date.now(),visible=true;
const nav=document.createElement("nav");nav.className="dpx-observatory";nav.setAttribute("aria-label","文書巡覧・章節ナビゲーション");
const label=document.createElement("div");label.className="dpx-observatory-label";label.textContent="DOCUMENT OBSERVATORY";nav.append(label);
const track=document.createElement("div");track.className="dpx-observatory-track";const fill=document.createElement("i");track.append(fill);nav.append(track);
const steps=sections.map((s,i)=>{const b=document.createElement("button");b.type="button";b.className="dpx-observatory-step";b.textContent=String(i+1).padStart(2,"0");b.setAttribute("aria-label",(i+1)+"章 "+s.title);const tip=document.createElement("span");tip.textContent=s.title;b.append(tip);b.addEventListener("click",()=>{if(focusMode)setActive(i);s.el.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"})});nav.append(b);return b});
const tools=document.createElement("div");tools.className="dpx-observatory-tools";
const infoButton=document.createElement("button");infoButton.type="button";infoButton.className="dpx-observatory-tool";infoButton.textContent="ⓘ";infoButton.setAttribute("aria-label","この文書の閲覧情報");
const focusButton=document.createElement("button");focusButton.type="button";focusButton.className="dpx-observatory-tool";focusButton.textContent="◉";focusButton.setAttribute("aria-label","集中閲覧を開始");focusButton.setAttribute("aria-pressed","false");
tools.append(infoButton,focusButton);nav.append(tools);document.body.append(nav);
const info=document.createElement("aside");info.className="dpx-observatory-info";info.hidden=true;info.innerHTML='<small>DOCUMENT INTELLIGENCE</small><strong>この頁の閲覧情報</strong><div class="dpx-observatory-stats"><div><b data-dpx-count>0</b><span>章節</span></div><div><b data-dpx-words>0</b><span>文字・概算</span></div><div><b data-dpx-time>—</b><span>推定閲覧時間</span></div><div><b data-dpx-elapsed>0:00</b><span>この頁の滞在</span></div></div>';document.body.append(info);
info.querySelector("[data-dpx-count]").textContent=sections.length;
const textLength=(main.innerText||"").replace(/\s/g,"").length;info.querySelector("[data-dpx-words]").textContent=textLength.toLocaleString("ja-JP");info.querySelector("[data-dpx-time]").textContent=Math.max(1,Math.ceil(textLength/500))+"分";
const banner=document.createElement("div");banner.className="dpx-focus-banner";banner.hidden=true;const bannerText=document.createElement("span");const exit=document.createElement("button");exit.type="button";exit.textContent="集中閲覧を終了";banner.append(bannerText,exit);document.body.append(banner);
function setActive(index){active=Math.max(0,Math.min(sections.length-1,index));steps.forEach((b,i)=>{if(i===active)b.setAttribute("aria-current","location");else b.removeAttribute("aria-current")});bannerText.textContent="集中閲覧　／　"+sections[active].title;fill.style.height=((active+1)/sections.length*100)+"%"}
function setFocus(on){focusMode=on;document.body.classList.toggle("dpx-focus-mode",on);sections.forEach((s,i)=>s.el.classList.toggle("dpx-focus-active",on&&i===active));focusButton.setAttribute("aria-pressed",String(on));focusButton.setAttribute("aria-label",on?"集中閲覧を終了":"集中閲覧を開始");banner.hidden=!on;if(on){setActive(active);sections[active].el.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"})}else sections.forEach(s=>s.el.classList.remove("dpx-focus-active"))}
function step(delta){const next=Math.max(0,Math.min(sections.length-1,active+delta));if(next!==active){setActive(next);sections[next].el.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"})}}
infoButton.addEventListener("click",()=>{info.hidden=!info.hidden;infoButton.setAttribute("aria-pressed",String(!info.hidden))});
focusButton.addEventListener("click",()=>setFocus(!focusMode));exit.addEventListener("click",()=>setFocus(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&focusMode){setFocus(false);return}if(e.altKey&&e.key==="ArrowDown"){e.preventDefault();step(1)}if(e.altKey&&e.key==="ArrowUp"){e.preventDefault();step(-1)}});
if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>{const best=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(best){const i=sections.findIndex(s=>s.el===best.target);if(i>=0){setActive(i);if(focusMode)sections.forEach((s,n)=>s.el.classList.toggle("dpx-focus-active",n===active))}}},{rootMargin:"-18% 0px -55% 0px",threshold:[0,.12,.3,.55]});sections.forEach(s=>observer.observe(s))}
document.addEventListener("visibilitychange",()=>{const now=Date.now();if(visible)visibleMs+=now-lastTick;visible=!document.hidden;lastTick=now});
setInterval(()=>{const now=Date.now();if(!document.hidden)visibleMs+=now-lastTick;lastTick=now;const secs=Math.floor(visibleMs/1000);info.querySelector("[data-dpx-elapsed]").textContent=Math.floor(secs/60)+":"+String(secs%60).padStart(2,"0")},1000);
setActive(0);
})();