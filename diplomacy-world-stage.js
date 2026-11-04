/* Interactive atlas hero — reads the same authored geography as atlas.html */
(()=>{"use strict";
const hero=document.querySelector(".ix-hero");
if(!hero||document.documentElement.dataset.dpxWorldStage==="1")return;
document.documentElement.dataset.dpxWorldStage="1";
const oldCommand=document.querySelector(".ic-command");
if(oldCommand)oldCommand.remove();
const host=hero.querySelector(".ix-hero-visual");
if(!host)return;
hero.classList.add("dpx-world-hero");
host.replaceChildren();
host.setAttribute("aria-label","萬國全圖・國別選択盤");
const NS="http://www.w3.org/2000/svg";
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const svg=(tag,attrs,parent)=>{const n=document.createElementNS(NS,tag);Object.keys(attrs||{}).forEach(k=>n.setAttribute(k,attrs[k]));if(parent)parent.append(n);return n};
const stage=el("section","dpx-world-console");
stage.setAttribute("aria-label","操作できる世界地理情報網");
const head=el("header","dpx-world-head");
const brand=el("div","dpx-world-brand");
brand.append(el("small","dpx-world-kicker","THE IMPERIAL ATLAS / PUBLIC GEOGRAPHICAL INDEX"),el("strong","dpx-world-heading","世界地理情報網"));
const allMap=el("a","","萬國全圖・全圖版 ↗");allMap.href="atlas.html";
head.append(brand,allMap);
const body=el("div","dpx-world-body");
const mapColumn=el("div","dpx-world-map-column");
const mapTop=el("div","dpx-world-map-top");
mapTop.append(el("strong","","INDEPENDENT WORLD COORDINATES"),el("span","dpx-world-map-count","地理資料を照合中"));
const map=document.createElementNS(NS,"svg");
map.classList.add("dpx-world-svg");map.setAttribute("viewBox","0 0 1600 900");map.setAttribute("role","group");map.setAttribute("aria-label","國・地域標を選択できる世界地図。拡大縮小とドラッグに対応。");
const defs=svg("defs",{},map);
const landPattern=svg("pattern",{id:"dpxWorldLand",patternUnits:"userSpaceOnUse",width:"18",height:"18"},defs);
svg("rect",{width:"18",height:"18",fill:"#d3c29f"},landPattern);
svg("path",{d:"M0 18L18 0M-4 4L4 -4M14 22L22 14",stroke:"#ad9870","stroke-width":".7",opacity:".36"},landPattern);
const glow=svg("radialGradient",{id:"dpxWorldSea"},defs);
svg("stop",{offset:"0%","stop-color":"#f8f2e3"},glow);svg("stop",{offset:"100%","stop-color":"#e1d6c0"},glow);
svg("rect",{x:"0",y:"0",width:"1600",height:"900",fill:"url(#dpxWorldSea)"},map);
const grid=svg("g",{class:"dpx-world-grid"},map);
for(let x=80;x<1600;x+=80)svg("path",{d:"M"+x+" 20V880"},grid);
for(let y=80;y<900;y+=80)svg("path",{d:"M20 "+y+"H1580"},grid);
const rhumb=svg("g",{class:"dpx-world-rhumb"},map);
[[50,760,1540,150],[80,180,1500,760],[30,450,1570,450],[300,30,1280,870]].forEach(p=>svg("path",{d:"M"+p[0]+" "+p[1]+"L"+p[2]+" "+p[3]},rhumb));
const scene=svg("g",{},map);
const landLayer=svg("g",{},scene);
const continentLabels=svg("g",{},scene);
const arc=svg("path",{class:"dpx-world-connection",visibility:"hidden"},scene);
const nodeLayer=svg("g",{},scene);
const labelPositions={north:[325,585],europe:[760,625],east:[1250,655]};
const mapTools=el("div","dpx-world-controls");
const zoomIn=el("button","","＋"),zoomOut=el("button","","－"),zoomReset=el("button","","↺");
zoomIn.type=zoomOut.type=zoomReset.type="button";
zoomIn.setAttribute("aria-label","地図を拡大");zoomOut.setAttribute("aria-label","地図を縮小");zoomReset.setAttribute("aria-label","地図を初期表示に戻す");
mapTools.append(zoomIn,zoomOut,zoomReset);
mapColumn.append(mapTop,map,mapTools);
const side=el("aside","dpx-world-side");
const sideHead=el("div","dpx-world-side-head");
sideHead.append(el("small","","COUNTRY / REGION DOSSIERS"),el("strong","","國・地域を選択してください"));
const searchLabel=el("label","dpx-world-search");
searchLabel.append(el("span","","國名・地域名から検索"));
const search=el("input");search.type="search";search.placeholder="例：竜棘國、東歐";search.setAttribute("aria-label","國名・地域検索");search.autocomplete="off";searchLabel.append(search);
const list=el("div","dpx-world-list");list.setAttribute("aria-label","國・地域の一覧");
const detail=el("section","dpx-world-detail");detail.setAttribute("aria-live","polite");detail.setAttribute("aria-label","選択中の國・地域の資料");
side.append(sideHead,searchLabel,list,detail);
const foot=el("footer","dpx-world-foot");
foot.append(el("span","","選択した標から國別資料へ接続できます。"),el("strong","","線は資料照会を示す操作表示で、外交関係・条約・交通路ではありません。"));
body.append(mapColumn,side);
stage.append(head,body,foot);
host.append(stage);
let data=null,selectedId=null,zoom=1,tx=0,ty=0,drag=null,suppressClick=false;
const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function setTransform(){scene.setAttribute("transform","translate("+tx+" "+ty+") scale("+zoom+")")}
function limitPan(){const x=1600*(1-zoom),y=900*(1-zoom);tx=Math.min(0,Math.max(x,tx));ty=Math.min(0,Math.max(y,ty))}
function zoomAt(next,x,y){const z=Math.max(1,Math.min(2.35,next));const ratio=z/zoom;tx=x-(x-tx)*ratio;ty=y-(y-ty)*ratio;zoom=z;limitPan();setTransform()}
function resetView(){zoom=1;tx=0;ty=0;setTransform()}
function setArc(country){
 const home=data.countries.find(c=>c.id==="hinomoto");
 if(!country||!home||country.id==="hinomoto"){arc.setAttribute("visibility","hidden");return}
 const mx=(country.x+home.x)/2,my=Math.min(country.y,home.y)-Math.max(75,Math.abs(home.x-country.x)*.10);
 arc.setAttribute("d","M"+country.x+" "+country.y+" Q"+mx+" "+my+" "+home.x+" "+home.y);
 arc.setAttribute("visibility","visible");
}
function setDetail(country){
 detail.replaceChildren();
 const kind=country.id==="hinomoto"?"IMPERIAL HOME DOSSIER":"COUNTRY DOSSIER";
 detail.append(el("small","",kind),el("h3","",country.name),el("span","dpx-world-en",country.en||""));
 const region=el("p","",country.region+"。"+(country.note||""));
 detail.append(region);
 const link=el("a","","公開資料を開く　↗");link.href=country.url||"atlas.html";
 if(/^https?:\/\//i.test(country.url||""))link.rel="noopener";
 detail.append(link);
}
function selectCountry(id){
 const c=data.countries.find(x=>x.id===id);if(!c)return;
 selectedId=id;
 nodeLayer.querySelectorAll(".dpx-world-node").forEach(n=>{
  const active=n.dataset.id===id;n.classList.toggle("is-selected",active);n.setAttribute("aria-pressed",String(active));
 });
 list.querySelectorAll("button[data-id]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.id===id)));
 sideHead.querySelector("strong").textContent=c.name+"　／　"+c.region;
 setDetail(c);setArc(c);
}
function renderList(query){
 const q=query.normalize("NFKC").toLocaleLowerCase().trim();
 const matches=data.countries.filter(c=>(c.name+" "+c.en+" "+c.region+" "+(c.note||"")).normalize("NFKC").toLocaleLowerCase().includes(q));
 list.replaceChildren();
 matches.forEach(c=>{
  const b=el("button","",c.name);b.type="button";b.dataset.id=c.id;b.title=c.region;b.setAttribute("aria-pressed",String(c.id===selectedId));
  b.addEventListener("click",()=>selectCountry(c.id));list.append(b);
 });
 if(!matches.length)list.append(el("p","dpx-world-empty","該当する國・地域はありません。"));
 nodeLayer.querySelectorAll(".dpx-world-node").forEach(n=>n.classList.toggle("is-dimmed",!!q&&!matches.some(c=>c.id===n.dataset.id)));
 mapTop.querySelector(".dpx-world-map-count").textContent=matches.length+" / "+data.countries.length+" 國・地域";
}
function drawWorld(world){
 data=world;
 world.continents.forEach((c,i)=>{
  if(!c.path)return;
  const shadow=svg("path",{d:c.path,class:"dpx-world-land-shadow"},landLayer);
  const land=svg("path",{d:c.path,class:"dpx-world-land"},landLayer);
  land.setAttribute("aria-label",c.name);
  svg("path",{d:c.path,class:"dpx-world-coast"},landLayer);
  if(labelPositions[c.id])svg("text",{x:labelPositions[c.id][0],y:labelPositions[c.id][1],class:"dpx-world-continent-label"},continentLabels).textContent=c.name;
 });
 [["北央海",560,160],["西方外洋",970,170],["南方海",930,760],["東海",1430,650]].forEach(([name,x,y])=>svg("text",{x,y,class:"dpx-world-sea-label","text-anchor":"middle"},scene).textContent=name);
 const home=world.countries.find(c=>c.id==="hinomoto");
 world.countries.forEach(c=>{
  const g=svg("g",{class:"dpx-world-node",transform:"translate("+c.x+" "+c.y+")",tabindex:"0",role:"button","aria-label":c.name+"、"+c.region,"aria-pressed":"false"},nodeLayer);
  g.dataset.id=c.id;
  svg("circle",{r:"25",class:"dpx-world-halo"},g);
  svg("circle",{r:"13",class:"dpx-world-node-ring"},g);
  svg("circle",{r:"7.5",class:"dpx-world-dot"},g);
  const title=svg("title",{},g);title.textContent=c.name+" ／ "+c.region;
  g.addEventListener("click",()=>{if(suppressClick)return;selectCountry(c.id)});
  g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectCountry(c.id)}});
 });
 renderList("");
 if(home)selectCountry("hinomoto");
 setTransform();
}
zoomIn.addEventListener("click",()=>zoomAt(zoom+.25,800,450));
zoomOut.addEventListener("click",()=>zoomAt(zoom-.25,800,450));
zoomReset.addEventListener("click",resetView);
map.addEventListener("wheel",e=>{
 e.preventDefault();const r=map.getBoundingClientRect();
 zoomAt(zoom+(e.deltaY<0?.12:-.12),((e.clientX-r.left)/r.width)*1600,((e.clientY-r.top)/r.height)*900);
},{passive:false});
map.addEventListener("pointerdown",e=>{
 if(e.target.closest&&e.target.closest(".dpx-world-node"))return;
 drag={x:e.clientX,y:e.clientY,tx:tx,ty:ty,moved:false};map.classList.add("is-dragging");map.setPointerCapture(e.pointerId);
});
map.addEventListener("pointermove",e=>{
 if(!drag)return;
 const r=map.getBoundingClientRect(),dx=(e.clientX-drag.x)*1600/r.width,dy=(e.clientY-drag.y)*900/r.height;
 if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;
 tx=drag.tx+dx;ty=drag.ty+dy;limitPan();setTransform();
});
function endDrag(){
 if(!drag)return;
 suppressClick=drag.moved;drag=null;map.classList.remove("is-dragging");
 if(suppressClick)requestAnimationFrame(()=>{suppressClick=false});
}
map.addEventListener("pointerup",endDrag);map.addEventListener("pointercancel",endDrag);map.addEventListener("lostpointercapture",endDrag);
search.addEventListener("input",()=>renderList(search.value));
fetch("atlas-world.json?v=4.7.1",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("地理資料を取得できません");return r.json()}).then(drawWorld).catch(()=>{
 mapTop.querySelector(".dpx-world-map-count").textContent="地理資料を読み込めません";
 list.append(el("p","dpx-world-empty","萬國全圖のデータを取得できませんでした。"));
 detail.append(el("p","","全図版から地理資料をご確認ください。"));
});
})();
