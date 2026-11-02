/* 萬國外交廳 — Imperial digital experience */
(()=>{"use strict";
if(document.documentElement.dataset.ixReady)return;document.documentElement.dataset.ixReady="1";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const countries=[
["央國","United States of Center","北央大陸","ou"],["紅霧國","United Kingdom of Great Scarlet and Fog","歐州北西部","koumu"],["芙蓉國","Hibiscus Republic","歐州","fuyou"],["琴奏國","Melodia Duchy","中歐","kinsou"],["留廉伯","Republic of Luremburg","中歐","ruren"],["竜棘國","Roseria","東歐","ibara"],["神武國","Arms Republic","南歐","shinbu"],["銀冠國","Kingdom of the Silver Crown","中歐","ginkan"],["翠丘國","Principality of Suikyū","東歐","suikyu"],["煌耀皇國","Radiant Imperial State of Kouyou","東歐・西亞","kouyou"],["美天國","The Celestial Empire of Mitian","東方大陸","mitian"]];
const path=location.pathname,inside=path.includes("/countries/"),root=inside?"../":"",file=(path.split("/").pop()||"index.html").replace(".html",""),directoryPage=inside&&file==="index";
const current=countries.findIndex(c=>c[3]===file);
const toast=document.createElement("div");toast.className="ix-toast";toast.setAttribute("role","status");document.body.append(toast);let toastTimer;
function say(s){toast.textContent=s;toast.classList.add("ix-show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("ix-show"),2200)}
const crumb=document.createElement("div");crumb.className="ix-breadcrumb";crumb.innerHTML='<a href="'+root+'index.html">萬國外交廳</a>　／　'+(inside&&current>=0?'<a href="index.html">世界の國・地域</a>　／　<strong>'+countries[current][0]+'</strong>':inside?"世界の國・地域":file==="index"?"本廳舎":"世界の國・地域");const main=$("main");if(main)main.before(crumb);
if(inside&&current>=0){const prev=countries[(current+countries.length-1)%countries.length],next=countries[(current+1)%countries.length];const sw=document.createElement("div");sw.className="ix-country-switch";sw.innerHTML='<a href="'+prev[3]+'.html">← '+prev[0]+'</a><span class="ix-current">'+countries[current][0]+'　／　COUNTRY DOSSIER</span><span class="ix-arrows"><a href="'+next[3]+'.html">'+next[0]+' →</a></span>';crumb.after(sw)}
const globalNav=document.createElement("nav");globalNav.className="ix-global-links";globalNav.setAttribute("aria-label","萬國外交廳 共通案内");const globalItems=[["本廳舎",root+"index.html",!inside&&file==="index"],["國別資料室",root+"countries/index.html",inside&&directoryPage],["外交文書館",root+"archive.html",file==="archive"],["萬國全圖",root+"atlas.html",file==="atlas"]];globalNav.innerHTML=globalItems.map(([label,href,active])=>'<a href="'+href+'"'+(active?' aria-current="page"':"")+'>'+label+'</a>').join("");crumb.after(globalNav);
const dock=document.createElement("div");dock.className="ix-utility";dock.setAttribute("aria-label","閲覧補助");dock.innerHTML='<button type="button" data-ix-index aria-label="外交資料索引">⌕<span>索引</span></button><button type="button" data-ix-bookmark aria-label="この頁を栞にする">☆<span>栞</span></button><button type="button" data-ix-read aria-label="閱讀モード">文<span>讀む</span></button><button type="button" data-ix-share aria-label="この頁を共有">↗<span>共有</span></button>';document.body.append(dock);
const modal=document.createElement("div");modal.className="ix-modal";modal.hidden=true;modal.innerHTML='<section class="ix-dialog" role="dialog" aria-modal="true" aria-labelledby="ix-dialog-title"><div class="ix-dialog-head"><h2 id="ix-dialog-title">萬國外交廳　資料索引</h2><button type="button" data-ix-close>閉じる ×</button></div><input class="ix-modal-search" type="search" placeholder="國名・地域・資料名を検索…" autocomplete="off"><div class="ix-modal-grid"></div></section>';document.body.append(modal);
const search=$("input",modal),grid=$(".ix-modal-grid",modal);
const entries=[{name:"萬國外交廳　本廳舎",sub:"機關案内・公報・外交行政",url:root+"index.html",key:"本廳舎 外交行政 公報"},{name:"世界の國・地域",sub:"國別資料室",url:root+"countries/index.html",key:"國別 國 地域"},{name:"外交文書館",sub:"公開資料目録",url:root+"archive.html",key:"文書館 条約 資料 目録"},{name:"萬國全圖",sub:"地形・水系・海洋",url:root+"atlas.html",key:"地理 地図 海流 山脈 河川"},...countries.map(c=>({name:c[0],sub:c[1]+" ／ "+c[2],url:root+"countries/"+c[3]+".html",key:c.join(" ")}))];
$$("main h1,main h2,main h3").forEach(h=>{if(h.textContent.trim()){const sec=h.closest("section[id]");if(sec)entries.push({name:h.textContent.trim(),sub:"本頁の項目",url:"#"+sec.id,key:h.textContent})}});
function render(q=""){const n=q.normalize("NFKC").toLowerCase().replace(/[\s　]/g,"");const found=entries.filter(x=>(x.name+x.sub+x.key).normalize("NFKC").toLowerCase().replace(/[\s　]/g,"").includes(n));grid.innerHTML=found.length?found.map(x=>'<a class="ix-modal-card" href="'+x.url+'"><strong>'+x.name+'</strong><small>'+x.sub+'</small></a>').join(""):"<p>該当する資料はありません。</p>"}
function open(){modal.hidden=false;search.value="";render();search.focus();document.body.style.overflow="hidden"}function close(){modal.hidden=true;document.body.style.overflow=""}
dock.querySelector("[data-ix-index]").addEventListener("click",open);modal.querySelector("[data-ix-close]").addEventListener("click",close);modal.addEventListener("click",e=>{if(e.target===modal)close()});search.addEventListener("input",()=>render(search.value));document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();modal.hidden?open():close()}if(e.key==="Escape"&&!modal.hidden)close()});
const key="hinomoto-diplomacy-bookmarks";function readMarks(){try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return []}}function writeMarks(v){try{localStorage.setItem(key,JSON.stringify(v));return true}catch{return false}}
const bookmark=dock.querySelector("[data-ix-bookmark]"),url=location.href.split("#")[0],title=$("h1")?.textContent.trim()||document.title;
function syncMark(){const on=readMarks().some(x=>x.url===url);bookmark.setAttribute("aria-pressed",String(on));bookmark.firstChild.textContent=on?"★":"☆"}
bookmark.addEventListener("click",()=>{let marks=readMarks();if(marks.some(x=>x.url===url)){marks=marks.filter(x=>x.url!==url);say("栞から取り除きました")}else{marks.unshift({url,title,at:Date.now()});marks=marks.slice(0,30);say("この頁を外交の栞に収めました")}writeMarks(marks);syncMark()});syncMark();
dock.querySelector("[data-ix-read]").addEventListener("click",e=>{const on=document.body.classList.toggle("ix-reading");e.currentTarget.setAttribute("aria-pressed",String(on));say(on?"閱讀モード":"通常表示")});
dock.querySelector("[data-ix-share]").addEventListener("click",async()=>{try{if(navigator.share)await navigator.share({title,url});else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);say("頁のURLを複写しました")}else say(url)}catch{}});
const directory=$(".directory");if(directory){const bar=document.createElement("div");bar.className="ix-country-directory-tools";bar.innerHTML='<input type="search" placeholder="國名・英語名・地域から検索…" aria-label="國別資料を検索"><button type="button" data-ix-random>一國を巡る ↗</button>';directory.before(bar);const input=$("input",bar),cards=$$(".country-card",directory);input.addEventListener("input",()=>{const q=input.value.normalize("NFKC").toLowerCase();cards.forEach(c=>c.classList.toggle("ix-hidden",!c.textContent.normalize("NFKC").toLowerCase().includes(q)))});bar.querySelector("button").addEventListener("click",()=>{const visible=cards.filter(c=>!c.classList.contains("ix-hidden"));if(visible.length){const card=visible[Math.floor(Math.random()*visible.length)];location.href=card.href}});cards.forEach(c=>{const label=document.createElement("label");label.className="ix-card-compare";label.innerHTML='<input type="checkbox" value="'+c.href+'"> 比較候補に加える';c.append(label)});const compare=document.createElement("button");compare.type="button";compare.className="ix-action";compare.textContent="選択した國を比較する";bar.append(compare);compare.addEventListener("click",()=>{const selected=$$('input[type=checkbox]:checked',directory);if(selected.length!==2){say("比較する國を二つ選んでください");return}const names=selected.map(x=>x.closest(".country-card"));const box=document.createElement("div");box.className="ix-modal";box.innerHTML='<section class="ix-dialog" role="dialog" aria-modal="true"><div class="ix-dialog-head"><h2>國別資料　比較覽</h2><button type="button">閉じる ×</button></div><table class="ix-compare-table"><tbody><tr><th>比較項目</th><td>'+names[0].querySelector(".country-name").textContent+'</td><td>'+names[1].querySelector(".country-name").textContent+'</td></tr><tr><th>英語名</th><td>'+names[0].querySelector(".en")?.textContent+'</td><td>'+names[1].querySelector(".en")?.textContent+'</td></tr><tr><th>概要</th><td>'+names[0].querySelector("p")?.textContent+'</td><td>'+names[1].querySelector("p")?.textContent+'</td></tr><tr><th>資料</th><td><a href="'+names[0].href+'">國別資料を開く ↗</a></td><td><a href="'+names[1].href+'">國別資料を開く ↗</a></td></tr></tbody></table></section>';document.body.append(box);box.querySelector("button").addEventListener("click",()=>box.remove());box.addEventListener("click",e=>{if(e.target===box)box.remove()})})}
const revealTargets=$$("main section,main .wrap,main .dpx-atlas,main .country-card,main .dispatch,main .pillar");if("IntersectionObserver"in window&&!reduced){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("ix-reveal","ix-in");io.unobserve(e.target)}}),{threshold:.08,rootMargin:"0px 0px -35px 0px"});revealTargets.forEach(el=>{if(!el.classList.contains("reveal"))io.observe(el)})}
const hero=$(".hero-visual .globe");if(hero&&!reduced&&matchMedia("(pointer:fine)").matches){const area=$(".hero-visual");area.addEventListener("pointermove",e=>{const r=area.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hero.style.transform="rotateX("+(-y*9)+"deg) rotateY("+(x*12)+"deg) translateY(-3px)"});area.addEventListener("pointerleave",()=>hero.style.transform="")}
if(!inside&&file==="index"){
 const ids=["home","about","news","reading-room","duties","protocol","relations","access"];
 const labels=["本庁舎","萬國外交廳について","公報・告示","文書閲覧室","主な仕事","外交通信網","萬國全圖","お問い合わせ"];
 const rail=document.createElement("nav");rail.className="ix-chapter-rail";rail.setAttribute("aria-label","本庁舎内の章へ移動");
 rail.innerHTML=ids.map((id,i)=>'<a href="#'+id+'" aria-label="'+labels[i]+'" title="'+labels[i]+'"><span>'+String(i+1).padStart(2,"0")+'　'+labels[i]+'</span></a>').join("");
 document.body.append(rail);
 const links=$("a",rail),sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
 if("IntersectionObserver"in window){const active=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const n=ids.indexOf(e.target.id);links.forEach((a,i)=>{if(i===n)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current")})}}),{rootMargin:"-38% 0px -48% 0px",threshold:0});sections.forEach(s=>active.observe(s))}
 const globe=$(".ix-hero .globe");if(globe){globe.setAttribute("role","button");globe.setAttribute("tabindex","0");globe.setAttribute("aria-label","萬國外交の意匠。選択すると回転します");const spin=()=>{globe.classList.toggle("ix-spun");say(globe.classList.contains("ix-spun")?"世界圖を巡覧しています":"世界圖の回転を止めました")};globe.addEventListener("click",spin);globe.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();spin()}})}
}

