/* IMPERIAL DIPLOMATIC NETWORK — navigable site topology */
(()=>{"use strict";
if(document.documentElement.dataset.dpxNetwork)return;document.documentElement.dataset.dpxNetwork="1";
const nodes=[{"id":"home","name":"本廳","sub":"萬國外交廳","href":"index.html","x":480,"y":250,"type":"core"},{"id":"archive","name":"外交文書館","sub":"公開資料・文書目録","href":"archive.html","x":245,"y":105,"type":"system"},{"id":"atlas","name":"萬國全圖","sub":"地理情報・地圖","href":"atlas.html","x":710,"y":105,"type":"system"},{"id":"directory","name":"國別資料室","sub":"國家別公開資料","href":"countries/index.html","x":480,"y":420,"type":"system"},{"id":"ou","name":"央國","sub":"國別資料","href":"countries/ou.html","x":105,"y":310,"type":"country"},{"id":"koumu","name":"紅霧國","sub":"國別資料","href":"countries/koumu.html","x":170,"y":520,"type":"country"},{"id":"fuyou","name":"竜棘國","sub":"國別資料","href":"countries/fuyou.html","x":340,"y":625,"type":"country"},{"id":"kinsou","name":"琴奏國","sub":"國別資料","href":"countries/kinsou.html","x":555,"y":635,"type":"country"},{"id":"ruren","name":"翠丘國","sub":"國別資料","href":"countries/ruren.html","x":750,"y":565,"type":"country"},{"id":"ibara","name":"銀冠國","sub":"國別資料","href":"countries/ibara.html","x":850,"y":390,"type":"country"},{"id":"shinbu","name":"紅霧國","sub":"國別資料","href":"countries/shinbu.html","x":845,"y":245,"type":"country"},{"id":"ginkan","name":"翠丘國","sub":"國別資料","href":"countries/ginkan.html","x":640,"y":30,"type":"country"},{"id":"suikyu","name":"國別資料","sub":"國別資料","href":"countries/suikyu.html","x":360,"y":20,"type":"country"},{"id":"kouyou","name":"國別資料","sub":"國別資料","href":"countries/kouyou.html","x":80,"y":145,"type":"country"},{"id":"mitian","name":"國別資料","sub":"國別資料","href":"countries/mitian.html","x":45,"y":450,"type":"country"}];
const edges=[["home","archive"],["home","atlas"],["home","directory"],["archive","directory"],...nodes.filter(n=>n.type==="country").map(n=>["directory",n.id])];
const css=document.createElement("style");css.textContent=`
.dpx-network-launch{position:fixed;z-index:68;left:18px;bottom:18px;display:flex;align-items:center;gap:9px;padding:11px 16px;border:1px solid #b49a68;border-radius:30px;background:rgba(255,253,247,.96);color:#5a433b;box-shadow:0 8px 30px #35291b20;backdrop-filter:blur(12px);font:600 11px/1.4 inherit;letter-spacing:.12em;cursor:pointer;transition:.25s}
.dpx-network-launch:hover{transform:translateY(-3px);box-shadow:0 14px 38px #35291b2b;background:#fff}
.dpx-network-launch i{width:9px;height:9px;border:1px solid #a4874f;border-radius:50%;box-shadow:0 0 0 4px #a4874f20}
.dpx-network-overlay{position:fixed;inset:0;z-index:1000;display:none;background:rgba(28,31,27,.68);backdrop-filter:blur(10px);padding:clamp(8px,2vw,26px)}
.dpx-network-overlay[aria-hidden="false"]{display:grid;place-items:center;animation:dpx-net-fade .22s ease}
.dpx-network-shell{width:min(1440px,100%);height:min(900px,100%);min-height:520px;display:grid;grid-template-rows:auto 1fr auto;background:#f8f4e9;border:1px solid #b49a68;box-shadow:0 28px 100px #0007;position:relative;overflow:hidden}
.dpx-network-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 24px;border-bottom:1px solid #d9cdb6;background:linear-gradient(110deg,#f8f4e9,#eee5d5)}
.dpx-network-kicker{font:10px/1.5 Georgia,serif;letter-spacing:.2em;color:#927b52}
.dpx-network-title{font:600 clamp(18px,2vw,26px)/1.5 'Shippori Mincho','Yu Mincho',serif;letter-spacing:.12em;color:#40362f}
.dpx-network-head small{display:block;color:#817463;font:10px/1.7 sans-serif;letter-spacing:.08em}
.dpx-network-close{width:38px;height:38px;border:1px solid #c6b48f;background:#fffaf0;color:#6c5147;font-size:22px;cursor:pointer}
.dpx-network-body{min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 285px}
.dpx-network-stage{position:relative;min-width:0;min-height:0;overflow:hidden;background:radial-gradient(ellipse at 50% 45%,#fffdf8 0%,#f4eddf 63%,#e9deca 100%)}
.dpx-network-stage:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.3;background-image:linear-gradient(#b9a98422 1px,transparent 1px),linear-gradient(90deg,#b9a98422 1px,transparent 1px);background-size:38px 38px;mask-image:linear-gradient(transparent,#000 12%,#000 88%,transparent)}
.dpx-network-svg{position:absolute;inset:0;width:100%;height:100%;touch-action:pan-y}
.dpx-network-edge{stroke:#b8a47c;stroke-width:1.25;opacity:.62;stroke-dasharray:5 6;animation:dpx-net-flow 26s linear infinite}
.dpx-network-node{cursor:pointer;outline:none}
.dpx-network-node circle{stroke:#fffdf7;stroke-width:2;transition:r .2s,filter .2s}
.dpx-network-node.core circle{fill:#82414a;stroke:#c9a96c;stroke-width:4}
.dpx-network-node.system circle{fill:#6b8171}
.dpx-network-node.country circle{fill:#b49a68}
.dpx-network-node:hover circle,.dpx-network-node:focus circle,.dpx-network-node.selected circle{filter:drop-shadow(0 0 8px #9d774c99);stroke:#82414a;stroke-width:3}
.dpx-network-node text{font:12px 'Shippori Mincho','Yu Mincho',serif;fill:#4c4035;text-anchor:middle;pointer-events:none}
.dpx-network-node.core text{font-size:16px;font-weight:700;fill:#713d44}
.dpx-network-node .node-ring{fill:none;stroke:#ad9566;stroke-width:1;opacity:.6;stroke-dasharray:2 5;transform-origin:center;animation:dpx-net-rotate 22s linear infinite}
.dpx-network-node.dim{opacity:.12}
.dpx-network-side{border-left:1px solid #d9cdb6;padding:22px 20px;display:flex;flex-direction:column;gap:16px;background:#f9f5eb;overflow:auto}
.dpx-network-side label{font:10px/1.5 sans-serif;letter-spacing:.14em;color:#877454}
.dpx-network-search{width:100%;padding:11px 12px;border:1px solid #cdbb97;background:#fffdf8;color:#453d33;font:13px inherit;outline:none}
.dpx-network-search:focus{border-color:#82414a;box-shadow:0 0 0 3px #82414a18}
.dpx-network-detail{padding:16px;background:#fffdf8;border:1px solid #d8c9ad;min-height:160px}
.dpx-network-detail small{font:9px Georgia,serif;letter-spacing:.16em;color:#9a8157}
.dpx-network-detail h3{font:600 20px 'Shippori Mincho','Yu Mincho',serif;color:#4a3a34;margin:8px 0}
.dpx-network-detail p{font:12px/1.9 sans-serif;color:#75695b;margin:0}
.dpx-network-open{display:inline-flex;margin-top:14px;padding:9px 14px;background:#82414a;color:#fffaf0;font:11px sans-serif;letter-spacing:.08em}
.dpx-network-open:hover{background:#5f2730}
.dpx-network-list{display:grid;gap:5px}
.dpx-network-list button{display:flex;justify-content:space-between;gap:8px;text-align:left;padding:8px 9px;border:1px solid transparent;background:transparent;color:#51483d;font:11px sans-serif;cursor:pointer}
.dpx-network-list button:hover,.dpx-network-list button[aria-current="true"]{background:#efe6d7;border-color:#d6c5a6}
.dpx-network-list span{color:#9a8157;font-size:9px}
.dpx-network-foot{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:11px 20px;border-top:1px solid #d9cdb6;color:#837662;font:10px/1.7 sans-serif;letter-spacing:.04em}
.dpx-network-controls{display:flex;gap:6px}
.dpx-network-controls button{padding:6px 10px;border:1px solid #cdbb97;background:#fffaf0;color:#6d5745;font:11px sans-serif;cursor:pointer}
.dpx-network-controls button:hover{background:#eee4d2}
.dpx-network-count{color:#82414a;font-family:Georgia,serif}
@keyframes dpx-net-fade{from{opacity:0}to{opacity:1}}
@keyframes dpx-net-flow{to{stroke-dashoffset:-220}}
@keyframes dpx-net-rotate{to{transform:rotate(360deg)}}
@media(max-width:800px){.dpx-network-body{grid-template-columns:1fr;grid-template-rows:minmax(260px,1fr) 210px}.dpx-network-side{border-left:0;border-top:1px solid #d9cdb6;padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.dpx-network-side>div:first-of-type{grid-column:1/-1}.dpx-network-detail{min-height:110px}.dpx-network-list{max-height:120px;overflow:auto}.dpx-network-foot{font-size:9px}.dpx-network-launch{left:10px;bottom:10px;padding:9px 12px}}
@media(prefers-reduced-motion:reduce){.dpx-network-overlay,.dpx-network-edge,.dpx-network-node .node-ring{animation:none!important}}
@media print{.dpx-network-launch,.dpx-network-overlay{display:none!important}}
`;document.head.append(css);
const launch=document.createElement("button");launch.className="dpx-network-launch";launch.type="button";launch.innerHTML="<i></i> DIPLOMATIC NETWORK";launch.setAttribute("aria-haspopup","dialog");document.body.append(launch);
const overlay=document.createElement("div");overlay.className="dpx-network-overlay";overlay.setAttribute("aria-hidden","true");overlay.innerHTML=`<section class="dpx-network-shell" role="dialog" aria-modal="true" aria-label="外交情報網・巡覧盤"><header class="dpx-network-head"><div><div class="dpx-network-kicker">IMPERIAL DIPLOMATIC INTELLIGENCE / 01</div><div class="dpx-network-title">外交情報網・巡覧盤</div><small>公開ページ間の参照・閲覧導線を可視化したサイト構造図</small></div><button class="dpx-network-close" type="button" aria-label="閉じる">×</button></header><div class="dpx-network-body"><div class="dpx-network-stage"><svg class="dpx-network-svg" viewBox="0 0 960 680" role="img" aria-label="萬國外交廳の公開ページ接続図" preserveAspectRatio="xMidYMid meet"><g class="edges"></g><g class="nodes"></g></svg></div><aside class="dpx-network-side"><div><label for="dpx-network-search">NODE SEARCH / 接続先検索</label><input class="dpx-network-search" id="dpx-network-search" type="search" placeholder="資料名・国名を入力…"></div><div class="dpx-network-detail"><small>SELECTED DESTINATION</small><h3>本廳</h3><p>ノードを選択すると、公開ページの概要と移動先を表示します。</p></div><div><label>DIRECTORY / 公開ページ一覧</label><div class="dpx-network-list"></div></div></aside></div><footer class="dpx-network-foot"><span><b class="dpx-network-count">15</b> NODES　／　SITE NAVIGATION GRAPH　　※線はサイト内の案内導線を示し、国家間の外交関係を示すものではありません。</span><div class="dpx-network-controls"><button type="button" data-zoom="out">－</button><button type="button" data-zoom="reset">全景</button><button type="button" data-zoom="in">＋</button></div></footer></section>`;document.body.append(overlay);
const svg=overlay.querySelector("svg"),edgeGroup=svg.querySelector(".edges"),nodeGroup=svg.querySelector(".nodes"),list=overlay.querySelector(".dpx-network-list"),detail=overlay.querySelector(".dpx-network-detail"),search=overlay.querySelector("input"),close=overlay.querySelector(".dpx-network-close"),count=overlay.querySelector(".dpx-network-count");
let selected="home",scale=1,tx=0,ty=0;
const scene=document.createElementNS("http://www.w3.org/2000/svg","g");scene.classList.add("scene");edgeGroup.append(scene);
const linkMap=new Map(nodes.map(n=>[n.id,n]));
function make(tag,attrs,parent){const el=document.createElementNS("http://www.w3.org/2000/svg",tag);Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,v));parent.append(el);return el}
edges.forEach(([a,b])=>{const A=linkMap.get(a),B=linkMap.get(b);make("line",{x1:A.x,y1:A.y,x2:B.x,y2:B.y,class:"dpx-network-edge"},scene)});
const nodeEls=new Map();
nodes.forEach(n=>{const g=make("g",{class:"dpx-network-node "+n.type,transform:"translate("+n.x+" "+n.y+")",tabindex:"0",role:"button","aria-label":n.name+"、"+n.sub},scene);if(n.type==="core")make("circle",{r:39,class:"node-ring"},g);make("circle",{r:n.type==="core"?23:n.type==="system"?15:10},g);make("text",{y:n.type==="core"?52:32},g).textContent=n.name;g.addEventListener("click",()=>select(n.id));g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(n.id)}});nodeEls.set(n.id,g)});
function select(id){selected=id;const n=linkMap.get(id);if(!n)return;nodeEls.forEach((g,k)=>g.classList.toggle("selected",k===id));list.querySelectorAll("button").forEach(b=>b.setAttribute("aria-current",String(b.dataset.id===id)));detail.innerHTML="";const sm=document.createElement("small");sm.textContent=n.type==="core"?"CENTRAL OFFICE":n.type==="system"?"INFORMATION SYSTEM":"COUNTRY DOSSIER";const h=document.createElement("h3");h.textContent=n.name;const p=document.createElement("p");p.textContent=n.sub+"。このノードは萬國外交廳の公開ページへの移動先です。";const a=document.createElement("a");a.className="dpx-network-open";a.href=new URL(n.href,location.href).href;a.textContent="この公開頁を開く　↗";detail.append(sm,h,p,a)}
function renderList(q=""){list.innerHTML="";let shown=0;nodes.filter(n=>(n.name+" "+n.sub).toLowerCase().includes(q.toLowerCase())).forEach(n=>{shown++;const b=document.createElement("button");b.type="button";b.dataset.id=n.id;b.innerHTML="<span></span><span>↗</span>";b.firstElementChild.textContent=n.name;b.lastElementChild.textContent=n.type==="country"?"國別":"案内";b.addEventListener("click",()=>select(n.id));list.append(b)});count.textContent=shown+"/"+nodes.length;nodeEls.forEach((g,id)=>g.classList.toggle("dim",!!q&&!((linkMap.get(id).name+" "+linkMap.get(id).sub).toLowerCase().includes(q.toLowerCase()))))}
function transform(){scene.setAttribute("transform","translate("+tx+" "+ty+") scale("+scale+")")}
overlay.querySelectorAll("[data-zoom]").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.zoom;if(v==="reset"){scale=1;tx=0;ty=0}else{const next=Math.max(.72,Math.min(1.8,scale+(v==="in"?.12:-.12)));scale=next}transform()}));
search.addEventListener("input",()=>renderList(search.value));
function open(){overlay.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";close.focus()}
function shut(){overlay.setAttribute("aria-hidden","true");document.body.style.overflow="";launch.focus()}
launch.addEventListener("click",open);close.addEventListener("click",shut);overlay.addEventListener("click",e=>{if(e.target===overlay)shut()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay.getAttribute("aria-hidden")==="false")shut()});
renderList();select("home");
})();