(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const svgNS="http://www.w3.org/2000/svg";
const make=(tag,attrs={},parent)=>{const n=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(parent)parent.append(n);return n};
const text=(parent,tag,attrs,value)=>{const n=make(tag,attrs,parent);n.textContent=value;return n};
const map=$("#world-map"), viewport=$("#map-viewport"), dataUrl="atlas-world.json";
let data=null,zoom=1,selected=null,filter="all",query="";
const pathLayer=(id,features,cls)=>{const layer=$("#"+id);features.forEach(f=>{if(f.path)make("path",{d:f.path,class:cls,"data-feature":f.id||""},layer)})};
function draw(){
 const [,,w,h]=data.viewBox;
 const gr=$("#graticule");
 for(let x=80;x<w;x+=80)make("path",{d:`M${x} 0V900`,stroke:"#8d8268","stroke-width":1,"stroke-dasharray":"2 9",opacity:.22},gr);
 for(let y=60;y<h;y+=60)make("path",{d:`M0 ${y}H1600`,stroke:"#8d8268","stroke-width":1,"stroke-dasharray":"2 9",opacity:.22},gr);
 const shadows=$("#land-shadow-layer"),lands=$("#land-layer"),terrain=$("#terrain-layer"),water=$("#water-layer"),islands=$("#island-layer"),countries=$("#country-layer"),labels=$("#label-layer");
 data.continents.forEach(c=>{
  make("path",{d:c.path,class:"continent-shadow",transform:"translate(0 9)"},shadows);
  make("path",{d:c.path,class:"continent-shape","data-continent":c.id},lands);
  make("path",{d:c.path,class:"continent-inner"},lands);
  if(c.id!=="south-isles"){
   const x=c.id==="north"?325:c.id==="europe"?760:1250, y=c.id==="north"?585:c.id==="europe"?610:655;
   text(labels,"text",{x,y,class:"continent-label"},c.name);
   text(labels,"text",{x,y:y+22,class:"continent-sub"},c.sub);
  }
 });
 data.terrain.forEach(f=>{
  make("path",{d:f.path,class:"terrain-path"},terrain);
  make("path",{d:f.path,class:"terrain-ridge"},terrain);
  if(f.label)text(terrain,"text",{x:f.label[0],y:f.label[1],class:"terrain-label","text-anchor":"middle"},f.name);
 });
 data.rivers.forEach(f=>make("path",{d:f.path,class:"river"},water));
 data.lakes.forEach(f=>make("ellipse",{cx:f.cx,cy:f.cy,rx:f.rx,ry:f.ry,class:"lake"},water));
 data.islands.forEach(f=>make("path",{d:f.path,class:"island-shape"},islands));
 text(labels,"text",{x:560,y:160,class:"sea-label"},"北央海");
 text(labels,"text",{x:970,y:170,class:"sea-label"},"西方外洋");
 text(labels,"text",{x:930,y:760,class:"sea-label"},"南方海");
 text(labels,"text",{x:1430,y:650,class:"sea-label"},"東海");
 data.countries.forEach((c,i)=>{
  const g=make("g",{class:"country-node","data-country":c.id,tabindex:"0",role:"button","aria-label":c.name+"（"+c.region+"）","aria-pressed":"false"},countries);
  make("circle",{cx:c.x,cy:c.y,r:20,class:"node-halo"},g);
  make("circle",{cx:c.x,cy:c.y,r:7,class:"node-ring"},g);
  text(g,"text",{x:c.x+13,y:c.y-10},c.name);
  g.addEventListener("click",()=>select(c.id));
  g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(c.id)}});
 });
 $("#feature-count").textContent=data.continents.length+" 大陸・島嶼域 ／ "+data.terrain.length+" 山地系 ／ "+data.rivers.length+" 河川 ／ "+data.lakes.length+" 湖沼 ／ "+data.countries.length+" 國・地域標";
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
function applyZoom(){map.style.transform=`scale(${zoom})`;map.style.transformOrigin="center center"}
async function init(){
 try{
  const res=await fetch(dataUrl,{cache:"no-store"});if(!res.ok)throw new Error("地理データを取得できません");data=await res.json();
  draw();$("#data-status").textContent="独立地理データ接続済";$("#region-filter").addEventListener("change",e=>{filter=e.target.value;applyFilter()});
  $("#country-search").addEventListener("input",e=>{query=e.target.value.trim();applyFilter()});
  document.querySelectorAll("[data-zoom]").forEach(b=>b.addEventListener("click",()=>{zoom=Math.max(.75,Math.min(1.8,zoom+(b.dataset.zoom==="in"?.15:-.15)));applyZoom()}));
  $("#reset-view").addEventListener("click",()=>{zoom=1;applyZoom();$("#country-search").value="";$("#region-filter").value="all";query="";filter="all";applyFilter()});
  document.querySelectorAll("[data-layer]").forEach(c=>c.addEventListener("change",()=>{const id=c.dataset.layer;const target=id==="terrain"?"#terrain-layer":id==="water"?"#water-layer":id==="countries"?"#country-layer": "#label-layer";$(target).classList.toggle("layer-off",!c.checked)}));
  viewport.addEventListener("wheel",e=>{if(e.ctrlKey){e.preventDefault();zoom=Math.max(.75,Math.min(1.8,zoom+(e.deltaY<0?.06:-.06)));applyZoom()}},{passive:false});
 }catch(err){$("#data-status").textContent="地理データ読込失敗";$("#feature-count").textContent=err.message;console.error(err)}
}
init();
})();