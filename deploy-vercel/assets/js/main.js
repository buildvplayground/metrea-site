/* Métrea — motor de interação e movimento
   Coerente com sistema-de-movimento.md: gate data-motion, reveals + 3 gatilhos,
   split de título, cotas que desenham, contadores, header, lerp (ponteiro fino),
   respeita prefers-reduced-motion. Nada depende de animação para existir.        */
(function(){
  "use strict";
  var root=document.documentElement;
  var REDUCE=matchMedia("(prefers-reduced-motion:reduce)").matches;
  var FINE=matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* ---------- WhatsApp (placeholder — trocar 5511XXXXXXXXX pelo número real) ---------- */
  var WA="5511XXXXXXXXX";
  var MSG=encodeURIComponent("Olá! Vim pelo site da Métrea e gostaria de falar com um especialista.");
  [].forEach.call(document.querySelectorAll("[data-wa]"),function(a){
    a.href="https://wa.me/"+WA+"?text="+MSG; a.target="_blank"; a.rel="noopener";
  });
  var y=document.getElementById("yr"); if(y) y.textContent=new Date().getFullYear();

  /* ---------- Menu off-canvas ---------- */
  var hdr=document.querySelector("[data-hdr]"), nav=document.getElementById("nav"), burger=document.getElementById("burger");
  function closeMenu(){hdr.classList.remove("menu-open");nav.classList.remove("open");burger.setAttribute("aria-expanded","false");}
  if(burger){
    burger.addEventListener("click",function(){
      var open=hdr.classList.toggle("menu-open"); nav.classList.toggle("open",open);
      burger.setAttribute("aria-expanded",open?"true":"false");
    });
    nav.addEventListener("click",function(e){ if(e.target.closest("a")) closeMenu(); });
  }

  /* ---------- Header: sólido sempre (navy), esconde ao descer ---------- */
  var lastY=window.pageYOffset, prog=document.querySelector("[data-progress]");
  function onScroll(){
    var yy=window.pageYOffset||0;
    if(yy>lastY && yy>320 && !hdr.classList.contains("menu-open")) hdr.setAttribute("data-hidden","true");
    else hdr.removeAttribute("data-hidden");
    lastY=yy;
    if(prog){var h=document.documentElement.scrollHeight-innerHeight; prog.style.width=(h>0?(yy/h*100):0)+"%";}
  }
  addEventListener("scroll",onScroll,{passive:true}); onScroll();

  /* ---------- Split de título do hero (palavra por palavra) ---------- */
  if(!REDUCE){
    var hh=document.querySelector("[data-hero-h]");
    if(hh && hh.children.length===0){
      var words=hh.textContent.trim().split(/\s+/);
      hh.textContent="";
      words.forEach(function(w,i){
        var s=document.createElement("span");
        s.style.cssText="display:inline-block;overflow:hidden;vertical-align:top";
        var it=document.createElement("i");
        it.textContent=w; it.style.cssText="display:inline-block;font-style:normal;transform:translateY(110%);transition:transform .9s cubic-bezier(.16,.84,.28,1) "+(i*46)+"ms";
        s.appendChild(it); hh.appendChild(s);
        if(i<words.length-1) hh.appendChild(document.createTextNode(" "));
      });
      requestAnimationFrame(function(){setTimeout(function(){
        [].forEach.call(hh.querySelectorAll("i"),function(it){it.style.transform="none";});
      },160);});
    }
  }

  /* ---------- Reveals + cotas que desenham (IntersectionObserver + gatilhos) ---------- */
  var reveals=[].slice.call(document.querySelectorAll("[data-reveal]"));
  // stagger automático entre irmãos
  var seen={};
  reveals.forEach(function(el){
    var p=el.parentNode, k=[].indexOf.call(p.children,el);
    var sibs=[].filter.call(p.children,function(c){return c.hasAttribute&&c.hasAttribute("data-reveal");});
    if(sibs.length>1){var idx=sibs.indexOf(el); if(idx>0) el.style.transitionDelay=Math.min(idx,6)*80+"ms";}
  });
  var draws=[].slice.call(document.querySelectorAll(".draw"));
  draws.forEach(function(p){ try{var L=p.getTotalLength(); p.style.setProperty("--len",L); }catch(e){} });

  function show(el){ el.classList.add("in"); }
  if(REDUCE){ reveals.forEach(show); draws.forEach(show); }
  else{
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ show(e.target); io.unobserve(e.target);} });
    },{threshold:.12,rootMargin:"0px 0px -7% 0px"});
    reveals.forEach(function(el){io.observe(el);});
    var iod=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ show(e.target); iod.unobserve(e.target);} });
    },{threshold:.2});
    draws.forEach(function(el){iod.observe(el);});
    // gatilho 1: primeira tela por timer (não depende de IO em aba de fundo)
    setTimeout(function(){
      reveals.concat(draws).forEach(function(el){
        var r=el.getBoundingClientRect(); if(r.top<innerHeight*0.92) show(el);
      });
    },150);
    // gatilho 3: flush em salto de scroll
    addEventListener("scroll",function(){
      reveals.forEach(function(el){ if(!el.classList.contains("in")){ var r=el.getBoundingClientRect(); if(r.bottom<innerHeight*0.3) show(el);} });
    },{passive:true});
  }

  /* ---------- Hero ready (marcas de registro) ---------- */
  var hero=document.getElementById("hero");
  if(hero){ setTimeout(function(){hero.classList.add("ready");},220); }

  /* ---------- Contadores ---------- */
  function animCount(el){
    var target=+el.getAttribute("data-count"), dur=1500, t0=null;
    function step(t){ if(!t0)t0=t; var p=Math.min((t-t0)/dur,1); var e=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*e); if(p<1) requestAnimationFrame(step); else el.textContent=target; }
    requestAnimationFrame(step);
    setTimeout(function(){el.textContent=target;},dur+160); // rede de segurança headless
  }
  var counters=[].slice.call(document.querySelectorAll("[data-count]"));
  if(REDUCE){ counters.forEach(function(el){el.textContent=el.getAttribute("data-count");}); }
  else{
    var ioc=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ animCount(e.target); ioc.unobserve(e.target);} });
    },{threshold:.4});
    counters.forEach(function(el){ioc.observe(el);});
    setTimeout(function(){counters.forEach(function(el){ if(el.textContent==="0"){ var r=el.getBoundingClientRect(); if(r.top<innerHeight) animCount(el);} });},400);
  }

  /* ---------- Scrollspy: marcador triangular do nav ---------- */
  var links=[].slice.call(document.querySelectorAll(".nav a"));
  var map=links.map(function(a){var id=a.getAttribute("href").slice(1);return {a:a,sec:document.getElementById(id)};}).filter(function(m){return m.sec;});
  function spy(){
    var mid=innerHeight*0.42, cur=null;
    map.forEach(function(m){ var r=m.sec.getBoundingClientRect(); if(r.top<=mid) cur=m; });
    links.forEach(function(a){a.classList.remove("active");});
    if(cur) cur.a.classList.add("active");
  }
  addEventListener("scroll",spy,{passive:true}); spy();

  /* ---------- Âncoras com desconto do header ---------- */
  document.addEventListener("click",function(e){
    var a=e.target.closest('a[href^="#"]'); if(!a) return;
    var id=a.getAttribute("href"); if(id.length<2) return;
    var t=document.querySelector(id); if(!t) return;
    e.preventDefault();
    var top=t.getBoundingClientRect().top+window.pageYOffset-64;
    window.scrollTo({top:top,behavior:REDUCE?"auto":"smooth"});
  });

  /* ---------- Lerp de roda (só ponteiro fino, sem reduced-motion) ---------- */
  if(FINE && !REDUCE){
    var target=window.pageYOffset, current=target, ticking=false;
    function overScrollable(node){ for(var i=0;i<8&&node&&node!==document.body;i++){ var s=getComputedStyle(node); if(/(auto|scroll)/.test(s.overflowY)&&node.scrollHeight>node.clientHeight) return true; node=node.parentNode; } return false; }
    addEventListener("wheel",function(e){
      if(e.ctrlKey) return; if(document.body.style.overflow==="hidden") return;
      if(overScrollable(e.target)) return;
      e.preventDefault();
      target=Math.max(0,Math.min(target+e.deltaY,document.documentElement.scrollHeight-innerHeight));
      if(!ticking){ ticking=true; requestAnimationFrame(loop); }
    },{passive:false});
    function loop(){ current+=(target-current)*0.105; if(Math.abs(target-current)<0.5){current=target;ticking=false;} window.scrollTo(0,current); if(ticking) requestAnimationFrame(loop); }
    addEventListener("scroll",function(){ if(!ticking){ current=target=window.pageYOffset; } },{passive:true});
  }

  /* ---------- Lightbox de obras ---------- */
  var works=[].slice.call(document.querySelectorAll(".work"));
  var lb=document.getElementById("lb"), lbImg=document.getElementById("lb-img"),
      lbCap=document.getElementById("lb-cap"), lbCount=document.getElementById("lb-count"), idx=0;
  function items(){return works.map(function(w){return {src:w.getAttribute("data-full"),cap:(w.querySelector("h3")||{}).textContent||""};});}
  var LIST=items();
  function openLb(i){ idx=i; render(); lb.classList.add("open"); document.body.style.overflow="hidden"; document.getElementById("lb-x").focus(); }
  function closeLb(){ lb.classList.remove("open"); document.body.style.overflow=""; if(works[idx]) works[idx].focus&&works[idx].focus(); }
  function render(){ var it=LIST[idx]; lbImg.src=it.src; lbImg.alt=it.cap; lbCap.textContent=it.cap; lbCount.textContent=(idx+1)+" / "+LIST.length; }
  function go(d){ idx=(idx+d+LIST.length)%LIST.length; render(); }
  works.forEach(function(w,i){ w.setAttribute("tabindex","0"); w.setAttribute("role","button");
    w.addEventListener("click",function(){openLb(i);});
    w.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){e.preventDefault();openLb(i);} });
  });
  document.getElementById("lb-x").addEventListener("click",closeLb);
  document.getElementById("lb-prev").addEventListener("click",function(){go(-1);});
  document.getElementById("lb-next").addEventListener("click",function(){go(1);});
  lb.addEventListener("click",function(e){ if(e.target===lb) closeLb(); });
  addEventListener("keydown",function(e){ if(!lb.classList.contains("open"))return;
    if(e.key==="Escape")closeLb(); else if(e.key==="ArrowLeft")go(-1); else if(e.key==="ArrowRight")go(1); });
  // swipe
  var sx=0; lb.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>50)go(dx>0?-1:1);},{passive:true});

  /* ---------- Consentimento de cookies (LGPD) + dataLayer ---------- */
  window.dataLayer=window.dataLayer||[];
  var ck=document.getElementById("cookie");
  function consent(v){
    try{localStorage.setItem("metrea_consent",v);}catch(e){}
    window.dataLayer.push({event:"cookie_consent",consent:v,
      analytics_storage:v==="accepted"?"granted":"denied",
      ad_storage:v==="accepted"?"granted":"denied"});
    ck.classList.remove("show");
  }
  var saved=null; try{saved=localStorage.getItem("metrea_consent");}catch(e){}
  if(!saved){ setTimeout(function(){ck.classList.add("show");},1400); }
  else { window.dataLayer.push({event:"cookie_consent",consent:saved,
      analytics_storage:saved==="accepted"?"granted":"denied",ad_storage:saved==="accepted"?"granted":"denied"}); }
  var cy=document.getElementById("ck-yes"),cn=document.getElementById("ck-no");
  if(cy) cy.addEventListener("click",function(){consent("accepted");});
  if(cn) cn.addEventListener("click",function(){consent("rejected");});
})();
