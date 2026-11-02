(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const svgNS="http://www.w3.org/2000/svg";
const make=(tag,attrs={},parent)=>{const n=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(parent)parent.append(n);return n};
const text=(parent,tag,attrs,value)=>{const n=make(tag,attrs,parent);n.textContent=value;return n};
const map=$("#world-map"), viewport=$("#map-viewport"), dataUrl="atlas-world.json?v=4.4.1";
let data=null,zoom=1,panX=0,panY=0,selected=null,filter="all",query="",drag=null,measureMode=false,measurePoints=[];
const pathLayer=(id,features,cls)=>{const layer=$("#"+id);features.forEach(f=>{if(f.path)make("path",{d:f.path,class:cls,"data-feature":f.id||""},layer)})};
const coastShapes=new Map();
let coastMeasureLayer=null;
function smoothCoastline(points){
 // Preserve authored headlands, capes and fjords as angular engraved coastline segments.
 return "M"+points.map(p=>p[0]+" "+p[1]).join(" L")+" Z";
}
function coastPath(sourceShape,seed,roughness=1){
 if(!coastMeasureLayer)coastMeasureLayer=make("g",{visibility:"hidden","aria-hidden":"true"},map);
 const sourcePath=Array.isArray(sourceShape)?smoothCoastline(sourceShape):sourceShape;
 const source=make("path",{d:sourcePath,fill:"none",stroke:"none"},coastMeasureLayer);
 const length=source.getTotalLength(),steps=Math.max(420,Math.ceil(length/1.7)),pts=[];
 for(let i=0;i<steps;i++){
  const d=length*i/steps,p=source.getPointAtLength(d);
  const a=source.getPointAtLength(Math.max(0,d-1.15)),b=source.getPointAtLength(Math.min(length,d+1.15));
  const dx=b.x-a.x,dy=b.y-a.y,mag=Math.hypot(dx,dy)||1,nx=-dy/mag,ny=dx/mag;
  const wave=(
   Math.sin(d*.006+seed)*.42+
   Math.sin(d*.019+seed*1.71)*.30+
   Math.sin(d*.047+seed*2.37)*.18+
   Math.sin(d*.112+seed*3.11)*.09+
   Math.sin(d*.247+seed*4.3)*.04
  )*roughness;
  pts.push([p.x+nx*wave,p.y+ny*wave]);
 }
 source.remove();
 return "M"+pts.map(p=>p.map(v=>v.toFixed(2)).join(" ")).join(" L")+" Z";
}
function makeIsletPath(cx,cy,rx,ry,seed){
 const pts=[],count=11;
 for(let i=0;i<count;i++){
  const a=Math.PI*2*i/count;
  const wave=1+Math.sin(a*3+seed)*.19+Math.sin(a*5+seed*1.9)*.11;
  pts.push([cx+Math.cos(a)*rx*wave,cy+Math.sin(a)*ry*wave]);
 }
 return "M"+pts.map(p=>p.map(v=>v.toFixed(2)).join(" ")).join(" L")+" Z";
}
function addOuterIslets(layer){
 const groups=[
  [126,266,7,18,5],[548,476,8,24,4],[590,265,6,20,5],[685,215,7,22,5],
  [775,630,9,30,5],[945,660,7,25,4],[1288,640,8,26,5],[1405,205,8,26,5],
  [1455,270,10,25,6],[1535,345,8,28,5],[1540,505,8,27,6],[1476,568,7,20,5]
 ];
 let seed=31;
 groups.forEach(([cx,cy,n,spread,base],g)=>{
  for(let i=0;i<n;i++){
   const a=i*2.399963+g*.41,r=spread*Math.sqrt((i+.55)/n),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;
   const rx=base*(.28+((i*7+g*3)%9)/15),ry=rx*(.38+((i*5+2)%7)/10);
   make("path",{d:makeIsletPath(x,y,rx,ry,seed++),class:"islet-detail"},layer);
  }
 });
}
function addBathymetry(c,path){
 const layer=$("#bathymetry-layer");
 const offsets=c.id==="north"?[15,27,43]:c.id==="europe"?[12,23,37]:[16,30,48];
 offsets.forEach((n,i)=>{
  make("path",{d:path,class:"bathymetric-contour",transform:`translate(${i%2?n:-n} ${n*.42})`,"stroke-width":i===0?1.6:1.1},layer);
 });
}
function addHachures(f){
 const source=make("path",{d:f.path,fill:"none",stroke:"none"},coastMeasureLayer);
 const total=source.getTotalLength(),layer=$("#terrain-detail-layer");
 for(let d=7;d<total-5;d+=8){
  const p=source.getPointAtLength(d),a=source.getPointAtLength(Math.max(0,d-2)),b=source.getPointAtLength(Math.min(total,d+2));
  const dx=b.x-a.x,dy=b.y-a.y,mag=Math.hypot(dx,dy)||1,nx=dy/mag,ny=-dx/mag;
  const len=3.2+(Math.sin(d*.19)*.5+.5)*4.2;
  make("path",{d:`M${p.x.toFixed(1)} ${p.y.toFixed(1)} l${(nx*len).toFixed(1)} ${(ny*len).toFixed(1)}`,class:"relief-hachure"},layer);
 }
 source.remove();
}
function addMountainEngraving(f){
 const source=make("path",{d:f.path,fill:"none",stroke:"none"},$("#terrain-detail-layer"));
 const total=source.getTotalLength(),layer=$("#terrain-detail-layer");
 for(let d=10;d<total-8;d+=24){
  const p=source.getPointAtLength(d),p0=source.getPointAtLength(Math.max(0,d-2)),p1=source.getPointAtLength(Math.min(total,d+2));
  const angle=Math.atan2(p1.y-p0.y,p1.x-p0.x)*180/Math.PI;
  const g=make("g",{transform:`translate(${p.x} ${p.y}) rotate(${angle}) scale(${.68+(Math.sin(d)*.16)})`},layer);
  make("use",{href:"#mountain-symbol"},g);
  if(d%48<24){const h=make("g",{transform:"translate(18 8) scale(.55)"},layer);make("use",{href:"#mountain-symbol"},h);h.setAttribute("transform",`translate(${p.x+18} ${p.y+8}) scale(.55)`)}
 }
 source.remove();
}
function addForestEngraving(){
 const layer=$("#forest-layer");
 const groves=[
  [150,380,7,26],[185,420,8,22],[270,520,9,24],[350,540,8,20],[420,485,7,22],
  [650,420,6,20],[685,455,7,18],[825,450,8,22],[870,400,7,19],
  [1070,350,8,24],[1130,395,9,23],[1190,500,10,25],[1320,520,9,23],[1400,450,8,22]
 ];
 groves.forEach(([x,y,n,spread])=>{for(let i=0;i<n;i++){const a=i*2.399963,r=spread*Math.sqrt((i+1)/n),xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r;const g=make("g",{transform:`translate(${xx.toFixed(1)} ${yy.toFixed(1)}) scale(${.65+(i%3)*.13})`},layer);make("use",{href:"#forest-symbol"},g)}})
}
function addCoastDetail(){
 const layer=$("#land-layer");
 data.continents.forEach(c=>{
  const d=coastShapes.get(c.id)||c.path;
  make("path",{d,fill:"none",stroke:"#f1e4c5","stroke-width":"1.6","stroke-dasharray":"1.5 2.5",opacity:".82",transform:"translate(0 -1)"},layer);
  make("path",{d,fill:"url(#land-hatch)",stroke:"none",opacity:".76"},layer);
  make("path",{d,fill:"none",stroke:"#6b4d2d","stroke-width":".65",opacity:".7"},layer);
 });
}
function draw(){
 const [,,w,h]=data.viewBox;
 const gr=$("#graticule");make("g",{id:"measurement-layer"},map);
 for(let x=40;x<w;x+=40){
  const major=x%160===0;
  make("path",{d:`M${x} 20 V880`,stroke:major?"#805e32":"#977c52","stroke-width":major?1.05:.55,opacity:major?.31:.18,fill:"none"},gr);
 }
 for(let y=40;y<h;y+=40){
  const major=y%160===0;
  make("path",{d:`M20 ${y} H1580`,stroke:major?"#805e32":"#977c52","stroke-width":major?1.05:.55,opacity:major?.31:.18,fill:"none"},gr);
 }
 [[80,790,1450,130],[20,530,1530,340],[80,100,1430,790],[300,870,1290,30],[30,720,1565,210]].forEach(([x1,y1,x2,y2],i)=>{
  make("path",{d:`M${x1} ${y1} L${x2} ${y2}`,class:"navigation-rhumb","data-rhumb":i},gr);
 });
 const shadows=$("#land-shadow-layer"),lands=$("#land-layer"),terrain=$("#terrain-layer"),water=$("#water-layer"),islands=$("#island-layer"),countries=$("#country-layer"),labels=$("#label-layer");
 data.continents.forEach((c,index)=>{
  const detailed=c.id==="south-isles"?c.path:coastPath(c.coastline||c.path,11+index*19,c.id==="europe"?.18:.18);
  coastShapes.set(c.id,detailed);
  addBathymetry(c,detailed);
  make("path",{d:detailed,class:"continent-shadow",transform:"translate(0 8)"},shadows);
  make("path",{d:detailed,class:"continent-shape","data-continent":c.id},lands);
  make("path",{d:detailed,class:"continent-inner"},lands);
  if(c.id!=="south-isles"){
   const x=c.id==="north"?325:c.id==="europe"?760:1250, y=c.id==="north"?585:c.id==="europe"?610:655;
   text(labels,"text",{x,y,class:"continent-label"},c.name);
   text(labels,"text",{x,y:y+22,class:"continent-sub"},c.sub);
  }
 });
 addCoastDetail();
 data.terrain.forEach(f=>{
  make("path",{d:f.path,class:"terrain-relief"},terrain);
  make("path",{d:f.path,class:"terrain-path"},terrain);
  make("path",{d:f.path,class:"terrain-ridge"},terrain);
  addMountainEngraving(f);
  addHachures(f);
  if(f.label)text(terrain,"text",{x:f.label[0],y:f.label[1],class:"terrain-label","text-anchor":"middle"},f.name);
 });
 addForestEngraving();
 data.rivers.forEach((f,i)=>{
  const major=i<7 || ["north-river","europe-river","east-river"].includes(f.id);
  make("path",{d:f.path,class:"river-bank",stroke:"#e5ddc8","stroke-width":major?"6.2":"4.2",opacity:".82"},water);
  make("path",{d:f.path,class:major?"river river-major":"river river-minor"},water);
 });
 data.lakes.forEach(f=>{
  make("ellipse",{cx:f.cx,cy:f.cy,rx:f.rx+3,ry:f.ry+2,fill:"none",stroke:"#e7ddc7","stroke-width":"2.2"},water);
  make("ellipse",{cx:f.cx,cy:f.cy,rx:f.rx,ry:f.ry,class:"lake"},water);
  if(f.name)text(water,"text",{x:f.cx,y:f.cy+f.ry+12,class:"water-label","text-anchor":"middle"},f.name);
 });
 data.islands.forEach((f,i)=>{
  const d=f.path.includes(" M")?f.path:coastPath(f.path,90+i*7,.72);
  make("path",{d,class:"island-shape"},islands);
 });
 addOuterIslets(islands);
 text(labels,"text",{x:560,y:160,class:"sea-label"},"北央海");
 text(labels,"text",{x:970,y:170,class:"sea-label"},"西方外洋");
 text(labels,"text",{x:930,y:760,class:"sea-label"},"南方海");
 text(labels,"text",{x:1430,y:650,class:"sea-label"},"東海");
 text(labels,"text",{x:275,y:720,class:"sea-label"},"南央海");
 text(labels,"text",{x:1040,y:610,class:"sea-label"},"南方外洋");
 text(labels,"text",{x:570,y:570,class:"sea-label"},"西方海峽");
 text(labels,"text",{x:1480,y:185,class:"sea-label"},"北東海");
 text(labels,"text",{x:1518,y:600,class:"sea-label"},"日ノ本海溝");
 data.countries.forEach((c,i)=>{
  const g=make("g",{class:"country-node","data-country":c.id,tabindex:"0",role:"button","aria-label":c.name+"（"+c.region+"）","aria-pressed":"false"},countries);
  make("circle",{cx:c.x,cy:c.y,r:20,class:"node-halo"},g);
  make("circle",{cx:c.x,cy:c.y,r:7,class:"node-ring"},g);
  text(g,"text",{x:c.labelX??c.x+13,y:c.labelY??c.y-10,"text-anchor":c.anchor??"start"},c.name);
  g.addEventListener("click",()=>select(c.id));
  g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(c.id)}});
 });
 $("#feature-count").textContent=data.continents.length+" 大陸・島嶼域 ／ "+data.islands.length+" 島嶼群 ／ "+data.terrain.length+" 山地系 ／ "+data.rivers.length+" 河川 ／ "+data.lakes.length+" 湖沼 ／ "+data.countries.length+" 國・地域標　・　古典銅版畫式描法";
}
function select(id){
 selected=data.countries.find(c=>c.id===id);if(!selected)return;
 document.querySelectorAll(".country-node").forEach(n=>n.setAttribute("aria-pressed",String(n.dataset.country===id)));
 const c=selected, idx=String(data.countries.indexOf(c)+1).padStart(2,"0");
 $("#country-detail").innerHTML=`<div class="detail-kicker">GEOGRAPHICAL INDEX / SELECTED REGION</div><div class="detail-number">${idx}</div><h2>${c.name}</h2><p>${c.note}</p><div class="detail-rule"></div><dl><div><dt>所在地域</dt><dd>${c.region}</dd></div><div><dt>英語表記</dt><dd>${c.en}</dd></div><div><dt>表示区分</dt><dd>正史資料に基づく地域表示</dd></div><div><dt>國境情報</dt><dd>未確定・本圖では線引きしない</dd></div></dl><a class="detail-link" href="${c.url}">${c.id==="hinomoto"?"帝國政府案内を閲覧する":"國別外交資料を閲覧する"} ↗</a>`;
}
function applyFilter(){
 const nodes=[...document.querySelectorAll(".country-node")];
 let visible=0;
 nodes.forEach(n=>{
  const c=data.countries.find(x=>x.id===n.dataset.country);
  const ok=(filter==="all"||c.group===filter)&&(!query||(c.name+" "+c.region+" "+c.en).toLowerCase().includes(query.toLowerCase()));
  n.hidden=!ok;if(ok)visible++;
 });
 $("#feature-count").textContent=visible+" 國・地域を表示 ／ 地理形状は独立作図データ";
}
function applyZoom(){map.style.transform=`translate(${panX}px,${panY}px) scale(${zoom})`;map.style.transformOrigin="center center";const pct=Math.round(zoom*100);const range=$("#zoom-range"),value=$("#zoom-value");if(range)range.value=pct;if(value)value.textContent=pct+"%"}
function mapPoint(e){const r=map.getBoundingClientRect();return{x:Math.max(0,Math.min(1600,(e.clientX-r.left)/r.width*1600)),y:Math.max(0,Math.min(900,(e.clientY-r.top)/r.height*900))}}
function setZoom(next,x,y){const old=zoom;next=Math.max(.75,Math.min(2.2,next));if(next===old)return;if(Number.isFinite(x)&&Number.isFinite(y)){const r=viewport.getBoundingClientRect(),cx=x-r.left-r.width/2,cy=y-r.top-r.height/2,k=next/old;panX=cx-(cx-panX)*k;panY=cy-(cy-panY)*k}zoom=next;applyZoom()}
function toggleMeasure(){measureMode=!measureMode;measurePoints=[];const b=$("#measure-toggle");b.setAttribute("aria-pressed",String(measureMode));b.classList.toggle("is-active",measureMode);$("#measure-readout").textContent=measureMode?"地圖上の始點を選択":"地圖上の二點を選択して測距";map.style.cursor=measureMode?"crosshair":"grab"}
function updateMeasure(p){const layer=$("#measurement-layer");layer.replaceChildren();measurePoints.push(p);make("circle",{cx:p.x,cy:p.y,r:7,class:"measure-point"},layer);if(measurePoints.length===1){$("#measure-readout").textContent="終點を選択してください";return}const [a,b]=measurePoints,dist=Math.hypot(b.x-a.x,b.y-a.y);make("path",{d:`M${a.x} ${a.y} L${b.x} ${b.y}`,class:"measure-line"},layer);text(layer,"text",{x:(a.x+b.x)/2,y:(a.y+b.y)/2-12,class:"measure-label","text-anchor":"middle"},dist.toFixed(1)+" 作圖單位");$("#measure-readout").textContent="直線距離："+dist.toFixed(1)+" 作圖單位";measurePoints=[];measureMode=false;$("#measure-toggle").setAttribute("aria-pressed","false");$("#measure-toggle").classList.remove("is-active");map.style.cursor="grab"}
function exportMap(){const clone=map.cloneNode(true);clone.setAttribute("xmlns",svgNS);clone.removeAttribute("style");const source=new XMLSerializer().serializeToString(clone);const blob=new Blob([source],{type:"image/svg+xml;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="hinomoto-atlas.svg";document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url)}
async function init(){
 try{
  const res=await fetch(dataUrl,{cache:"no-store"});if(!res.ok)throw new Error("地理データを取得できません");data=await res.json();
  draw();$("#data-status").textContent="独立地理データ接続済";$("#region-filter").addEventListener("change",e=>{filter=e.target.value;applyFilter()});
  $("#country-search").addEventListener("input",e=>{query=e.target.value.trim();applyFilter()});
  document.querySelectorAll("[data-zoom]").forEach(b=>b.addEventListener("click",()=>{zoom=Math.max(.75,Math.min(1.8,zoom+(b.dataset.zoom==="in"?.15:-.15)));applyZoom()}));
  $("#reset-view").addEventListener("click",()=>{zoom=1;applyZoom();$("#country-search").value="";$("#region-filter").value="all";query="";filter="all";applyFilter()});
  document.querySelectorAll("[data-layer]").forEach(c=>c.addEventListener("change",()=>{const groups={terrain:["#terrain-layer","#terrain-detail-layer"],water:["#water-layer"],countries:["#country-layer"],labels:["#label-layer"],bathymetry:["#bathymetry-layer"],graticule:["#graticule"],routes:[".navigation-rhumb"],forests:["#forest-layer"]};(groups[c.dataset.layer]||[]).forEach(sel=>$(sel).classList.toggle("layer-off",!c.checked))}));
  document.querySelectorAll("[data-zoom]").forEach(b=>b.addEventListener("click",()=>setZoom(zoom+(b.dataset.zoom==="in"?.15:-.15))));
  $("#zoom-range").addEventListener("input",e=>setZoom(Number(e.target.value)/100));$("#measure-toggle").addEventListener("click",toggleMeasure);$("#export-map").addEventListener("click",exportMap);
  $("#fullscreen-map").addEventListener("click",async()=>{try{if(!document.fullscreenElement)await $(".map-frame").requestFullscreen();else await document.exitFullscreen()}catch(e){$("#map-interaction-hint").textContent="全畫面表示はこの環境で利用できません"}});
  $("#reset-view").addEventListener("click",()=>{zoom=1;panX=0;panY=0;applyZoom();$("#country-search").value="";$("#region-filter").value="all";query="";filter="all";applyFilter()});
  viewport.addEventListener("pointerdown",e=>{if(e.target.closest(".country-node")||measureMode)return;drag={x:e.clientX,y:e.clientY,px:panX,py:panY};viewport.setPointerCapture(e.pointerId);map.style.cursor="grabbing"});
  viewport.addEventListener("pointermove",e=>{const p=mapPoint(e);$("#map-coordinates").textContent="X "+Math.round(p.x)+"　Y "+Math.round(p.y);if(drag){panX=drag.px+e.clientX-drag.x;panY=drag.py+e.clientY-drag.y;applyZoom()}});
  viewport.addEventListener("pointerup",()=>{drag=null;map.style.cursor=measureMode?"crosshair":"grab"});viewport.addEventListener("pointercancel",()=>{drag=null;map.style.cursor="grab"});
  viewport.addEventListener("click",e=>{if(measureMode&&!e.target.closest(".country-node"))updateMeasure(mapPoint(e))});
  viewport.addEventListener("wheel",e=>{e.preventDefault();setZoom(zoom+(e.deltaY<0?.08:-.08),e.clientX,e.clientY)},{passive:false});
  viewport.addEventListener("dblclick",e=>{if(!e.target.closest(".country-node"))setZoom(zoom+.2,e.clientX,e.clientY)});
  viewport.addEventListener("keydown",e=>{const k=45;if(e.key==="ArrowLeft")panX+=k;else if(e.key==="ArrowRight")panX-=k;else if(e.key==="ArrowUp")panY+=k;else if(e.key==="ArrowDown")panY-=k;else if(e.key==="+"||e.key==="=")setZoom(zoom+.1);else if(e.key==="-")setZoom(zoom-.1);else return;e.preventDefault();applyZoom()});map.style.cursor="grab";applyZoom();
 }catch(err){$("#data-status").textContent="地理データ読込失敗";$("#feature-count").textContent=err.message;console.error(err)}
}
init();
})();