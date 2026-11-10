var WA=CONFIG.wa;
document.title=CONFIG.brand+" · Reserva directa";
document.getElementById("brand").textContent=CONFIG.brand;
document.getElementById("footer").textContent=CONFIG.footer;
var units=CONFIG.units;
var meses=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var today=new Date();today=new Date(today.getFullYear(),today.getMonth(),today.getDate());
var cur=0,view=new Date(today.getFullYear(),today.getMonth(),1),a=null,b=null;
var $=function(i){return document.getElementById(i)};
function dn(d){return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)}
function busy(u,d){var k=Math.floor((dn(d)+u*3)/4);return ((k*31+u*17)*2654435761>>>0)%5===0}
function fmt(d){return d.getDate()+" de "+meses[d.getMonth()]}
function money(n){return "$"+n.toLocaleString("es-MX")}
function freeBetween(s,e){for(var x=new Date(s);x<e;x.setDate(x.getDate()+1)){if(busy(cur,x))return false}return true}
$("dows").innerHTML=["L","M","M","J","V","S","D"].map(function(x){return '<div class="dow">'+x+'</div>'}).join("");
$("units").innerHTML=units.map(function(u,i){return '<button class="unit" data-i="'+i+'" aria-pressed="'+(i===cur)+'"><div class="sw" style="background:'+u.c+'"></div><b>'+u.n.split(" · ")[0]+'</b><span>'+u.n.split(" · ")[1]+' · '+u.cap+' personas · '+money(u.p)+'</span></button>'}).join("");
$("units").onclick=function(e){var t=e.target.closest(".unit");if(!t)return;cur=+t.dataset.i;a=b=null;[].forEach.call(document.querySelectorAll(".unit"),function(x){x.setAttribute("aria-pressed",x===t)});draw();if(innerWidth<900)$("booking").scrollIntoView({behavior:"smooth"})};
$("prev").onclick=function(){view=new Date(view.getFullYear(),view.getMonth()-1,1);draw()};
$("next").onclick=function(){view=new Date(view.getFullYear(),view.getMonth()+1,1);draw()};
$("days").onclick=function(e){var t=e.target.closest(".d");if(!t||t.disabled)return;var d=new Date(+t.dataset.t);
if(!a||b){a=d;b=null}else if(d<=a){a=d}else if(freeBetween(a,d)){b=d}else{a=d}draw()};
function draw(){
var u=units[cur],y=view.getFullYear(),m=view.getMonth();
$("month").textContent=meses[m]+" "+y;$("uname").textContent=u.n;
$("prev").disabled=(y===today.getFullYear()&&m===today.getMonth());
var first=new Date(y,m,1),off=(first.getDay()+6)%7,n=new Date(y,m+1,0).getDate(),h="";
for(var i=0;i<off;i++)h+="<span></span>";
for(var day=1;day<=n;day++){var d=new Date(y,m,day),past=d<today,bz=!past&&busy(cur,d),cl="d";
if(bz)cl+=" busy";
if(a&&d.getTime()===a.getTime())cl+=" edge";else if(b&&d.getTime()===b.getTime())cl+=" edge";else if(a&&b&&d>a&&d<b)cl+=" in";
h+='<button class="'+cl+'" data-t="'+d.getTime()+'"'+((past||(bz&&!(a&&!b&&d>a)))?" disabled":"")+' aria-label="'+fmt(d)+(bz?", ocupado":"")+'">'+day+"</button>"}
$("days").innerHTML=h;
$("ppn").textContent=money(u.p)+" por noche";
var ok=a&&b,nt=ok?(dn(b)-dn(a)):0,tot=nt*u.p;
$("range").textContent=ok?fmt(a)+" al "+fmt(b):(a?"Ahora elige tu salida":"Elige tu llegada y tu salida");
$("nights").textContent=ok?nt+(nt===1?" noche":" noches"):"";
$("total").textContent=ok?money(tot):"";
var cta=$("wa");cta.setAttribute("aria-disabled",ok?"false":"true");
var msg=ok?"Hola, quiero reservar el "+u.n.split(" · ")[0]+" del "+fmt(a)+" al "+fmt(b)+" ("+nt+(nt===1?" noche":" noches")+"). Total estimado: "+money(tot)+".":"";
cta.href=ok?"https://wa.me/"+WA+"?text="+encodeURIComponent(msg):"#";
cta.onclick=ok?null:function(e){e.preventDefault()};
}
$("wa-top").href="https://wa.me/"+WA+"?text="+encodeURIComponent("Hola, vi la página y tengo una duda.");
draw();
