/* 萬國外交廳 — Search, atlas, local bookmarks and navigation */
(()=>{
 "use strict";
 const $=(s,r=document)=>r.querySelector(s);
 const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 const safeRead=(key,fallback)=>{try{const v=localStorage.getItem(key);return v===null?fallback:v}catch{return fallback}};
 const safeWrite=(key,value)=>{try{localStorage.setItem(key,value);return true}catch{return false}};
 const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const countries=[
  {id:"ou",name:"央國",region:"北央大陸",group:"north",en:"United States of Center",icon:"央",url:"countries/ou.html",keywords:"北央大陸 北央"},
  {id:"koumu",name:"紅霧國",region:"欧州北西部",group:"europe",en:"United Kingdom of Great Scarlet and Fog",icon:"霧",url:"countries/koumu.html",keywords:"ヨーロッパ 欧州 北西部"},
  {id:"fuyou",name:"芙蓉國",region:"欧州",group:"europe",en:"Hibiscus Republic",icon:"芙",url:"countries/fuyou.html",keywords:"ヨーロッパ 欧州"},
  {id:"kinsou",name:"琴奏國",region:"中歐",group:"europe",en:"Melodia Duchy / Duchy of Cithara",icon:"琴",url:"countries/kinsou.html",keywords:"中欧 音楽 芸術"},
  {id:"ruren",name:"留廉伯",region:"中歐",group:"europe",en:"Grand Duchy of Luremburg / Republic of Luremburg",icon:"留",url:"countries/ruren.html",keywords:"中欧 欧州"},
  {id:"ibara",name:"竜棘國",region:"東歐",group:"europe",en:"Roseria",icon:"棘",url:"countries/ibara.html",keywords:"東欧 欧州"},
  {id:"shinbu",name:"神武國",region:"南歐",group:"europe",en:"Arms Republic",icon:"神",url:"countries/shinbu.html",keywords:"南欧 欧州"}
 ];
 const sections=[
  {title:"本庁舎",desc:"萬國外交廳トップ",url:"#home",keys:"トップ ホーム 外交庁"},
  {title:"萬國外交廳について",desc:"組織の概要・基本情報",url:"#about",keys:"概要 組織 長官 本庁舎"},
  {title:"お知らせ・報道発表",desc:"公報分類・制度案内",url:"#news",keys:"お知らせ 公報 告示 報道 資料"},
  {title:"主な仕事",desc:"国交・条約・使節・領事",url:"#duties",keys:"職務 条約 国交 領事 使節"},
  {title:"外交通信のデモ表示",desc:"演出用の通信端末",url:"#protocol",keys:"電信 暗号 通信 端末"},
  {title:"国際関係・世界の国・地域",desc:"国別資料の索引・検索",url:"#relations",keys:"国際関係 国 地域 国別資料"},
  {title:"お問い合わせ・関係機関",desc:"本庁舎と関係機関への案内",url:"#access",keys:"問い合わせ 連絡 関係機関"},
  {title:"外交網地誌",desc:"国別資料接続図・絞り込み",url:"#relations",keys:"地図 接続図 国別資料"}
 ];
 const norm=s=>String(s||"").normalize("NFKC").toLocaleLowerCase().replace(/[\s　・／/_.-]+/g,"");
 let noticeTimer;
 function notify(message){
  const el=$("#toast");if(!el)return;
  el.textContent=message;el.classList.remove("show");void el.offsetWidth;el.classList.add("show");
  clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.classList.remove("show"),2600);
 }
 function addProgress(){
  const bar=document.createElement("div");bar.className="dpx-progress";bar.setAttribute("aria-hidden","true");bar.innerHTML="<span></span>";document.body.prepend(bar);
  const fill=$("span",bar);let scheduled=false;
  const update=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;fill.style.transform="scaleX("+ (max>0?window.scrollY/max:0)+")";scheduled=false};
  const request=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}};
  window.addEventListener("scroll",request,{passive:true});window.addEventListener("resize",request);update();
 }
 function addBackTop(){
  const button=document.createElement("button");button.className="dpx-back-top";button.type="button";button.setAttribute("aria-label","ページの先頭へ戻る");button.title="ページの先頭へ";button.textContent="↑";document.body.append(button);
  const update=()=>button.classList.toggle("is-visible",window.scrollY>520);
  window.addEventListener("scroll",update,{passive:true});update();
  button.addEventListener("click",()=>window.scrollTo({top:0,behavior:reduced?"auto":"smooth"}));
 }
 function addAgencyLinks(){
  const footer=$(".footer-top");if(!footer)return;
  const first=$(".footer-top>div:first-child",footer);if(!first||$(".footer-agencies",first))return;
  const wrap=document.createElement("div");wrap.className="footer-agencies";
  wrap.innerHTML='<a href="https://8fgb66gmt2-stack.github.io/-web-Shikicho/">四季廳 ↗</a><a href="https://8fgb66gmt2-stack.github.io/-Bungeicho-offical-web-site-/">文藝廳 ↗</a><a href="https://8fgb66gmt2-stack.github.io/-Imperial-Meteorological-Observatory-official-web-site/">気象観測院 ↗</a>';
  first.append(wrap);
 }
 function initAgencyNetwork(){
  const nav=$(".nav");if(!nav)return;
  const row=document.createElement("nav");row.className="agency-network";row.setAttribute("aria-label","日ノ本帝國の中央行政機関");
  row.innerHTML='<span class="agency-network-title">日ノ本帝國　中央行政機関の公式案内</span><a href="https://8fgb66gmt2-stack.github.io/-web-Shikicho/">四季廳 <small>帝都統括</small> ↗</a><a href="https://8fgb66gmt2-stack.github.io/-Bungeicho-offical-web-site-/">文藝廳 <small>文藝行政</small> ↗</a><span class="current-office" aria-current="page">萬國外交廳 <small>現在表示中</small></span><a href="https://8fgb66gmt2-stack.github.io/-Imperial-Meteorological-Observatory-official-web-site/">気象觀測院 <small>気象観測</small> ↗</a>';
  nav.insertAdjacentElement("afterend",row);
 }
 function initNavTracking(){
  const links=$$(".nav a[href^='#']");
  if(!("IntersectionObserver" in window)||!links.length)return;
  const targets=links.map(link=>$(link.getAttribute("href"))).filter(Boolean);
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    links.forEach(link=>{if(link.getAttribute("href")==="#"+entry.target.id){link.setAttribute("aria-current","location")}else if(link.getAttribute("aria-current")==="location"){link.removeAttribute("aria-current")}});
   });
  },{rootMargin:"-25% 0px -65% 0px",threshold:0});
  targets.forEach(target=>observer.observe(target));
 }
 function initAtlas(){
  const root=$("#relations");if(!root)return;
  let selected="ou",filter="all",query="";
  const list=$("#dpx-country-grid",root),nodes=$$(".dpx-node",root),cards=$$(".dpx-country-card",root),filters=$$(".dpx-filter",root);
  const name=$("#dpx-dossier-name",root),en=$("#dpx-dossier-en",root),region=$("#dpx-dossier-region",root),idText=$("#dpx-dossier-id",root),link=$("#dpx-open-dossier",root),save=$("#dpx-save-country",root),count=$("#dpx-result-count",root),search=$("#dpx-atlas-search",root),savedKey="hinomoto.diplomacy.bookmarks.v1";
  const isSaved=id=>{try{return JSON.parse(safeRead(savedKey,"[]")).includes(id)}catch{return false}};
  function filtered(c){
   const regionOK=filter==="all"||(filter==="north"?c.group==="north":filter==="europe"?c.group==="europe":c.region===filter);
   const text=norm([c.name,c.region,c.en,c.keywords].join(" "));
   return regionOK&&(!query||text.includes(norm(query)));
  }
  function renderFilter(){
   let shown=0;
   countries.forEach(c=>{
    const visible=filtered(c);const card=$('[data-country-card="'+c.id+'"]',root);const node=$('[data-country-node="'+c.id+'"]',root);
    if(card)card.hidden=!visible;
    if(node)node.hidden=!visible;
    if(visible)shown++;
   });
   count.textContent=shown+" 件の資料";
   let empty=$("#dpx-no-results",root);
   if(!shown){if(!empty){empty=document.createElement("div");empty.id="dpx-no-results";empty.className="dpx-no-results";empty.textContent="該当する国別資料はありません。検索語や地域を変更してください。";list.append(empty)}}
   else if(empty)empty.remove();
   filters.forEach(button=>button.setAttribute("aria-pressed",button.dataset.filter===filter?"true":"false"));
   const current=countries.find(c=>c.id===selected);
   if(current&&!filtered(current)){
    const first=countries.find(filtered);
    if(first)select(first.id);
   }
  }
  function renderSavedState(){
   if(!save)return;
   const saved=isSaved(selected);
   save.setAttribute("aria-pressed",saved?"true":"false");
   save.innerHTML=saved?"<span aria-hidden='true'>★</span> 栞から外す":"<span aria-hidden='true'>☆</span> 外交の栞に保存";
  }
  function select(id){
   const c=countries.find(item=>item.id===id);if(!c)return;
   selected=id;
   if(name)name.textContent=c.name;
   if(en)en.textContent=c.en;
   if(region)region.textContent=c.region;
   if(idText)idText.textContent="DOSSIER / "+String(countries.indexOf(c)+1).padStart(2,"0");
   if(link)link.href=c.url;
   nodes.forEach(node=>node.setAttribute("aria-pressed",node.dataset.countryNode===id?"true":"false"));
   renderSavedState();
  }
  nodes.forEach(node=>node.addEventListener("click",()=>select(node.dataset.countryNode)));
  cards.forEach(card=>card.addEventListener("click",event=>{
   if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   select(card.dataset.countryCard);
  }));
  filters.forEach(button=>button.addEventListener("click",()=>{filter=button.dataset.filter;renderFilter()}));
  if(search)search.addEventListener("input",()=>{query=search.value.trim();renderFilter()});
  if(save)save.addEventListener("click",()=>{
   let arr;try{arr=JSON.parse(safeRead(savedKey,"[]"));if(!Array.isArray(arr))arr=[]}catch{arr=[]}
   if(arr.includes(selected)){arr=arr.filter(id=>id!==selected);notify("外交の栞から外しました")}
   else{arr.unshift(selected);arr=Array.from(new Set(arr)).slice(0,50);notify("外交の栞に保存しました")}
   if(!safeWrite(savedKey,JSON.stringify(arr))){notify("このブラウザでは栞を保存できませんでした");return}
   renderSavedState();
  });
  renderFilter();select(selected);
 }
 function createCommandPalette(){
  const trigger=$("[data-command-open]");if(!trigger)return;
  const backdrop=document.createElement("div");backdrop.className="dpx-command-backdrop";backdrop.hidden=true;backdrop.id="dpx-command-backdrop";
  backdrop.innerHTML='<section class="dpx-command" role="dialog" aria-modal="true" aria-labelledby="dpx-command-title" tabindex="-1"><div class="dpx-command-head"><h2 id="dpx-command-title">外交廳　資料索引</h2><button type="button" class="dpx-modal-close" data-command-close>閉じる ×</button></div><p class="dpx-command-note">国名・地域・職務・公報を横断して検索できます。</p><label class="dpx-command-search"><input type="search" autocomplete="off" spellcheck="false" placeholder="例：琴奏國 / 条約 / 中欧" aria-label="外交廳サイト内を検索" data-command-input></label><div class="dpx-command-results" data-command-results></div><div class="dpx-command-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> 選択</span><span><kbd>↵</kbd> 開く</span><span><kbd>Esc</kbd> 閉じる</span></div></section>';
  document.body.append(backdrop);
  const input=$("[data-command-input]",backdrop),results=$("[data-command-results]",backdrop),closeButton=$("[data-command-close]",backdrop);
  const items=sections.concat(countries.map(c=>({title:c.name,desc:c.region+"　／　"+c.en,url:c.url,keys:c.keywords+" "+c.id,icon:c.icon,country:true})));
  let active=0,shown=[],returnFocus=null;
  const close=()=>{backdrop.hidden=true;document.body.style.overflow="";if(returnFocus&&returnFocus.focus)returnFocus.focus();returnFocus=null};
  function open(){
   returnFocus=document.activeElement;backdrop.hidden=false;document.body.style.overflow="hidden";input.value="";render();input.focus();
  }
  function go(item){
   if(!item)return;
   close();
   if(item.url.startsWith("#")){const target=$(item.url);if(target){history.replaceState(null,"",item.url);target.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});}}
   else location.href=item.url;
  }
  function render(){
   const q=norm(input.value);
   shown=items.filter(item=>!q||norm([item.title,item.desc,item.keys||""].join(" ")).includes(q)).slice(0,20);
   active=Math.min(active,Math.max(0,shown.length-1));
   if(!shown.length){results.innerHTML='<div class="dpx-command-empty">該当する項目がありません。別の言葉で検索してください。</div>';return}
   results.innerHTML=shown.map((item,i)=>'<button type="button" class="dpx-command-result" data-result="'+i+'" aria-selected="'+(i===active?'true':'false')+'"><span class="dpx-command-icon">'+esc(item.icon||(item.country?"国":"頁"))+'</span><span><strong>'+esc(item.title)+'</strong><small>'+esc(item.desc)+'</small></span><kbd>'+(item.country?"↗":"開く")+'</kbd></button>').join("");
   $$("[data-result]",results).forEach(button=>button.addEventListener("mouseenter",()=>{active=Number(button.dataset.result);markActive()}));
   $$("[data-result]",results).forEach(button=>button.addEventListener("click",()=>go(shown[Number(button.dataset.result)])));
  }
  function esc(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function markActive(){
   $$("[data-result]",results).forEach((button,i)=>button.setAttribute("aria-selected",i===active?"true":"false"));
   const button=$('[data-result="'+active+'"]',results);if(button)button.scrollIntoView({block:"nearest"});
  }
  $$("[data-command-open]").forEach(button=>button.addEventListener("click",open));
  closeButton.addEventListener("click",close);
  backdrop.addEventListener("click",event=>{if(event.target===backdrop)close()});
  input.addEventListener("input",()=>{active=0;render()});
  input.addEventListener("keydown",event=>{
   if(event.key==="ArrowDown"){event.preventDefault();active=Math.min(active+1,shown.length-1);markActive()}
   else if(event.key==="ArrowUp"){event.preventDefault();active=Math.max(0,active-1);markActive()}
   else if(event.key==="Enter"){event.preventDefault();go(shown[active])}
   else if(event.key==="Escape"){event.preventDefault();close()}
  });
  backdrop.addEventListener("keydown",event=>{
   if(event.key==="Escape"){event.preventDefault();close();return}
   if(event.key!=="Tab")return;
   const focusable=$$("button,input,[tabindex='0']",backdrop).filter(el=>!el.disabled&&el.getClientRects().length);
   if(!focusable.length)return;
   const first=focusable[0],last=focusable[focusable.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
  document.addEventListener("keydown",event=>{
   if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();if(backdrop.hidden)open();else close();return}
   if(event.key==="/"&&!event.metaKey&&!event.ctrlKey&&!event.altKey&&backdrop.hidden){
    const t=event.target;if(t instanceof HTMLElement&&(/INPUT|TEXTAREA|SELECT/.test(t.tagName)||t.isContentEditable))return;
    event.preventDefault();open();
   }
  });
  const searchButton=$("[data-command-shortcut]");
  if(searchButton)searchButton.textContent=navigator.platform&&/Mac|iPhone|iPad/.test(navigator.platform)?"⌘ K":"Ctrl K";
 }
 function createBookmarksDialog(){
  const trigger=$("[data-bookmarks-open]");if(!trigger)return;
  const backdrop=document.createElement("div");backdrop.className="dpx-bookmark-backdrop";backdrop.hidden=true;backdrop.id="dpx-bookmark-backdrop";
  backdrop.innerHTML='<section class="dpx-bookmark-dialog" role="dialog" aria-modal="true" aria-labelledby="dpx-bookmark-title" tabindex="-1"><div class="dpx-bookmark-head"><h2 id="dpx-bookmark-title">外交の栞</h2><button type="button" class="dpx-modal-close" data-bookmark-close>閉じる ×</button></div><div data-bookmark-list class="dpx-bookmark-list"></div><div class="dpx-bookmark-foot">栞はこのブラウザ内に保存されます。ほかの端末との同期は行いません。</div></section>';
  document.body.append(backdrop);
  const list=$("[data-bookmark-list]",backdrop);let returnFocus=null;
  function render(){
   let ids;try{ids=JSON.parse(safeRead("hinomoto.diplomacy.bookmarks.v1","[]"));if(!Array.isArray(ids))ids=[]}catch{ids=[]}
   const valid=ids.map(id=>countries.find(c=>c.id===id)).filter(Boolean);
   if(!valid.length){list.innerHTML='<p class="dpx-bookmark-empty">まだ栞はありません。国別資料接続図から資料を選び、「外交の栞に保存」を押してください。</p>';return}
   list.innerHTML=valid.map(c=>'<div class="dpx-bookmark-item"><div><a href="'+c.url+'">'+c.name+'　↗</a><small>'+c.region+'　／　'+c.en+'</small></div><button type="button" data-bookmark-remove="'+c.id+'">栞から外す</button></div>').join("");
   $$("[data-bookmark-remove]",list).forEach(button=>button.addEventListener("click",()=>{
    const key="hinomoto.diplomacy.bookmarks.v1";let arr;try{arr=JSON.parse(safeRead(key,"[]"))}catch{arr=[]}
    safeWrite(key,JSON.stringify(arr.filter(id=>id!==button.dataset.bookmarkRemove)));render();notify("外交の栞を更新しました");
   }));
  }
  function close(){backdrop.hidden=true;document.body.style.overflow="";if(returnFocus&&returnFocus.focus)returnFocus.focus();returnFocus=null}
  function open(){returnFocus=document.activeElement;render();backdrop.hidden=false;document.body.style.overflow="hidden";$("[data-bookmark-close]",backdrop).focus()}
  $$("[data-bookmarks-open]").forEach(button=>button.addEventListener("click",open));
  $("[data-bookmark-close]",backdrop).addEventListener("click",close);
  backdrop.addEventListener("click",event=>{if(event.target===backdrop)close()});
  backdrop.addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();close()}});
 }
 function initSkipAndMeta(){
  const main=$("main");if(main&&!main.id)main.id="main";
  if(!$(".skip-link")){const a=document.createElement("a");a.className="skip-link";a.href="#main";a.textContent="本文へ";document.body.prepend(a)}
  const links=$$(".nav a[href^='#']");
  links.forEach(link=>{if(link.getAttribute("href")==="#home")link.setAttribute("aria-label","本庁舎・トップへ")});
 }
 function initLegacyMotion(){
  const toggle=$("#motion-toggle");if(!toggle)return;
  let enabled=!reduced;
  document.body.classList.toggle("dpx-motion-off",!enabled);
  toggle.textContent="動作演出："+(enabled?"有効":"抑制");
  toggle.addEventListener("click",()=>{enabled=!enabled;document.body.classList.toggle("dpx-motion-off",!enabled);toggle.textContent="動作演出："+(enabled?"有効":"抑制");notify(enabled?"動作演出を有効にしました":"動作演出を抑制しました")});
 }
 function setupArchiveDialog(){
  const modal=$("#archive-modal"),trigger=$("#archive-trigger"),close=$("#modal-close"),reveal=$("#archive-reveal");
  if(!modal||!trigger||!close||!reveal)return;
  let returnFocus=null;
  function closeModal(){modal.classList.remove("open");if(returnFocus&&returnFocus.focus)returnFocus.focus();returnFocus=null}
  trigger.addEventListener("click",()=>{returnFocus=document.activeElement;modal.classList.add("open");close.focus()});
  close.addEventListener("click",closeModal);
  modal.addEventListener("click",event=>{if(event.target===modal)closeModal()});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&modal.classList.contains("open"))closeModal()});
  reveal.addEventListener("click",()=>{const extra=$("#archive-extra"),message=$("#archive-message");if(extra)extra.hidden=false;if(message)message.textContent="封印解除を確認しました。記録の出典は未登録のため、引き続き照合が必要です。";reveal.textContent="封印解除済み";reveal.disabled=true;notify("封印記録を開示しました")});
 }
 function initPlaceholders(){
  $$("[data-placeholder]").forEach(a=>a.addEventListener("click",event=>{event.preventDefault();notify(a.dataset.placeholder+"：接続先は未設定です")}));
 }
 function initTelegraph(){
  const button=$("#handshake"),lines=$("#terminal-lines"),status=$("#net-status");if(!button||!lines||!status)return;
  let active=false;
  button.addEventListener("click",()=>{
   if(active)return;active=true;button.disabled=true;status.textContent="● 照合中";status.style.color="#d9c58a";lines.replaceChildren();
   const messages=[["[INIT]","外交通信端末を起動"],["[AUTH]","公開サイト内の演出端末と確認"],["[ROUTE]","政府内部のネットワークには接続しません"],["[CHECK]","公開目録の整合性を確認"],["[DONE]","確認完了：表示上の演出です"]];
   messages.forEach((item,index)=>window.setTimeout(()=>{
    const row=document.createElement("div"),key=document.createElement("span"),value=document.createElement("span");row.className="terminal-line";key.textContent=item[0];value.textContent=item[1];row.append(key,value);lines.append(row);
    if(index===messages.length-1){status.textContent="● 照合完了";status.style.color="#b8d2a0";active=false;button.disabled=false}
   },350*(index+1)));
  });
 }
 function initReveal(){
  if(!("IntersectionObserver" in window)||reduced){$$(".reveal").forEach(el=>el.classList.add("visible"));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.1});
  $$(".reveal").forEach(el=>observer.observe(el));
 }
 document.addEventListener("DOMContentLoaded",()=>{});
 initSkipAndMeta();addProgress();addBackTop();initAgencyNetwork();addAgencyLinks();initNavTracking();initAtlas();createCommandPalette();createBookmarksDialog();initReveal();
})();