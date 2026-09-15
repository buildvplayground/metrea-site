/* Métrea — interação (editorial). Movimento quieto, respeita reduced-motion.
   Nada depende de animação para existir. */
(function(){
  "use strict";
  var root=document.documentElement;
  var REDUCE=matchMedia("(prefers-reduced-motion:reduce)").matches;
  var FINE=matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* ---------- WhatsApp (placeholder: trocar 5511XXXXXXXXX pelo número real) ---------- */
  var WA="5511XXXXXXXXX";
  var MSG=encodeURIComponent("Olá! Vim pelo site da Métrea e gostaria de falar com um especialista.");
  [].forEach.call(document.querySelectorAll("[data-wa]"),function(a){a.href="https://wa.me/"+WA+"?text="+MSG;a.target="_blank";a.rel="noopener";});
  var yr=document.getElementById("yr"); if(yr) yr.textContent=new Date().getFullYear();

  /* ---------- Menu off-canvas ---------- */
  var hdr=document.querySelector("[data-hdr]"),nav=document.getElementById("nav"),burger=document.getElementById("burger");
  function closeMenu(){hdr.classList.remove("menu-open");nav.classList.remove("open");burger.setAttribute("aria-expanded","false");}
  if(burger){
    burger.addEventListener("click",function(){var o=hdr.classList.toggle("menu-open");nav.classList.toggle("open",o);burger.setAttribute("aria-expanded",o?"true":"false");});
    nav.addEventListener("click",function(e){if(e.target.closest("a"))closeMenu();});
  }

  /* ---------- Header sólido + esconde ao descer + barra de leitura ---------- */
  var lastY=window.pageYOffset,prog=document.querySelector("[data-progress]");
  function onScroll(){
    var y=window.pageYOffset||0;
    hdr.setAttribute("data-solid",y>40?"true":"false");
    if(y>lastY&&y>360&&!hdr.classList.contains("menu-open"))hdr.setAttribute("data-hidden","true");
    else hdr.removeAttribute("data-hidden");
    lastY=y;
    if(prog){var h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?y/h*100:0)+"%";}
  }
  addEventListener("scroll",onScroll,{passive:true}); onScroll();

  /* ---------- Reveals + linhas que desenham ---------- */
  var reveals=[].slice.call(document.querySelectorAll("[data-rev]"));
  reveals.forEach(function(el){
    var p=el.parentNode,sibs=[].filter.call(p.children,function(c){return c.hasAttribute&&c.hasAttribute("data-rev");});
    if(sibs.length>1){var i=sibs.indexOf(el);if(i>0)el.style.transitionDelay=Math.min(i,6)*70+"ms";}
  });
  var draws=[].slice.call(document.querySelectorAll(".draw"));
  draws.forEach(function(p){try{p.style.setProperty("--len",p.getTotalLength());}catch(e){}});
  function show(el){el.classList.add("in");}
  if(REDUCE){reveals.forEach(show);draws.forEach(show);}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target);}});},{threshold:.14,rootMargin:"0px 0px -8% 0px"});
    reveals.forEach(function(el){io.observe(el);});
    var iod=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);iod.unobserve(e.target);}});},{threshold:.25});
    draws.forEach(function(el){iod.observe(el);});
    setTimeout(function(){reveals.concat(draws).forEach(function(el){if(el.getBoundingClientRect().top<innerHeight*.92)show(el);});},150);
    // rede de segurança: revela qualquer bloco que entrou na viewport (cobre saltos de scroll)
    var flush=function(){reveals.forEach(function(el){if(!el.classList.contains("in")&&el.getBoundingClientRect().top<innerHeight*.9)show(el);});
      draws.forEach(function(el){if(!el.classList.contains("in")&&el.getBoundingClientRect().top<innerHeight*.9)show(el);});};
    addEventListener("scroll",flush,{passive:true});
  }

  /* ---------- Hero: entrada no load ---------- */
  var hero=document.querySelector("[data-hero]");
  if(hero){
    if(REDUCE)hero.classList.add("ready");
    else{requestAnimationFrame(function(){requestAnimationFrame(function(){hero.classList.add("ready");});});
      setTimeout(function(){hero.classList.add("ready");},400);}
  }

  /* ---------- Bandas full-width: cortina de revelação ---------- */
  var bands=[].slice.call(document.querySelectorAll("[data-band]"));
  if(REDUCE)bands.forEach(function(b){b.classList.add("in");});
  else{
    var iob=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");iob.unobserve(e.target);}});},{threshold:.2});
    bands.forEach(function(b){iob.observe(b);});
    addEventListener("scroll",function(){bands.forEach(function(b){if(!b.classList.contains("in")&&b.getBoundingClientRect().top<innerHeight*.85)b.classList.add("in");});},{passive:true});
  }

  /* ---------- Parallax elegante (translateY conforme scroll) ---------- */
  var pxEls=[].slice.call(document.querySelectorAll("[data-parallax]"));
  if(!REDUCE&&pxEls.length){
    var pxTick=false;
    function parallax(){
      pxTick=false; var vh=innerHeight;
      pxEls.forEach(function(el){
        var r=el.getBoundingClientRect(); if(r.bottom<-100||r.top>vh+100)return;
        var speed=parseFloat(el.getAttribute("data-parallax"))||.1;
        var center=r.top+r.height/2, off=(center-vh/2)*-speed;
        el.style.transform="translate3d(0,"+off.toFixed(1)+"px,0)";
      });
    }
    addEventListener("scroll",function(){if(!pxTick){pxTick=true;requestAnimationFrame(parallax);}},{passive:true});
    addEventListener("resize",parallax); parallax();
  }

  /* ---------- Contadores ---------- */
  function animCount(el){
    var t=+el.getAttribute("data-count"),dur=1500,t0=null;
    function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(t*e);if(p<1)requestAnimationFrame(step);else el.textContent=t;}
    requestAnimationFrame(step); setTimeout(function(){el.textContent=t;},dur+150);
  }
  var counters=[].slice.call(document.querySelectorAll("[data-count]"));
  if(REDUCE)counters.forEach(function(el){el.textContent=el.getAttribute("data-count");});
  else{
    var ioc=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){animCount(e.target);ioc.unobserve(e.target);}});},{threshold:.5});
    counters.forEach(function(el){ioc.observe(el);});
    setTimeout(function(){counters.forEach(function(el){if(el.textContent==="0"&&el.getBoundingClientRect().top<innerHeight)animCount(el);});},400);
  }

  /* ---------- Scrollspy nav ---------- */
  var links=[].slice.call(document.querySelectorAll(".nav a")).map(function(a){return{a:a,s:document.getElementById(a.getAttribute("href").slice(1))};}).filter(function(m){return m.s;});
  function spy(){var mid=innerHeight*.4,cur=null;links.forEach(function(m){if(m.s.getBoundingClientRect().top<=mid)cur=m;});links.forEach(function(m){m.a.classList.remove("active");});if(cur)cur.a.classList.add("active");}
  addEventListener("scroll",spy,{passive:true}); spy();

  /* ---------- Âncoras suaves ---------- */
  document.addEventListener("click",function(e){
    var a=e.target.closest('a[href^="#"]'); if(!a)return; var id=a.getAttribute("href"); if(id.length<2)return;
    var t=document.querySelector(id); if(!t)return; e.preventDefault();
    window.scrollTo({top:t.getBoundingClientRect().top+window.pageYOffset-60,behavior:REDUCE?"auto":"smooth"});
  });

  /* ---------- Obras: preview flutuante + lightbox ---------- */
  var rows=[].slice.call(document.querySelectorAll(".irow"));
  var prev=document.getElementById("ipreview"),prevImg=prev?prev.querySelector("img"):null;
  var px=0,py=0,tx=0,ty=0,raf=null;
  function follow(){tx+=(px-tx)*.18;ty+=(py-ty)*.18;prev.style.left=tx+"px";prev.style.top=ty+"px";if(Math.abs(px-tx)>.5||Math.abs(py-ty)>.5)raf=requestAnimationFrame(follow);else raf=null;}
  if(FINE&&prev){
    rows.forEach(function(r){
      r.addEventListener("pointerenter",function(){prevImg.src=r.getAttribute("data-full");prev.classList.add("on");});
      r.addEventListener("pointerleave",function(){prev.classList.remove("on");});
    });
    document.querySelector(".index").addEventListener("pointermove",function(e){px=e.clientX;py=e.clientY;if(!raf){tx=px;ty=py;raf=requestAnimationFrame(follow);}});
  }
  // lightbox
  var LIST=rows.map(function(r){return{src:r.getAttribute("data-full"),cap:(r.querySelector("h3")||{}).textContent||"",loc:(r.querySelector(".loc")||{}).textContent||""};});
  var lb=document.getElementById("lb"),lbImg=document.getElementById("lb-img"),lbCap=document.getElementById("lb-cap"),lbCount=document.getElementById("lb-count"),idx=0;
  function render(){var it=LIST[idx];lbImg.src=it.src;lbImg.alt=it.cap;lbCap.textContent=it.cap+(it.loc?"  ·  "+it.loc:"");lbCount.textContent=(idx+1)+" / "+LIST.length;}
  function openLb(i){idx=i;render();lb.classList.add("open");document.body.style.overflow="hidden";document.getElementById("lb-x").focus();}
  function closeLb(){lb.classList.remove("open");document.body.style.overflow="";if(rows[idx])rows[idx].focus();}
  function go(d){idx=(idx+d+LIST.length)%LIST.length;render();}
  rows.forEach(function(r,i){r.addEventListener("click",function(){openLb(i);});r.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();openLb(i);}});});
  document.getElementById("lb-x").addEventListener("click",closeLb);
  document.getElementById("lb-prev").addEventListener("click",function(){go(-1);});
  document.getElementById("lb-next").addEventListener("click",function(){go(1);});
  lb.addEventListener("click",function(e){if(e.target===lb)closeLb();});
  addEventListener("keydown",function(e){if(!lb.classList.contains("open"))return;if(e.key==="Escape")closeLb();else if(e.key==="ArrowLeft")go(-1);else if(e.key==="ArrowRight")go(1);});
  var sx=0;lb.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)go(dx>0?-1:1);},{passive:true});

  /* ---------- Consentimento de cookies (LGPD) + dataLayer ---------- */
  window.dataLayer=window.dataLayer||[];
  var ck=document.getElementById("cookie");
  function consent(v){try{localStorage.setItem("metrea_consent",v);}catch(e){}window.dataLayer.push({event:"cookie_consent",consent:v,analytics_storage:v==="accepted"?"granted":"denied",ad_storage:v==="accepted"?"granted":"denied"});ck.classList.remove("show");}
  var saved=null;try{saved=localStorage.getItem("metrea_consent");}catch(e){}
  if(!saved)setTimeout(function(){ck.classList.add("show");},1400);
  else window.dataLayer.push({event:"cookie_consent",consent:saved,analytics_storage:saved==="accepted"?"granted":"denied",ad_storage:saved==="accepted"?"granted":"denied"});
  var cy=document.getElementById("ck-yes"),cn=document.getElementById("ck-no");
  if(cy)cy.addEventListener("click",function(){consent("accepted");});
  if(cn)cn.addEventListener("click",function(){consent("rejected");});
})();