/* Searchable public-document reading room on the ministry home page */
const readingRoom=$("#ix-record-grid");
if(readingRoom){
 const records=$(".ix-record",readingRoom),searchInput=$("#ix-record-search"),count=$("#ix-record-count"),filterButtons=$("[data-record-filter]");
 let activeFilter="all",query="";
 const normalize=s=>String(s||"").normalize("NFKC").toLocaleLowerCase().replace(/[\\s　・／/_.-]+/g,"");
 function applyRecordFilters(){
  let visible=0;
  records.forEach(card=>{
   const categoryOK=activeFilter==="all"||card.dataset.recordCategory===activeFilter;
   const haystack=normalize(card.dataset.recordSearch+" "+card.textContent);
   const searchOK=!query||haystack.includes(normalize(query));
   const show=categoryOK&&searchOK;card.hidden=!show;if(show)visible++;
  });
  count.textContent="公開案内　"+visible+"件";
  filterButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.recordFilter===activeFilter)));
 }
 filterButtons.forEach(button=>button.addEventListener("click",()=>{activeFilter=button.dataset.recordFilter;applyRecordFilters()}));
 if(searchInput)searchInput.addEventListener("input",()=>{query=searchInput.value.trim();applyRecordFilters()});
 $(".ix-record-open",readingRoom).forEach(button=>button.addEventListener("click",()=>{
  const card=button.closest(".ix-record"),detail=$(".ix-record-detail",card),open=button.getAttribute("aria-expanded")!=="true";
  button.setAttribute("aria-expanded",String(open));detail.hidden=!open;
  button.firstChild.textContent=open?"概要を閉じる ":"概要をひらく ";
 }));
 applyRecordFilters();
}
/* Imperial page-turn navigation: one continuous volume across the ministry */
const turnKey="ix-page-turn-arrival";
function makeTurn(mode){
 let layer=document.querySelector(".ix-page-turn");
 if(!layer){layer=document.createElement("div");layer.className="ix-page-turn";layer.setAttribute("aria-hidden","true");layer.innerHTML='<div class="ix-book-leaf"><div class="ix-leaf-front"><span class="ix-leaf-kicker">IMPERIAL DIPLOMATIC ARCHIVE</span><span class="ix-leaf-mark">萬</span><span class="ix-leaf-caption">萬國外交廳</span><i></i></div><div class="ix-leaf-back"><span>日ノ本帝國</span><b>萬國外交廳</b><small>WORLD · DIPLOMACY · ARCHIVE</small></div></div>';document.body.append(layer)}
 layer.classList.remove("ix-turn-out","ix-turn-in");void layer.offsetWidth;layer.classList.add(mode==="in"?"ix-turn-in":"ix-turn-out");return layer;
}
if(!reduced){
 let arriving=false;try{arriving=sessionStorage.getItem(turnKey)==="1";if(arriving)sessionStorage.removeItem(turnKey)}catch{}
 if(arriving){const layer=makeTurn("in");setTimeout(()=>layer.remove(),780)}
 document.addEventListener("click",e=>{
  const a=e.target.closest("a[href]");if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==="_blank"||a.hasAttribute("download"))return;
  let dest;try{dest=new URL(a.href,location.href)}catch{return}
  if(dest.origin!==location.origin||a.href.startsWith("javascript:")||a.hasAttribute("data-no-turn"))return;
  const samePage=dest.pathname===location.pathname&&dest.search===location.search;
  if(samePage&&!dest.hash)return;
  if(samePage&&dest.hash){
   const target=document.getElementById(decodeURIComponent(dest.hash.slice(1)));if(!target)return;
   e.preventDefault();const layer=makeTurn("out");
   setTimeout(()=>{history.pushState(null,"",dest.hash);target.scrollIntoView({behavior:"smooth",block:"start"});layer.classList.remove("ix-turn-out");layer.classList.add("ix-turn-in");setTimeout(()=>layer.remove(),760)},430);
   return;
  }
  e.preventDefault();try{sessionStorage.setItem(turnKey,"1")}catch{}
  makeTurn("out");setTimeout(()=>{location.href=dest.href},620);
 },true);
}

document.body.classList.add("ix-shell");if(file==="index"&&!inside)document.body.classList.add("ix-home");
})();