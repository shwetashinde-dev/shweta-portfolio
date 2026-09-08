const menu=document.querySelector('.menu-toggle');
const mobile=document.querySelector('.mobile-nav');
menu?.addEventListener('click',()=>{const open=mobile.classList.toggle('open');menu.setAttribute('aria-expanded',open);mobile.setAttribute('aria-expanded',open);mobile.setAttribute('aria-hidden',!open);});
document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');menu.setAttribute('aria-expanded','false');mobile.setAttribute('aria-hidden','true');}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting) e.target.classList.add('visible');
  else if(!e.target.classList.contains('keep-visible')) e.target.classList.remove('visible');
}),{threshold:.14,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
// Stage the major section blocks too, so the page feels alive as each chapter enters the viewport.
const stagedSelectors='.section-top,.section-intro,.resume-layout,.resume-grid,.skills-grid,.education-grid,.cert-marquee,.project-stack,.timeline';
document.querySelectorAll(stagedSelectors).forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});

const counters=document.querySelectorAll('.impact-item[data-target]');
const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting) return;
  const el=entry.target;
  if(el.dataset.ran==='true') return;
  el.dataset.ran='true';
  const number=el.querySelector('strong');
  const target=Number(el.dataset.target||0);
  const suffix=el.dataset.suffix||'';
  const duration=1400;
  const start=performance.now();
  const ease=t=>1-Math.pow(1-t,3);
  const tick=now=>{
    const p=Math.min(1,(now-start)/duration);
    number.textContent=Math.round(target*ease(p))+suffix;
    if(p<1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}),{threshold:.5});
counters.forEach(el=>counterObserver.observe(el));

const timelineObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.timeline-item').forEach(x=>x.classList.remove('active'));e.target.classList.add('active')}}),{threshold:.45});
document.querySelectorAll('.timeline-item').forEach(el=>timelineObserver.observe(el));
