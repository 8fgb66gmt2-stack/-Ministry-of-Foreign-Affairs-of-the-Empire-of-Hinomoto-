/* Imperial Diplomatic Situation Room — public-information interface */
(()=>{"use strict";
if(document.documentElement.dataset.idrRoom)return;
document.documentElement.dataset.idrRoom="1";
const path=decodeURI(location.pathname),home=/\/$|\/index\.html$/.test(path)&&!path.includes("/countries/");
if(!home)return;
const root=path.includes("/-Ministry-")?"./":"";
const countries=[
{name:"央國",file:"ou.html",region:"國別資料室",mark:"央"},
{name:"紅霧國",file:"koumu.html",region:"國別資料室",mark:"紅"},
{name:"芙蓉國",file:"fuyou.html",region:"國別資料室",mark:"芙"},
{name:"琴奏國",file:"kinsou.html",region:"國別資料室",mark:"琴"},
{name:"留廉伯",file:"ruren.html",region:"國別資料室",mark:"留"},
{name:"竜棘國",file:"ibara.html",region:"國別資料室",mark:"竜"},
{name:"神武國",file:"shinbu.html",region:"國別資料室",mark:"神"},
{name:"銀冠國",file:"ginkan.html",region:"國別資料室",mark:"銀"},
{name:"翠丘國",file:"suikyu.html",region:"國別資料室",mark:"翠"},
{name:"煌耀皇國",file:"kouyou.html",region:"國別資料室",mark:"煌"},
{name:"美天國",file:"mitian.html",region:"國別資料室",mark:"美"}
];
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const section=el("section","idr-room");section.id="diplomatic-situation-room";section.setAttribute("aria-label","帝國外交情報管制室");
section.innerHTML=`<div class="idr-inner">
<header class="idr-top"><span>HINOMOTO EMPIRE / FOREIGN AFFAIRS INTELLIGENCE DESK</span><span class="idr-live"><i></i> PUBLIC INFORMATION TERMINAL　ONLINE</span></header>
<div class="idr-title-row"><div><div class="idr-kicker">IMPERIAL DIPLOMATIC SITUATION ROOM　／　公開情報統合端末</div><h2 class="idr-title">帝國外交情報管制室</h2><p class="idr-subtitle">國別資料・公開文書・地理情報を横断する、萬國外交廳の統合閲覧盤。</p></div><div class="idr-clock"><strong id="idr-time">--:--:--</strong><small id="idr-date">LOCAL SESSION CLOCK</small></div></div>
<div class="idr-metrics" aria-label="公開資料の構成"><div class="idr-metric"><small>COUNTRY DOSSIERS</small><strong>11　國</strong><span>國別資料室 掲載件数</span></div><div class="idr-metric"><small>CORE SYSTEMS</small><strong>03　系統</strong><span>地理・文書・國別資料</span></div><div class="idr-metric"><small>PUBLIC ACCESS</small><strong>OPEN</strong><span>公開情報閲覧端末</span></div><div class="idr-metric"><small>SESSION STATUS</small><strong id="idr-session">接続確認中</strong><span>この端末の閲覧状態</span></div></div>
<div class="idr-grid"><section class="idr-panel"><header class="idr-panel-head"><div><small>01 / COUNTRY DOSSIER INDEX</small><strong>國別資料照会</strong></div><span class="idr-count" id="idr-count">11 RECORDS</span></header><div class="idr-controls"><input class="idr-search" id="idr-search" type="search" placeholder="國名を入力して検索…" aria-label="國別資料検索"><button class="idr-filter" type="button" data-idr-filter="all" aria-pressed="true">全國</button><button class="idr-filter" type="button" data-idr-filter="clear" aria-pressed="false">検索解除</button></div><div class="idr-country-list" id="idr-country-list"></div></section>
<div class="idr-side-stack"><section class="idr-selected" id="idr-selected" aria-live="polite"><small>SELECT A COUNTRY DOSSIER</small><h3>國別資料を選択</h3><p>左の一覧から國名を選ぶと、資料室への接続情報を表示します。ここに示すのは公開ページへの案内であり、外交関係の評価ではありません。</p></section><section class="idr-panel"><header class="idr-panel-head"><div><small>02 / LOCAL ACTIVITY</small><strong>閲覧端末 操作記録</strong></div><span class="idr-count">LOCAL LOG</span></header><div class="idr-log" id="idr-log"><div class="idr-log-row"><time>BOOT</time><span>公開情報統合端末を初期化しました。</span></div><div class="idr-log-row"><time>INDEX</time><span>國別資料の索引を読み込みました。</span></div></div><p class="idr-log-note">※操作記録はこのブラウザ上での画面操作のみを表示します。実際の外交電信・政府内部システムには接続していません。</p></section></div></div>
<footer class="idr-bottom"><span>DATA SCOPE　／　< b>PUBLIC SITE DIRECTORY</b>　・　SITE NAVIGATION ONLY</span><div class="idr-legend"><span><i></i>公開資料</span><span>線・接続表示は案内導線を示し、國交状態を表しません</span></div></footer>
</div>`;
const anchor=document.querySelector(".ic-command")||document.querySelector(".hero");
if(anchor)anchor.parentNode.insertBefore(section,anchor.nextSibling);else document.body.append(section);
const list=section.querySelector("#idr-country-list"),search=section.querySelector("#idr-search"),count=section.querySelector("#idr-count"),selected=section.querySelector("#idr-selected"),log=section.querySelector("#idr-log");
let active="";const now=()=>new Date().toLocaleTimeString("ja-JP",{hour12:false});
function record(message){const row=el("div","idr-log-row");row.append(el("time","",now()),el("span","",message));log.prepend(row);while(log.children.length>5)log.lastElementChild.remove()}
function choose(c){active=c.name;selected.replaceChildren();selected.append(el("small","","COUNTRY DOSSIER / SELECTED RECORD"),el("h3","",c.name),el("p","",c.region+"に収録された公開資料へ接続します。國の外交的地位・国交状態など、資料に記載のない情報は付加していません。"));const a=el("a","","國別資料室を開く　↗");a.href=root+"countries/"+c.file;selected.append(a);list.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.name===c.name)));record(c.name+" の國別資料を照会");}
function render(){const q=search.value.normalize("NFKC").toLocaleLowerCase().trim();const matches=countries.filter(c=>c.name.normalize("NFKC").toLocaleLowerCase().includes(q));list.replaceChildren();matches.forEach(c=>{const b=el("button","idr-country");b.type="button";b.dataset.name=c.name;b.setAttribute("aria-pressed",String(active===c.name));b.append(el("span","idr-country-mark",c.mark));const txt=el("span");txt.append(el("span","idr-country-name",c.name),el("span","idr-country-meta","COUNTRY DOSSIER / "+String(countries.indexOf(c)+1).padStart(2,"0")));b.append(txt);b.addEventListener("click",()=>choose(c));list.append(b)});if(!matches.length)list.append(el("p","idr-empty","該当する國別資料はありません。"));count.textContent=matches.length+" / "+countries.length+" RECORDS";}
search.addEventListener("input",render);section.querySelector('[data-idr-filter="all"]').addEventListener("click",()=>{search.value="";render();record("國別資料索引を全件表示")});section.querySelector('[data-idr-filter="clear"]').addEventListener("click",()=>{search.value="";render();search.focus()});
const clock=()=>{section.querySelector("#idr-time").textContent=now();section.querySelector("#idr-date").textContent=new Date().toLocaleDateString("ja-JP",{year:"numeric",month:"long",day:"numeric",weekday:"long"})+"　／　LOCAL SESSION CLOCK"};clock();setInterval(clock,1000);
render();section.querySelector("#idr-session").textContent="閲覧可能";record("公開索引 "+countries.length+" 件を照合");
})();
