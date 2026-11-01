/* 萬國外交廳 — Search, atlas, local bookmarks and navigation */
(()=>{
 "use strict";
 const $=(s,r=document)=>r.querySelector(s);
 const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 const safeRead=(key,fallback)=>{try{const v=localStorage.getItem(key);return v===null?fallback:v}catch{return fallback}};
 const safeWrite=(key,value)=>{try{localStorage.setItem(key,value);return true}catch{return false}};
 const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const countries=[
  {id:"ou",name:"央國",region:"北央大陸",group:"north",en:"United States of Center",icon:"央",url:"countries/ou.html",keywords:"北央大陸 連邦共和制 央都セントラル 情報通信 宇宙開発 航空宇宙 連邦大統領"},
  {id:"koumu",name:"紅霧國",region:"歐州北西部",group:"europe",en:"United Kingdom of Great Scarlet and Fog",icon:"霧",url:"countries/koumu.html",keywords:"欧州北西部 立憲君主制 霧都グレイヴェル 女王 王室 貴族 海軍 陽の沈まぬ國"},
  {id:"fuyou",name:"芙蓉國",region:"歐州",group:"europe",en:"Hibiscus Republic",icon:"芙",url:"countries/fuyou.html",keywords:"欧州 共和制 自由都リベルテ 革命 芸術 文学 美術 建築 服飾 哲学 大統領"},
  {id:"kinsou",name:"琴奏國",region:"中歐",group:"europe",en:"Melodia Duchy / Duchy of Cithara",icon:"琴",url:"countries/kinsou.html",keywords:"中欧 立憲君主制公国 王都ヴィオレッタ 宮廷音楽 歌劇 音響学 芳辰浪漫 琴奏大公"},
  {id:"ruren",name:"留廉伯",region:"中歐",group:"europe",en:"Republic of Luremburg",icon:"留",url:"countries/ruren.html",keywords:"中欧 連邦共和制 鐵都アイゼンシュタット 機械工学 化学 電子工学 航空技術 連邦大統領"},
  {id:"ibara",name:"竜棘國",region:"東歐",group:"europe",en:"Roseria",icon:"棘",url:"countries/ibara.html",keywords:"東欧 立憲公国 王都トゥルゴヴィシュテ ヴラド三世公 ミフネ悪党公 ドラキュシュティ家 神祇 祭祀 同盟"},
  {id:"shinbu",name:"神武國",region:"南歐",group:"europe",en:"Arms Republic",icon:"神",url:"countries/shinbu.html",keywords:"南欧 共和制 聖都アステリア 神話学 古典哲学 神学 形而上学 大統領"},
  {id:"ginkan",name:"銀冠國",region:"中歐",group:"europe",en:"Kingdom of the Silver Crown",icon:"銀",url:"countries/ginkan.html",keywords:"中歐 ハンガリー マーチャーシュ1世 マティアス1世 ヴラド3世"},
  {id:"suikyu",name:"翠丘國",region:"東歐",group:"europe",en:"Principality of Suikyū",icon:"翠",url:"countries/suikyu.html",keywords:"東歐 モルドヴァ モルダヴィア シュテファン3世 ステファン3世 ヴラド3世 共和制公國"},
  {id:"kouyou",name:"煌耀皇國",region:"東歐・西亞",group:"europe",en:"Radiant Imperial State of Kouyou",icon:"耀",url:"countries/kouyou.html",keywords:"東歐 西亞 オスマン帝国 スルタン メフメト2世 トルコ 煌耀"},
  {id:"mitian",name:"美天國",region:"東方大陸",group:"east",en:"The Celestial Empire of Mitian",icon:"美",url:"countries/mitian.html",keywords:"東方大陸 皇京 ホァンキン 皇帝 帝國 王朝 古典学術 先端科学技術 情報通信 量子計算 医工学 大河 海洋交易 日ノ本帝國 友好國"}
 ];
 const sections=[
  {title:"本庁舎",desc:"萬國外交廳トップ",url:"#home",keys:"トップ ホーム 外交庁"},
  {title:"萬國外交廳について",desc:"組織の概要・基本情報",url:"#about",keys:"概要 組織 長官 本庁舎"},
  {title:"お知らせ・報道発表",desc:"公報分類・制度案内",url:"#news",keys:"お知らせ 公報 告示 報道 資料"},
  {title:"主な仕事",desc:"国交・条約・使節・領事",url:"#duties",keys:"職務 条約 国交 領事 使節"},
  {title:"外交通信網",desc:"外交電信局・通信経路照会",url:"#protocol",keys:"電信 暗号 通信 端末"},
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
   const regionOK=filter==="all"||(filter==="north"?c.group==="north":filter==="europe"?c.group==="europe":filter==="east"?c.group==="east":c.region.split("・").includes(filter));
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
   const map=$("#dpx-world-map",root);
   if(map){
    $(".dpx-country-territories .territory",map).forEach(shape=>shape.classList.toggle("is-selected",shape.classList.contains("territory-"+id)));
    const activeNode=$('[data-country-node="'+id+'"]',map);
    if(activeNode)activeNode.setAttribute("aria-current","true");
    nodes.filter(node=>node.dataset.countryNode!==id).forEach(node=>node.removeAttribute("aria-current"));
   }
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
  const initialNode=$('[data-country-node="'+selected+'"]',root);
  if(initialNode)initialNode.setAttribute("aria-current","true");
 }
 function createCommandPalette(){
  const trigger=$("[data-command-open]");if(!trigger)return;
  const backdrop=document.createElement("div");backdrop.className="dpx-command-backdrop";backdrop.hidden=true;backdrop.id="dpx-command-backdrop";
  backdrop.innerHTML='<section class="dpx-command" role="dialog" aria-modal="true" aria-labelledby="dpx-command-title" tabindex="-1"><div class="dpx-command-head"><h2 id="dpx-command-title">外交廳　資料索引</h2><button type="button" class="dpx-modal-close" data-command-close>閉じる ×</button></div><p class="dpx-command-note">国名・地域・職務・公報を横断して検索できます。</p><label class="dpx-command-search"><input type="search" autocomplete="off" spellcheck="false" placeholder="例：琴奏國 / 条約 / 中欧" aria-label="外交行政資料を検索" data-command-input></label><div class="dpx-command-results" data-command-results></div><div class="dpx-command-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> 選択</span><span><kbd>↵</kbd> 開く</span><span><kbd>Esc</kbd> 閉じる</span></div></section>';
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
  toggle.textContent="画面効果："+(enabled?"有効":"抑制");
  toggle.addEventListener("click",()=>{enabled=!enabled;document.body.classList.toggle("dpx-motion-off",!enabled);toggle.textContent="画面効果："+(enabled?"有効":"抑制");notify(enabled?"画面効果を有効にしました":"画面効果を抑制しました")});
 }
 function initTelegraph(){
  const button=$("#handshake"),lines=$("#terminal-lines"),status=$("#net-status");if(!button||!lines||!status)return;
  let active=false;
  button.addEventListener("click",()=>{
   if(active)return;active=true;button.disabled=true;status.textContent="● 照合中";status.style.color="#d9c58a";lines.replaceChildren();
   const messages=[["[INIT]","外交通信端末を起動"],["[AUTH]","公開回線の認証を確認"],["[ROUTE]","本廳公開電信局へ接続"],["[CHECK]","送受信経路の安全を照合"],["[DONE]","接続確認完了：公開回線"]];
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

 function initWorldMapControls(){
  const map=$("#dpx-world-map"),layer=$("#dpx-world-layer");if(!map||!layer)return;
  const panel=map.closest(".dpx-map-panel"),controls=panel||map,zoomLabel=$("#dpx-map-zoom-label");
  let zoom=1,routes=true,labels=false,sea=false,borders=true,relief=true;
  layer.classList.add("labels-off");
  const applyZoom=()=>{
   layer.style.setProperty("--dpx-zoom",zoom);
   layer.style.transform="scale("+zoom+")";
   if(zoomLabel)zoomLabel.value=Math.round(zoom*100)+"%";
  };
  const setToggle=(selector,className,value,label,on,off)=>{
   const button=$(selector,controls);if(!button)return;
   layer.classList.toggle(className,!value);
   button.setAttribute("aria-pressed",String(value));
   button.textContent=label+"："+(value?on:off);
  };
  Array.from(controls.querySelectorAll("[data-map-zoom]")).forEach(button=>button.addEventListener("click",()=>{
   zoom=Math.max(.8,Math.min(1.7,Math.round((zoom+(button.dataset.mapZoom==="in"?.15:-.15))*100)/100));
   applyZoom();
  }));
  $("[data-map-reset]",controls)?.addEventListener("click",()=>{
   zoom=1;routes=true;labels=false;sea=false;borders=true;relief=true;
   layer.classList.remove("routes-off","borders-off","relief-off");layer.classList.add("labels-off");
   panel?.classList.remove("sea-chart");
   setToggle("[data-map-routes]","routes-off",routes,"航路","表示","非表示");
   setToggle("[data-map-labels]","labels-off",labels,"地名","表示","非表示");
   setToggle("[data-map-borders]","borders-off",borders,"國境","表示","非表示");
   setToggle("[data-map-relief]","relief-off",relief,"地勢","表示","非表示");
   const mode=$("[data-map-mode]",controls);
   mode?.setAttribute("aria-pressed","false");
   if(mode)mode.textContent="海圖モード";
   applyZoom();notify("萬國全圖を初期表示に戻しました");
  });
  $("[data-map-routes]",controls)?.addEventListener("click",()=>{
   routes=!routes;setToggle("[data-map-routes]","routes-off",routes,"航路","表示","非表示");
  });
  $("[data-map-labels]",controls)?.addEventListener("click",()=>{
   labels=!labels;setToggle("[data-map-labels]","labels-off",labels,"地名","表示","非表示");
  });
  $("[data-map-borders]",controls)?.addEventListener("click",()=>{
   borders=!borders;setToggle("[data-map-borders]","borders-off",borders,"國境","表示","非表示");
  });
  $("[data-map-relief]",controls)?.addEventListener("click",()=>{
   relief=!relief;setToggle("[data-map-relief]","relief-off",relief,"地勢","表示","非表示");
  });
  $("[data-map-mode]",controls)?.addEventListener("click",event=>{
   sea=!sea;panel?.classList.toggle("sea-chart",sea);
   event.currentTarget.setAttribute("aria-pressed",String(sea));
   event.currentTarget.textContent=sea?"羊皮紙モード":"海圖モード";
  });
  $("[data-imperial-node]",map)?.addEventListener("click",()=>notify("日ノ本帝國：東方諸島域に位置する帝國本土。"));
  map.addEventListener("keydown",event=>{
   if(event.key==="+"||event.key==="="){zoom=Math.min(1.7,zoom+.1);applyZoom()}
   if(event.key==="-"){zoom=Math.max(.8,zoom-.1);applyZoom()}
  });
  applyZoom();
  if(window.matchMedia("(max-width: 540px)").matches){
   requestAnimationFrame(()=>{map.scrollLeft=Math.max(0,Math.min(320,layer.scrollWidth/2-map.clientWidth/2))});
  }
 }


 function initAdvancedMapExperience(){
  const panel=$(".dpx-map-panel"),map=$("#dpx-world-map"),controls=$(".dpx-map-controls"),svg=$("#dpx-world-layer svg");
  if(!panel||!map||!controls||!svg)return;
  const makeButton=(label,action,title)=>{
   const b=document.createElement("button");b.type="button";b.className="dpx-advanced-map-action";b.textContent=label;b.title=title||label;b.addEventListener("click",action);controls.append(b);return b;
  };
  let expanded=false;
  const full=makeButton("全画面圖",()=>{
   expanded=!expanded;panel.classList.toggle("dpx-map-expanded",expanded);
   full.textContent=expanded?"全画面を閉じる":"全画面圖";
   full.setAttribute("aria-pressed",String(expanded));
   document.body.classList.toggle("dpx-map-lock",expanded);
   if(expanded)panel.scrollIntoView({block:"start",behavior:reduced?"auto":"smooth"});
  },"萬國全圖を画面いっぱいに表示");
  const download=makeButton("圖を保存",()=>{
   const clone=svg.cloneNode(true);
   clone.setAttribute("xmlns","http://www.w3.org/2000/svg");
   clone.setAttribute("width","1440");clone.setAttribute("height","840");
   clone.querySelectorAll("[hidden]").forEach(el=>el.removeAttribute("hidden"));
   const style=document.createElementNS("http://www.w3.org/2000/svg","style");
   style.textContent=".country-label,.imperial-label{font-family:serif;fill:#514333}.terrain-label,.sea-label{font-family:serif;fill:#7b715f}.route{stroke-dasharray:8 8}";
   clone.insertBefore(style,clone.firstChild);
   const source=new XMLSerializer().serializeToString(clone);
   const blob=new Blob([source],{type:"image/svg+xml;charset=utf-8"}),url=URL.createObjectURL(blob);
   const a=document.createElement("a");a.href=url;a.download="萬國全圖.svg";document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
   notify("萬國全圖をSVG形式で保存しました");
  },"萬國全圖を拡大しても鮮明なSVG画像として保存");
  const random=makeButton("國を巡る",()=>{
   const visible=$(".dpx-node:not([hidden])",map);
   if(!visible.length)return;
   const current=visible.findIndex(n=>n.getAttribute("aria-pressed")==="true");
   const next=visible[(current+1+Math.floor(Math.random()*(visible.length-1||1)))%visible.length];
   next.click();next.focus({preventScroll:true});
   notify(next.textContent.trim()+" の資料を表示しました");
  },"国別資料をひとつ選んで巡覧");
  const copy=makeButton("資料リンクを複写",()=>{
   const selected=$(".dpx-node[aria-pressed='true']",map);
   const id=selected?.dataset.countryNode;
   const country=id&&({ou:"ou",koumu:"koumu",fuyou:"fuyou",kinsou:"kinsou",ruren:"ruren",ibara:"ibara",shinbu:"shinbu",ginkan:"ginkan",suikyu:"suikyu",kouyou:"kouyou",mitian:"mitian"})[id];
   if(!country)return;
   const url=new URL("countries/"+country+".html",location.href).href;
   if(navigator.clipboard?.writeText){navigator.clipboard.writeText(url).then(()=>notify("選択中の国別資料リンクを複写しました")).catch(()=>notify("この環境ではリンクを複写できませんでした"))}
   else notify(url);
  },"選択中の国別資料のURLを複写");
  const nodes=$(".dpx-node",map);
  map.addEventListener("keydown",event=>{
   if(!["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(event.key))return;
   const active=nodes.findIndex(n=>n===document.activeElement);
   if(active<0)return;
   event.preventDefault();
   const direction=(event.key==="ArrowRight"||event.key==="ArrowDown")?1:-1;
   let index=active;
   for(let tries=0;tries<nodes.length;tries++){
    index=(index+direction+nodes.length)%nodes.length;
    if(!nodes[index].hidden){nodes[index].focus();nodes[index].click();break}
   }
  });
  document.addEventListener("keydown",event=>{
   if(event.key==="Escape"&&expanded){expanded=false;panel.classList.remove("dpx-map-expanded");document.body.classList.remove("dpx-map-lock");full.textContent="全画面圖";full.setAttribute("aria-pressed","false")}
  });
  panel.addEventListener("click",event=>{
   if(event.target.closest("button"))return;
  });
 }



 function initSectionNavigator(){
  if(document.querySelector("#dpx-section-nav"))return;
  const main=document.querySelector("main");if(!main)return;
  const headings=[...main.querySelectorAll("h2")].filter(h=>h.textContent.trim()&&!h.closest("nav,[aria-hidden='true']"));
  if(headings.length<3)return;
  const slug=text=>(text||"section").normalize("NFKC").toLowerCase().replace(/[^a-z0-9ぁ-んァ-ヶ一-龠]+/g,"-").replace(/^-|-$/g,"").slice(0,48)||"section";
  const used=new Set();
  headings.forEach(h=>{if(!h.id){let id=slug(h.textContent),base=id,n=2;while(document.getElementById(id)||used.has(id))id=base+"-"+n++;h.id=id}used.add(h.id)});
  const nav=document.createElement("nav");nav.id="dpx-section-nav";nav.className="dpx-section-nav";nav.setAttribute("aria-label","本頁の章間移動");
  nav.innerHTML='<div class="dpx-section-head"><span>DOCUMENT GUIDE</span><strong>本頁の構成</strong></div><div class="dpx-section-current" aria-live="polite">—</div><ol></ol>';
  const list=nav.querySelector("ol"),links=[];
  headings.forEach((h,i)=>{const li=document.createElement("li"),a=document.createElement("a");a.href="#"+encodeURIComponent(h.id);a.setAttribute("aria-label","第"+(i+1)+"項："+h.textContent.trim());const dot=document.createElement("i");dot.setAttribute("aria-hidden","true");const label=document.createElement("span");label.textContent=h.textContent.trim();a.append(dot,label);li.append(a);list.append(li);links.push(a)});
  document.body.append(nav);
  let active=-1;
  const activate=i=>{if(i<0||i>=links.length||i===active)return;active=i;links.forEach((a,n)=>{a.classList.toggle("is-active",n===i);if(n===i)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current")});nav.querySelector(".dpx-section-current").textContent=headings[i].textContent.trim();nav.style.setProperty("--dpx-section-progress",((i+1)/links.length*100)+"%")};
  if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(visible.length)activate(headings.indexOf(visible[0].target))},{rootMargin:"-15% 0px -72% 0px",threshold:0});headings.forEach(h=>io.observe(h))}
  else{const update=()=>{let i=0;headings.forEach((h,n)=>{if(h.getBoundingClientRect().top<innerHeight*.4)i=n});activate(i)};addEventListener("scroll",update,{passive:true});update()}
  links.forEach((a,i)=>a.addEventListener("click",()=>activate(i)));
  const visibility=()=>nav.classList.toggle("is-visible",scrollY>260);
  addEventListener("scroll",visibility,{passive:true});visibility();activate(0);
 }

 function initPortalExperience(){
 if(document.documentElement.dataset.portalReady)return;document.documentElement.dataset.portalReady="1";
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 const progress=document.createElement("div");progress.className="portal-progress";progress.innerHTML="<span></span>";document.body.append(progress);
 const fill=progress.firstElementChild;let queued=false;const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;fill.style.transform="scaleX("+(max>0?scrollY/max:0)+")";queued=false};
 addEventListener("scroll",()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});addEventListener("resize",update);update();
 const tools=document.createElement("div");tools.className="portal-tools";tools.innerHTML='<button class="portal-tool" data-portal-search>資料を横断検索　⌕</button><button class="portal-tool" data-portal-read>閱讀モード</button><button class="portal-tool" data-portal-size>文字を大きく ＋</button>';document.body.append(tools);
 const top=document.createElement("button");top.className="portal-backtop";top.type="button";top.textContent="↑";top.setAttribute("aria-label","ページ上部へ戻る");document.body.append(top);
 const onScroll=()=>top.classList.toggle("visible",scrollY>420);addEventListener("scroll",onScroll,{passive:true});onScroll();top.addEventListener("click",()=>scrollTo({top:0,behavior:reduced?"auto":"smooth"}));
 let scale=1;tools.querySelector("[data-portal-size]").addEventListener("click",e=>{scale=scale>=1.2?1:Math.round((scale+.1)*10)/10;document.documentElement.style.setProperty("--portal-scale",scale);e.currentTarget.textContent=scale>=1.2?"文字サイズを戻す":"文字を大きく ＋"});
 tools.querySelector("[data-portal-read]").addEventListener("click",e=>{document.body.classList.toggle("portal-reading");const on=document.body.classList.contains("portal-reading");e.currentTarget.setAttribute("aria-pressed",String(on));e.currentTarget.textContent=on?"閱讀モードを終了":"閱讀モード"});
 const countries=[["央國","北央大陸","ou"],["紅霧國","歐州北西部","koumu"],["芙蓉國","歐州","fuyou"],["琴奏國","中歐","kinsou"],["留廉伯","中歐","ruren"],["竜棘國","東歐","ibara"],["神武國","南歐","shinbu"],["銀冠國","中歐","ginkan"],["翠丘國","東歐","suikyu"],["煌耀皇國","東歐・西亞","kouyou"],["美天國","東方大陸","mitian"]];
 const base=location.pathname.includes("/countries/")?"":"countries/";
 const all=countries.map(c=>({name:c[0],desc:c[1]+"　國別外交資料",url:base+"countries/"+c[2]+".html"}));
 if(location.pathname.includes("/countries/"))all.forEach(x=>x.url=x.url.replace(/^countries\//,""));
 document.querySelectorAll("main section[id],main [id]").forEach(el=>all.push({name:(el.querySelector("h1,h2,h3")?.textContent||el.id).trim(),desc:"本頁の項目",url:"#"+el.id}));
 const panel=document.createElement("div");panel.className="portal-panel";panel.hidden=true;panel.innerHTML='<section class="portal-dialog" role="dialog" aria-modal="true" aria-label="外交資料横断検索"><div class="portal-dialog-head"><h2>萬國外交廳　資料横断検索</h2><button type="button" data-portal-close>閉じる ×</button></div><input class="portal-search" type="search" placeholder="國名・地域・項目を入力…" autocomplete="off"><div class="portal-results"></div><p class="portal-shortcuts">Enter：開く　／　Esc：閉じる　／　Ctrl・⌘ + K：検索</p></section>';document.body.append(panel);
 const input=panel.querySelector("input"),results=panel.querySelector(".portal-results"),esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));let shown=[];
 const render=()=>{const q=input.value.normalize("NFKC").toLowerCase().replace(/\s/g,"");shown=all.filter(x=>(x.name+x.desc).normalize("NFKC").toLowerCase().replace(/\s/g,"").includes(q)).slice(0,18);results.innerHTML=shown.length?shown.map((x,i)=>'<button class="portal-result" data-i="'+i+'"><span><strong>'+esc(x.name)+'</strong><small>'+esc(x.desc)+'</small></span><kbd>↗</kbd></button>').join(""):"<p>該当する資料はありません。</p>";results.querySelectorAll("[data-i]").forEach(b=>b.addEventListener("click",()=>{const x=shown[+b.dataset.i];if(x.url.startsWith("#")){close();document.querySelector(x.url)?.scrollIntoView({behavior:reduced?"auto":"smooth"})}else location.href=x.url}))};
 const open=()=>{panel.hidden=false;input.value="";render();input.focus();document.body.style.overflow="hidden"},close=()=>{panel.hidden=true;document.body.style.overflow=""};
 tools.querySelector("[data-portal-search]").addEventListener("click",open);panel.querySelector("[data-portal-close]").addEventListener("click",close);panel.addEventListener("click",e=>{if(e.target===panel)close()});input.addEventListener("input",render);input.addEventListener("keydown",e=>{if(e.key==="Escape")close();if(e.key==="Enter")results.querySelector("button")?.click()});
 document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();panel.hidden?open():close()}if(e.key==="Escape"&&!panel.hidden)close()});
 document.body.classList.add("portal-page-enter");
 }

 document.addEventListener("DOMContentLoaded",()=>{});
 initSkipAndMeta();addProgress();addBackTop();initAgencyNetwork();addAgencyLinks();initNavTracking();initAtlas();initWorldMapControls();initAdvancedMapExperience();initPortalExperience();initSectionNavigator();createCommandPalette();createBookmarksDialog();initReveal();
})();