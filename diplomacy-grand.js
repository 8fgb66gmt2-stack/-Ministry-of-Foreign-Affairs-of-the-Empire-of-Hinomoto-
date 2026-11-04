/* Imperial Digital Experience — shared interaction engine */
(()=>{"use strict";
const VERSION="2.0.0";
const ROOT=location.pathname.includes("/countries/")?"../":"";
const KEY={bookmarks:"hinomoto.ix.bookmarks.v2",history:"hinomoto.ix.history.v2",prefs:"hinomoto.ix.prefs.v2"};
let PAGES=[
{label:"本廳舎",url:ROOT+"index.html",kind:"行政・総合案内",keys:"本廳舎 home ministry 管制室"},
{label:"外交文書館",url:ROOT+"archive.html",kind:"条約・公文書・外交記録",keys:"文書館 archive 条約 公文書"},
{label:"萬國全圖",url:ROOT+"atlas.html",kind:"地理・地形・測量資料",keys:"地図 atlas geography 地理"},
{label:"國別資料室 総覧",url:ROOT+"countries/index.html",kind:"各国の外交資料",keys:"國別 資料室 country 国"},
{label:"央國",url:ROOT+"countries/ou.html",kind:"國別外交資料",keys:"央國"},
{label:"紅霧國",url:ROOT+"countries/koumu.html",kind:"國別外交資料",keys:"紅霧國"},
{label:"芙蓉國",url:ROOT+"countries/fuyou.html",kind:"國別外交資料",keys:"芙蓉國"},
{label:"琴奏國",url:ROOT+"countries/kinsou.html",kind:"國別外交資料",keys:"琴奏國"},
{label:"留廉伯",url:ROOT+"countries/ruren.html",kind:"國別外交資料",keys:"留廉伯"},
{label:"竜棘國",url:ROOT+"countries/ibara.html",kind:"國別外交資料",keys:"竜棘國"},
{label:"神武國",url:ROOT+"countries/shinbu.html",kind:"國別外交資料",keys:"神武國"},
{label:"銀冠國",url:ROOT+"countries/ginkan.html",kind:"國別外交資料",keys:"銀冠國"},
{label:"翠丘國",url:ROOT+"countries/suikyu.html",kind:"國別外交資料",keys:"翠丘國"},
{label:"煌耀皇國",url:ROOT+"countries/kouyou.html",kind:"國別外交資料",keys:"煌耀皇國"},
{label:"美天國",url:ROOT+"countries/mitian.html",kind:"國別外交資料",keys:"美天國"}
];
fetch(ROOT+"data/navigation.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("navigation");return r.json()}).then(data=>{if(Array.isArray(data.pages)&&data.pages.length)PAGES.splice(0,PAGES.length,...data.pages.map(p=>({label:p.title,url:ROOT+p.path,kind:p.type||"外交資料",keys:p.title}))) }).catch(()=>{});
const read=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k))??fallback}catch(_){return fallback}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
const prefs=read(KEY.prefs,{reducedMotion:false,reading:false,fontScale:100,sound:false});
const bookmarks=read(KEY.bookmarks,[]);
const history=read(KEY.history,[]);
const title=document.title.replace(/\s*[｜|].*$/,"")||"萬國外交廳";
const pagePath=location.pathname.replace(/^\//,"");
const current=PAGES.find(p=>decodeURI(location.pathname).endsWith(p.url.replace(ROOT,"").replace(/^\.\.\//,"")))||PAGES.find(p=>p.url===location.pathname)||{label:title,url:location.href,kind:"外交情報"};
const $=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const safeUrl=url=>{try{const u=new URL(url,location.href);return u.origin===location.origin?u.href:null}catch(_){return null}};
const toast=message=>{let n=document.querySelector(".ix-toast");if(!n){n=$("div","ix-toast");n.setAttribute("role","status");n.setAttribute("aria-live","polite");document.body.append(n)}n.textContent=message;n.classList.add("is-visible");clearTimeout(toast.timer);toast.timer=setTimeout(()=>n.classList.remove("is-visible"),2400)};
const progress=$("div","ix-progress");progress.setAttribute("aria-hidden","true");document.body.append(progress);
const skip=$("a","ix-skip","本文へ移動");skip.href="#main";document.body.prepend(skip);
let main=document.querySelector("main,[role=main],#main")||document.querySelector("article")||document.body;
if(!main.id)main.id="main";
const dock=$("nav","ix-dock");dock.setAttribute("aria-label","外交廳クイックツール");
const playTick=()=>{if(!prefs.sound)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;const ctx=new Audio();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type="sine";osc.frequency.value=640;gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.018,ctx.currentTime+.012);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.075);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.08);osc.onended=()=>ctx.close()}catch(_){}};
const makeTool=(label,icon,action,pressed)=>{const b=$("button","ix-tool");b.type="button";b.title=label;b.setAttribute("aria-label",label);if(pressed!==undefined)b.setAttribute("aria-pressed",String(pressed));b.textContent=icon;b.addEventListener("click",()=>{playTick();action()});dock.append(b);return b};
let searchOpen=false,drawerOpen=false;
const overlay=$("div","ix-overlay");overlay.setAttribute("aria-hidden","true");
const panel=$("section","ix-panel");panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-label","統合資料検索");
const panelHead=$("header","ix-panel-head");panelHead.append($("p","ix-kicker","IMPERIAL INFORMATION INDEX"),$("h2","ix-panel-title","統合資料検索"),$("p","ix-panel-sub","萬國外交廳の公開資料・各部署・國別資料へ移動します。"));
const searchWrap=$("div","ix-search-wrap"),input=$("input","ix-search");input.type="search";input.placeholder="資料名・國名・機能を入力…";input.setAttribute("aria-label","検索語");searchWrap.append(input);
const results=$("div","ix-results");const shortcuts=$("div","ix-shortcuts");shortcuts.innerHTML='<span><span class="ix-key">↑</span> <span class="ix-key">↓</span> 選択</span><span><span class="ix-key">Enter</span> 開く</span><span><span class="ix-key">Esc</span> 閉じる</span>';
panel.append(panelHead,searchWrap,results,shortcuts);overlay.append(panel);document.body.append(overlay);
const renderResults=query=>{results.replaceChildren();const q=query.trim().toLocaleLowerCase();const local=[...document.querySelectorAll("h1,h2,h3,[data-search-title]")].map((n,i)=>({label:n.textContent.trim(),kind:"このページの見出し",url:"#"+(n.id||(n.id="ix-heading-"+i)),keys:n.textContent})).filter(x=>x.label);
const all=[...PAGES,...local];const found=(q?all.filter(x=>(x.label+" "+x.kind+" "+(x.keys||"")).toLocaleLowerCase().includes(q)):PAGES).slice(0,24);
if(!found.length){results.append($("div","ix-empty","該当する資料は見つかりませんでした。検索語を変えて再照会してください。"));return}
found.forEach((item,i)=>{const b=$("button","ix-result");b.type="button";b.dataset.index=i;b.append($("span","ix-result-mark",String(i+1).padStart(2,"0")));const m=$("span","ix-result-main");m.append($("span","ix-result-title",item.label),$("span","ix-result-meta",item.kind));b.append(m,$("span","ix-result-key",item.url.startsWith("#")?"この頁":"移動 ↗"));b.addEventListener("click",()=>{closeSearch();if(item.url.startsWith("#"))document.querySelector(item.url)?.scrollIntoView({behavior:motion()?"smooth":"auto",block:"start"});else location.href=item.url});results.append(b)})};
const panelTitle=panel.querySelector(".ix-panel-title"),panelSub=panel.querySelector(".ix-panel-sub");
const openSearch=()=>{searchOpen=true;panelTitle.textContent="統合資料検索";panelSub.textContent="萬國外交廳の公開資料・各部署・國別資料へ移動します。";searchWrap.style.display="";shortcuts.innerHTML='<span><span class="ix-key">↑</span> <span class="ix-key">↓</span> 選択</span><span><span class="ix-key">Enter</span> 開く</span><span><span class="ix-key">Esc</span> 閉じる</span>';overlay.classList.add("is-open");overlay.setAttribute("aria-hidden","false");input.value="";renderResults("");setTimeout(()=>input.focus(),30)};
const openShelf=()=>{searchOpen=true;panelTitle.textContent="外交の栞";panelSub.textContent="この端末に保存された資料と、最近閲覧した頁を表示します。";searchWrap.style.display="none";results.replaceChildren();const saved=read(KEY.bookmarks,[]),recent=read(KEY.history,[]);const addGroup=(heading,items,empty)=>{results.append($("div","ix-shelf-heading",heading));if(!items.length){results.append($("div","ix-empty",empty));return}items.forEach(item=>{const row=$("div","ix-shelf-row"),open=$("button","ix-result");open.type="button";open.append($("span","ix-result-mark","✧"));const main=$("span","ix-result-main");main.append($("span","ix-result-title",item.title||"外交資料"),$("span","ix-result-meta",new Date(item.at).toLocaleString("ja-JP")));open.append(main);open.addEventListener("click",()=>location.href=item.url);row.append(open);if(heading==="保存した栞"){const remove=$("button","ix-action","削除");remove.type="button";remove.addEventListener("click",()=>{const next=read(KEY.bookmarks,[]).filter(x=>x.url!==item.url);write(KEY.bookmarks,next);openShelf();toast("栞から削除しました")});row.append(remove)}results.append(row)})};addGroup("保存した栞",saved,"保存された栞はありません。ページ左下の栞ボタンから追加できます。");addGroup("最近閲覧した頁",recent.slice(0,8),"閲覧履歴はまだありません。");shortcuts.textContent="閲覧記録はこの端末内に保存されます。";overlay.classList.add("is-open");overlay.setAttribute("aria-hidden","false")};
const closeSearch=()=>{searchOpen=false;overlay.classList.remove("is-open");overlay.setAttribute("aria-hidden","true")};
input.addEventListener("input",()=>{selected=0;renderResults(input.value)});overlay.addEventListener("click",e=>{if(e.target===overlay)closeSearch()});
const motion=()=>!prefs.reducedMotion&&!matchMedia("(prefers-reduced-motion: reduce)").matches;
let selected=0;input.addEventListener("keydown",e=>{const rows=[...results.querySelectorAll(".ix-result")];if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();selected=(selected+(e.key==="ArrowDown"?1:-1)+rows.length)%rows.length;rows.forEach((r,i)=>r.setAttribute("aria-selected",String(i===selected)));rows[selected]?.scrollIntoView({block:"nearest"})}if(e.key==="Enter")rows[selected]?.click()});
const drawerBack=$("div","ix-drawer-backdrop"),drawer=$("aside","ix-drawer");drawer.setAttribute("aria-label","閲覧環境設定");const drawerBody=$("div","ix-drawer-body");const drawerClose=$("button","ix-close","×");drawerClose.type="button";drawerClose.setAttribute("aria-label","閉じる");drawerBody.append(drawerClose,$("p","ix-kicker","READING ENVIRONMENT"),$("h2","ix-panel-title","閲覧環境"));
const makeSetting=(heading,desc,buttonText,fn)=>{const s=$("section","ix-setting");s.append($("strong","",heading),$("p","",desc));const b=$("button","",buttonText);b.type="button";b.addEventListener("click",fn);s.append(b);drawerBody.append(s)};
makeSetting("閱讀集中モード","本文の横幅と操作部品を整理し、資料の閲覧に集中します。","切り替える",()=>toggleReading());
makeSetting("文字サイズ","本文の文字を読みやすい大きさに調整します。","文字サイズを変更",()=>{prefs.fontScale=prefs.fontScale>=120?90:prefs.fontScale+10;document.documentElement.style.setProperty("--ix-font-scale",prefs.fontScale/100);write(KEY.prefs,prefs);document.documentElement.style.fontSize=(prefs.fontScale/100*16)+"px";toast("文字サイズ："+prefs.fontScale+"%")});
makeSetting("動きの抑制","画面遷移や装飾アニメーションを控えめにします。","動きの設定を切り替える",()=>{prefs.reducedMotion=!prefs.reducedMotion;write(KEY.prefs,prefs);document.documentElement.classList.toggle("ix-motion-off",prefs.reducedMotion);toast(prefs.reducedMotion?"動きの演出を抑制しました":"動きの演出を有効にしました")});
makeSetting("操作音","利用者が有効にした場合のみ、短い控えめな操作音を再生します。","操作音を切り替える",()=>{prefs.sound=!prefs.sound;write(KEY.prefs,prefs);toast(prefs.sound?"操作音を有効にしました":"操作音を無効にしました");if(prefs.sound)playTick()});
makeSetting("閲覧履歴","この端末に保存された最近の閲覧記録を消去します。","閲覧履歴を消去",()=>{write(KEY.history,[]);toast("閲覧履歴を消去しました")});
drawer.append(drawerBody);document.body.append(drawerBack,drawer);
const openDrawer=()=>{drawerOpen=true;drawer.classList.add("is-open");drawerBack.classList.add("is-open");drawerClose.focus()};
const closeDrawer=()=>{drawerOpen=false;drawer.classList.remove("is-open");drawerBack.classList.remove("is-open")};
drawerClose.addEventListener("click",closeDrawer);drawerBack.addEventListener("click",closeDrawer);
const toggleReading=()=>{prefs.reading=!prefs.reading;document.documentElement.classList.toggle("ix-reading",prefs.reading);const t=[...dock.querySelectorAll(".ix-tool")].find(b=>b.getAttribute("aria-label")==="閱讀集中モード");if(t)t.setAttribute("aria-pressed",String(prefs.reading));write(KEY.prefs,prefs);toast(prefs.reading?"閱讀集中モードを開始しました":"通常表示に戻しました")};
const dockSearch=makeTool("統合資料検索","⌕",openSearch);
makeTool("外交情報管制室","⌘",()=>{const control=document.querySelector("[data-dpx-control-open],#dpx-control-open,.dpx-control-launch,[data-control-room-open]");if(control)control.click();else toast("管制室は本廳舎からご利用ください")});
const bookmarkBtn=makeTool("外交の栞を開く","▤",openShelf);
makeTool("閲覧環境設定","⚙",openDrawer);
makeTool("閱讀集中モード","文",toggleReading,prefs.reading);
if(location.pathname.endsWith("/atlas.html")||location.pathname.endsWith("atlas.html")){makeTool("地図を全画面表示","⛶",()=>{const b=document.querySelector("#fullscreen-map");if(b)b.click();else document.querySelector("#map-viewport")?.requestFullscreen?.()}) ;makeTool("地図座標をコピー","⌖",()=>{const value=document.querySelector("#map-coordinates")?.textContent?.trim();if(value&&navigator.clipboard?.writeText)navigator.clipboard.writeText(value).then(()=>toast("地図座標を複写しました")).catch(()=>toast("座標を複写できませんでした"));else toast("座標情報を取得できません")})}
if(location.pathname.endsWith("/archive.html")||location.pathname.endsWith("archive.html")){makeTool("文書検索へ移動","⌕",()=>{const q=document.querySelector("#q");q?.focus();q?.scrollIntoView({behavior:motion()?"smooth":"auto",block:"center"})})}
document.body.append(dock);
const bookmarkFloating=$("button","ix-bookmark","☆ この頁を栞に追加");bookmarkFloating.type="button";bookmarkFloating.addEventListener("click",toggleBookmark);document.body.append(bookmarkFloating);
function toggleBookmark(){const exists=bookmarks.some(x=>x.url===location.href);const next=exists?bookmarks.filter(x=>x.url!==location.href):[{title,url:location.href,at:Date.now()},...bookmarks].slice(0,100);bookmarks.splice(0,bookmarks.length,...next);write(KEY.bookmarks,bookmarks);const saved=!exists;bookmarkFloating.classList.toggle("is-saved",saved);bookmarkFloating.textContent=saved?"★ 栞に保存済み":"☆ この頁を栞に追加";toast(saved?"外交の栞に保存しました":"栞から削除しました")}
const isSaved=bookmarks.some(x=>x.url===location.href);bookmarkFloating.classList.toggle("is-saved",isSaved);bookmarkFloating.textContent=isSaved?"★ 栞に保存済み":"☆ この頁を栞に追加";
const historyNext=[{title,url:location.href,at:Date.now()},...history.filter(x=>x.url!==location.href)].slice(0,30);write(KEY.history,historyNext);
const top=$("button","ix-back-top","↑");top.type="button";top.title="ページ先頭へ戻る";top.setAttribute("aria-label","ページ先頭へ戻る");top.addEventListener("click",()=>scrollTo({top:0,behavior:motion()?"smooth":"auto"}));document.body.append(top);
let scrollTick=false;const onScroll=()=>{if(scrollTick)return;scrollTick=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+"%";top.classList.toggle("is-visible",scrollY>500);scrollTick=false})};addEventListener("scroll",onScroll,{passive:true});onScroll();
const countryLinks=PAGES.filter(p=>p.url.includes("/countries/")&&!p.url.endsWith("index.html"));
if(location.pathname.includes("/countries/")&&!location.pathname.endsWith("/index.html")){const heading=document.querySelector("h1");if(heading){const wrap=$("div","ix-country-tools");const label=$("span","ix-meta-line","國別資料室");label.setAttribute("aria-hidden","true");wrap.append(label);countryLinks.forEach(p=>{const a=$("a","",p.label);a.href=p.url;wrap.append(a)});heading.insertAdjacentElement("afterend",wrap)}}
const meta=$("div","ix-meta-line");meta.append($("span","", "IMPERIAL DIGITAL EXPERIENCE"),$("span","",current.kind),$("span","", "LOCAL ARCHIVE"));if(main!==document.body){const h=main.querySelector("h1");if(h&&!h.parentElement.querySelector(".ix-meta-line"))h.insertAdjacentElement("afterend",meta)}
if(motion()){main.classList.add("ix-page-enter");setTimeout(()=>main.classList.remove("ix-page-enter"),800)}
document.documentElement.classList.toggle("ix-reading",!!prefs.reading);document.documentElement.style.fontSize=(Math.max(85,Math.min(130,prefs.fontScale||100))/100*16)+"px";
const reduceToggle=()=>document.documentElement.classList.toggle("ix-motion-off",!!prefs.reducedMotion);reduceToggle();
document.addEventListener("keydown",e=>{
 const key=e.key.toLowerCase();
 if((e.ctrlKey||e.metaKey)&&key==="k"){e.preventDefault();e.stopImmediatePropagation();openSearch();return}
 if((e.ctrlKey||e.metaKey)&&e.shiftKey&&key==="p"){e.preventDefault();e.stopImmediatePropagation();openDrawer();return}
 if(key==="escape"){if(searchOpen)closeSearch();if(drawerOpen)closeDrawer()}
},{capture:true});
document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute("download"))return;const url=safeUrl(a.href);if(!url||url.includes("#")&&new URL(url).pathname===location.pathname)return;const u=new URL(url);if(!["http:","https:"].includes(u.protocol))return;if(motion()){e.preventDefault();main.classList.add("ix-page-leave");const veil=$("div","ix-page-veil");veil.style.cssText="position:fixed;inset:0;z-index:99950;background:rgba(247,242,232,.0);pointer-events:none;transition:background .18s";document.body.append(veil);requestAnimationFrame(()=>veil.style.background="rgba(247,242,232,.72)");setTimeout(()=>location.href=url,170)}},{capture:true});
addEventListener("pageshow",()=>{document.body.classList.add("ix-ready")});
window.ImperialExperience={version:VERSION,openSearch,openSettings:openDrawer,toast,bookmarks:()=>read(KEY.bookmarks,[]),history:()=>read(KEY.history,[]),pages:PAGES};
})();